# Codex AI Agent 源码深度解析

> 本 Wiki 深入分析 [OpenAI Codex CLI](https://github.com/openai/codex) 的源码，聚焦其 AI Agent 的核心工作机制。

## 阅读导航

### 基础篇

| 章节 | 内容概要 |
|------|---------|
| [00 - 项目全景概览](00-project-overview.md) | Codex 是什么？项目结构、技术栈、Crate 全景、入口链路追踪 |
| [01 - 架构总览](01-architecture-overview.md) | 四层架构设计、核心抽象、Session 生命周期、数据流全貌 |

### 核心篇 — AI Agent 工作机制

| 章节 | 内容概要 |
|------|---------|
| [02 - Agent Loop 深度剖析](02-agent-loop.md) | Turn 主循环、采样请求、流式处理、任务状态机 |
| [03 - 工具系统设计](03-tool-system.md) | 工具四层架构、分发与执行、并行调用、沙箱集成 |
| [04 - 上下文与对话管理](04-context-management.md) | 对话历史管理、Token 追踪、自动压缩、上下文窗口优化 |
| [05 - 子 Agent 与任务委派](05-sub-agent-system.md) | 多 Agent 架构、信箱通信、Agent 编排、任务委托 |
| [06 - 审批与安全系统](06-approval-safety.md) | 三层安全架构、执行策略、Guardian AI 审查、OS 沙箱 |

### 外围篇 — 支撑系统

| 章节 | 内容概要 |
|------|---------|
| [07 - API 与模型交互](07-api-model-interaction.md) | 模型客户端、SSE/WebSocket 双传输、多供应商支持 |
| [08 - 提示工程](08-prompt-engineering.md) | 系统消息构造、模板系统、动态上下文注入 |
| [09 - SDK 与协议](09-sdk-protocol.md) | Op/Event 协议、JSON-RPC、TypeScript/Python SDK |
| [10 - 配置系统](10-config-system.md) | 配置分层合并、Feature Flags、权限与沙箱策略 |

## 关于本项目

本 Wiki 基于对 Codex 源码的逐行分析编写，旨在帮助读者理解一个**生产级 AI Agent** 的完整设计。

- **源码版本**: 基于 [openai/codex](https://github.com/openai/codex) 主分支
- **技术栈**: TypeScript (入口包装) + Rust (核心引擎) + Python/TypeScript SDK
- **项目规模**: 89 个 Rust Crate，约 1,400+ 个 Rust 源文件

> **Rust 知识点说明**: 本 Wiki 面向所有开发者，不要求 Rust 背景。遇到 Rust 特有概念时，会以内联小贴士的形式讲解。
