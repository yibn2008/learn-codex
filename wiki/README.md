# Codex AI Agent 源码深度解析

> 本 Wiki 深入分析 [OpenAI Codex CLI](https://github.com/openai/codex) 的源码，以一个真实的 TODOMVC 任务为线索，完整拆解这个生产级 AI Agent 的工作机制。

## 阅读导航

### 基础篇 — 建立全局认知

| 章节 | 你将了解 |
|------|---------|
| [00 - 项目概览](00-project-overview.md) | Codex 是什么？Rust Crate 的分层结构、TypeScript → Rust 迁移与启动链路 |
| [01 - 架构总览](01-architecture-overview.md) | 四层架构（表示层→会话管理→Agent 核心→能力层）、6 个核心抽象、Op/Event 协议 |
| [02 - 提示词与工具解析](02-prompt-and-tools.md) | 通过真实抓包数据，逐层拆解发给 LLM 的完整请求：instructions + tools + messages |

### 核心篇 — Agent 如何工作

| 章节 | 你将了解 |
|------|---------|
| [03 - Agent Loop 深度剖析](03-agent-loop.md) | `run_turn()` 主循环的源码级解读：采样→工具执行→压缩→Stop Hooks |
| [04 - 工具系统设计](04-tool-system.md) | 工具从解析到执行的 5 阶段管线：Router→Runtime→Registry→Orchestrator→Handler |
| [05 - 上下文与对话管理](05-context-management.md) | ContextManager、差分更新、Token 估算、Pre-turn/Mid-turn 自动压缩 |
| [06 - 子 Agent 与任务委派](06-sub-agent-system.md) | AgentControl 生命周期、Mailbox 异步通信、角色系统、审批委托 |
| [07 - 审批与安全系统](07-approval-safety.md) | 三层安全架构：ExecPolicy 规则→Guardian AI 审查→OS 沙箱隔离 |
| [08 - API 与模型交互](08-api-model-interaction.md) | 模型管理、供应商适配、双级客户端、WebSocket/SSE 传输、请求构建与重试 |

### 延展篇 — 扩展与集成

| 章节 | 你将了解 |
|------|---------|
| [09 - MCP、Skills 与插件](09-mcp-skills-plugins.md) | 三种扩展机制：Skills 领域知识注入、MCP 外部工具协议、Plugin 打包分发 |
| [10 - 产品集成与 App Server](10-sdk-protocol.md) | Harness 思想、App Server 四组件、Thread/Turn/Item 会话模型、多产品接入与 SDK |
| [11 - 配置系统](11-config-system.md) | 值层 vs 约束层、Feature Flags、沙箱策略、审批预设 |

## 项目概况

```
OpenAI Codex CLI — 运行在本地的编码 AI Agent

技术栈    TypeScript (入口) + Rust (核心引擎) + Python/TS SDK
核心文件  codex.rs（Agent 主循环）
支持平台  macOS / Linux / Windows (arm64 + x64)
运行模式  交互式 TUI、非交互 Exec、App Server (IDE)、MCP Server
```

## 本 Wiki 覆盖情况

基于源码中 `use` 引用频次排序的前 25 个核心 Crate，本 Wiki 覆盖了其中 **21 个（84%）**。未覆盖的 4 个均为工具库或平台特定实现，不影响对 AI Agent 核心机制的理解。

```
✅ 已覆盖 (21)    codex-protocol, app-server-protocol, core, config,
                   login, features, otel, api, tools, exec-server,
                   execpolicy, model-provider-info, sandboxing, mcp,
                   client, execpolicy-legacy, models-manager, state,
                   exec, analytics, network-proxy

❌ 未覆盖 (4)     utils/absolute-path, windows-sandbox, git-utils,
                   utils/output-truncation
```

## 如何阅读

- **快速了解**：只读第 00 和 01 章，建立全局认知
- **理解 Agent 原理**：按顺序读 02→07，从提示词到安全系统逐层深入
- **查阅特定主题**：通过右侧目录直接跳转到感兴趣的章节

> **Rust 知识点**：本 Wiki 面向所有开发者，不要求 Rust 背景。遇到 `Arc<T>`、`trait`、`async/await` 等概念时，会以内联小贴士讲解。

## 数据来源

本 Wiki 的分析基于两类数据：

1. **源码静态分析** — 对 [openai/codex](https://github.com/openai/codex) 主分支的逐文件阅读
2. **运行时抓包** — 通过自定义 `model_provider`（`supports_websockets=false`）+ 代理抓取的完整 API 请求/响应（[查看完整请求数据](02-appendix/02-full-request-annotated.md)）

每个章节都经过 Codex adversarial review 核对源码事实。
