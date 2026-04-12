#!/usr/bin/env node
// Capture proxy that replaces auth with a real API key and dumps full request/response.
// Handles SSE streaming responses properly.

import http from "node:http";
import https from "node:https";
import { writeFileSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const port = parseInt(args[args.indexOf("--port") + 1] || "9999", 10);
const outDir = args[args.indexOf("--out-dir") + 1] || "./diagrams/todomvc-capture";

// Read API key from .env file
const envContent = readFileSync(".env", "utf-8");
const apiKey = envContent.match(/OPENAI_API_KEY=(.+)/)?.[1]?.trim();
if (!apiKey) { console.error("No OPENAI_API_KEY found in .env"); process.exit(1); }

mkdirSync(outDir, { recursive: true });
let seq = 0;

const server = http.createServer((req, res) => {
  // Reject WebSocket upgrade attempts immediately so Codex falls back to HTTP SSE
  if (req.headers.upgrade && req.headers.upgrade.toLowerCase() === "websocket") {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("WebSocket not supported by capture proxy");
    return;
  }

  const id = String(++seq).padStart(4, "0");
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const chunks = [];

  req.on("data", (c) => chunks.push(c));
  req.on("end", () => {
    const body = Buffer.concat(chunks).toString("utf-8");
    let parsedBody;
    try { parsedBody = JSON.parse(body); } catch { parsedBody = body; }

    // Save request (redact original auth)
    const reqHeaders = { ...req.headers };
    reqHeaders.authorization = "[ORIGINAL_REDACTED]";
    delete reqHeaders.host;

    const reqData = { id, timestamp: new Date().toISOString(), method: req.method, path: req.url, headers: reqHeaders, body: parsedBody };
    writeFileSync(join(outDir, `${id}-${ts}-request.json`), JSON.stringify(reqData, null, 2));
    console.log(`[${id}] ${req.method} ${req.url} (${body.length} bytes)`);

    // Forward to OpenAI with real API key
    const url = new URL(`/v1${req.url}`, "https://api.openai.com");
    const fwdHeaders = { ...req.headers, host: "api.openai.com", authorization: `Bearer ${apiKey}` };

    const proxyReq = https.request(url, { method: req.method, headers: fwdHeaders }, (proxyRes) => {
      const isSSE = (proxyRes.headers["content-type"] || "").includes("text/event-stream");

      // Forward headers immediately for streaming
      res.writeHead(proxyRes.statusCode, proxyRes.headers);

      const resChunks = [];
      proxyRes.on("data", (c) => { resChunks.push(c); res.write(c); });
      proxyRes.on("end", () => {
        const resBody = Buffer.concat(resChunks).toString("utf-8");
        let parsedResBody;
        if (isSSE) {
          // Parse SSE events
          parsedResBody = resBody.split("\n").filter(l => l.startsWith("data: ")).map(l => {
            const d = l.slice(6);
            try { return JSON.parse(d); } catch { return d; }
          });
        } else {
          try { parsedResBody = JSON.parse(resBody); } catch { parsedResBody = resBody; }
        }

        const resData = { id, status: proxyRes.statusCode, isSSE, headers: proxyRes.headers, body: parsedResBody };
        writeFileSync(join(outDir, `${id}-${ts}-response.json`), JSON.stringify(resData, null, 2));
        console.log(`[${id}] Response: ${proxyRes.statusCode} ${isSSE ? "(SSE)" : ""} (${resBody.length} bytes)`);
        res.end();
      });
    });

    proxyReq.on("error", (err) => {
      console.error(`[${id}] Error:`, err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: err.message }));
    });

    if (body) proxyReq.write(body);
    proxyReq.end();
  });
});

server.on("upgrade", (req, socket) => {
  // Refuse WebSocket upgrades to force HTTP SSE fallback
  socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
  socket.destroy();
});

server.listen(port, () => {
  console.log(`Capture proxy v2 on http://localhost:${port}`);
  console.log(`Auth: using API key from .env`);
  console.log(`WebSocket: rejected (forces HTTP SSE fallback)`);
  console.log(`Dump: ${outDir}/`);
});
