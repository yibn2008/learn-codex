#!/usr/bin/env node
// Lightweight HTTP proxy that captures all requests/responses to JSON files.
// Usage: node capture-proxy.mjs [--port 8888] [--out-dir ./capture]
// Then set Codex: codex --config 'openai_base_url="http://localhost:8888"' "task"

import http from "node:http";
import https from "node:https";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const port = parseInt(args[args.indexOf("--port") + 1] || "8888", 10);
const outDir = args[args.indexOf("--out-dir") + 1] || "./diagrams/todomvc-capture";
const targetBase = "https://api.openai.com";
const pathPrefix = "/v1"; // Codex sends /responses, we prepend /v1

mkdirSync(outDir, { recursive: true });
let seq = 0;

const server = http.createServer(async (req, res) => {
  const id = String(++seq).padStart(4, "0");
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const chunks = [];

  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks).toString("utf-8");
    let parsedBody;
    try { parsedBody = JSON.parse(body); } catch { parsedBody = body; }

    // Redact auth header for safety
    const headers = { ...req.headers };
    if (headers.authorization) headers.authorization = "[REDACTED]";
    delete headers.host;

    const reqData = {
      id, timestamp: new Date().toISOString(),
      method: req.method, path: req.url,
      headers, body: parsedBody,
    };
    writeFileSync(join(outDir, `${id}-${ts}-request.json`), JSON.stringify(reqData, null, 2));
    console.log(`[${id}] ${req.method} ${req.url} (${body.length} bytes)`);

    // Forward to OpenAI (prepend /v1 to path)
    const url = new URL(`${pathPrefix}${req.url}`, targetBase);
    const proxyReq = https.request(url, {
      method: req.method,
      headers: { ...req.headers, host: url.host },
    }, (proxyRes) => {
      const resChunks = [];
      proxyRes.on("data", (c) => { resChunks.push(c); res.write(c); });
      proxyRes.on("end", () => {
        const resBody = Buffer.concat(resChunks).toString("utf-8");
        // For SSE streams, save raw text; for JSON, parse it
        let parsedResBody;
        try { parsedResBody = JSON.parse(resBody); } catch { parsedResBody = resBody; }

        const resData = {
          id, status: proxyRes.statusCode,
          headers: proxyRes.headers, body: parsedResBody,
        };
        writeFileSync(join(outDir, `${id}-${ts}-response.json`), JSON.stringify(resData, null, 2));
        console.log(`[${id}] Response: ${proxyRes.statusCode} (${resBody.length} bytes)`);
        res.end();
      });

      // Forward response headers
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
    });

    proxyReq.on("error", (err) => {
      console.error(`[${id}] Proxy error:`, err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    if (body) proxyReq.write(body);
    proxyReq.end();
  });
});

server.listen(port, () => {
  console.log(`Capture proxy listening on http://localhost:${port}`);
  console.log(`Forwarding to ${targetBase}${pathPrefix}`);
  console.log(`Saving captures to ${outDir}/`);
  console.log(`\nRun Codex with:\n  codex --config 'openai_base_url="http://localhost:${port}"' "your task"\n`);
});
