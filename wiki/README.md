# Codex AI Agent — Source-Level Deep Dive

> **Language**: **English** · [中文](README.zh.md)

> This Wiki dissects the source of [OpenAI Codex CLI](https://github.com/openai/codex). Using a real TODOMVC task as the connecting thread, it walks through how this production-grade AI agent actually works.

> **Translation status**: all 12 chapters and the full-request appendix are now available in English. The Chinese original remains the source-of-truth document and is updated first when content changes.

## Reading guide

### Foundations — global picture

| Chapter | What you'll learn |
|---------|-------------------|
| [00 — Project overview](00-project-overview.md) | What is Codex? Rust crate layout, the TypeScript→Rust transition, and the startup chain |
| [01 — Architecture overview](01-architecture-overview.md) | The four-layer architecture (presentation → session → agent core → capability), six core abstractions, the Op/Event protocol |
| [02 — Prompts and tools](02-prompt-and-tools.md) | A real captured request, peeled apart layer by layer: instructions + tools + messages |

### Core — how the agent works

| Chapter | What you'll learn |
|---------|-------------------|
| [03 — Agent Loop](03-agent-loop.md) | Source-level walkthrough of `run_turn()`: sampling → tool execution → compaction → stop hooks |
| [04 — Tool system](04-tool-system.md) | The 5-stage pipeline from parsing to execution: Router → Runtime → Registry → Orchestrator → Handler |
| [05 — Context management](05-context-management.md) | ContextManager, diff-based updates, token estimation, pre-turn / mid-turn auto-compaction |
| [06 — Sub-agents and delegation](06-sub-agent-system.md) | AgentControl lifecycle, mailbox-based async messaging, role system, approval delegation |
| [07 — Approvals and safety](07-approval-safety.md) | The three-layer safety architecture: ExecPolicy rules → Guardian AI review → OS sandbox |
| [08 — API and model interaction](08-api-model-interaction.md) | Model registry, provider adapters, two-tier client, WebSocket/SSE transport, request building and retry |

### Extensions — integration surface

| Chapter | What you'll learn |
|---------|-------------------|
| [09 — MCP, Skills, and plugins](09-mcp-skills-plugins.md) | Three extension mechanisms: Skills for domain knowledge injection, MCP for external tools, plugins for distribution |
| [10 — Product integration and the App Server](10-sdk-protocol.md) | The "harness" idea, the four App Server components, the Thread/Turn/Item conversation model, multi-product integration and SDKs |
| [11 — Configuration system](11-config-system.md) | Value layer vs. constraint layer, feature flags, sandbox policy, approval presets |

## Project at a glance

```
OpenAI Codex CLI — a coding AI agent that runs locally

Tech stack       TypeScript (entry) + Rust (core engine) + Python/TS SDK
Core file        codex.rs (the agent main loop)
Platforms        macOS / Linux / Windows (arm64 + x64)
Run modes        Interactive TUI, non-interactive Exec, App Server (IDE), MCP Server
```

## Coverage

Out of the top 25 most-used crates (ranked by `use` import frequency in the source), this Wiki covers **21 of them (84%)**. The remaining 4 are utility libraries or platform-specific implementations and don't affect understanding of the AI agent core.

```
Covered (21)     codex-protocol, app-server-protocol, core, config,
                  login, features, otel, api, tools, exec-server,
                  execpolicy, model-provider-info, sandboxing, mcp,
                  client, execpolicy-legacy, models-manager, state,
                  exec, analytics, network-proxy

Not covered (4)  utils/absolute-path, windows-sandbox, git-utils,
                  utils/output-truncation
```

## How to read this

- **Quick orientation**: read chapters 00 and 01 only — they establish the global picture
- **Understand the agent core**: read 02 → 07 in order, working from prompt structure down to the safety system
- **Look up a specific topic**: jump straight to a chapter via the right-side ToC

> **About Rust**: this Wiki is aimed at all developers and assumes no Rust background. When `Arc<T>`, `trait`, `async/await`, etc. come up, they are explained inline.

## Data sources

The analysis draws on two kinds of data:

1. **Static source reading** — file-by-file reading of the [openai/codex](https://github.com/openai/codex) main branch
2. **Runtime captures** — full API request/response data captured via a custom `model_provider` (`supports_websockets=false`) plus a proxy ([see the fully annotated request](02-appendix/02-full-request-annotated.md))

Each chapter is cross-checked against source via Codex adversarial review.

## Bilingual quick links

The "Reading guide" tables above link to the English versions (`xx.md`). To read the Chinese version of any chapter, append `.zh.md` to the filename, or use the table below.

| Chapter | English | 中文 |
|---------|---------|------|
| Wiki home | [README.md](README.md) | [README.zh.md](README.zh.md) |
| 00 — Project overview | [00-project-overview.md](00-project-overview.md) | [00-project-overview.zh.md](00-project-overview.zh.md) |
| 01 — Architecture overview | [01-architecture-overview.md](01-architecture-overview.md) | [01-architecture-overview.zh.md](01-architecture-overview.zh.md) |
| 02 — Prompts and tools | [02-prompt-and-tools.md](02-prompt-and-tools.md) | [02-prompt-and-tools.zh.md](02-prompt-and-tools.zh.md) |
| 02 appendix — Full request, annotated | [02-appendix/02-full-request-annotated.md](02-appendix/02-full-request-annotated.md) | [02-appendix/02-full-request-annotated.zh.md](02-appendix/02-full-request-annotated.zh.md) |
| 03 — Agent Loop | [03-agent-loop.md](03-agent-loop.md) | [03-agent-loop.zh.md](03-agent-loop.zh.md) |
| 04 — Tool system | [04-tool-system.md](04-tool-system.md) | [04-tool-system.zh.md](04-tool-system.zh.md) |
| 05 — Context management | [05-context-management.md](05-context-management.md) | [05-context-management.zh.md](05-context-management.zh.md) |
| 06 — Sub-agents and delegation | [06-sub-agent-system.md](06-sub-agent-system.md) | [06-sub-agent-system.zh.md](06-sub-agent-system.zh.md) |
| 07 — Approvals and safety | [07-approval-safety.md](07-approval-safety.md) | [07-approval-safety.zh.md](07-approval-safety.zh.md) |
| 08 — API and model interaction | [08-api-model-interaction.md](08-api-model-interaction.md) | [08-api-model-interaction.zh.md](08-api-model-interaction.zh.md) |
| 09 — MCP, Skills, and plugins | [09-mcp-skills-plugins.md](09-mcp-skills-plugins.md) | [09-mcp-skills-plugins.zh.md](09-mcp-skills-plugins.zh.md) |
| 10 — Product integration and App Server | [10-sdk-protocol.md](10-sdk-protocol.md) | [10-sdk-protocol.zh.md](10-sdk-protocol.zh.md) |
| 11 — Configuration system | [11-config-system.md](11-config-system.md) | [11-config-system.zh.md](11-config-system.zh.md) |

In the web preview ([index.html](../index.html)), use the `EN / 中文` toggle in the top-left of the sidebar to switch language globally.
