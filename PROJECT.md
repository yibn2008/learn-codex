# Codex AI Agent 源码深度解析 — 项目总目标

## 项目概述

本项目旨在对 [OpenAI Codex CLI](https://github.com/openai/codex) 的源码进行系统性深度分析，产出一套完整的**中文技术 Wiki**，聚焦其 **AI Agent 核心工作机制**。最终 Wiki 将以图文并茂的形式呈现，可用于技术分享和学习。

## 源码信息

- **分析目标**: OpenAI Codex CLI — 一个运行在本地的编码 AI Agent
- **源码仓库**: https://github.com/openai/codex
- **源码本地路径**: `.codex-source/`（运行 `./setup.sh` 自动克隆）
- **技术栈**: TypeScript (入口包装) + Rust (核心引擎)
- **核心文件**: `codex-rs/core/src/codex.rs` — 包含 Agent 主循环

## 分析维度

本 Wiki 从以下维度深入分析 Codex 的 AI Agent 工作机制：

| 维度 | 核心问题 | 关键源文件 |
|------|---------|-----------|
| **项目全景** | Codex 是什么？怎么组织的？ | `codex-cli/bin/codex.js`, `codex-rs/Cargo.toml` |
| **整体架构** | 四层架构如何协作？数据如何流转？ | `core/src/codex.rs`, `core/src/thread_manager.rs` |
| **Agent Loop** | 一个 Turn 是怎么执行的？ | `core/src/codex.rs` (run_turn) |
| **工具系统** | Agent 如何调用工具？如何执行？ | `core/src/tools/` 目录 |
| **上下文管理** | 对话历史如何管理？Token 如何控制？ | `core/src/context_manager/`, `core/src/compact.rs` |
| **子 Agent** | 多 Agent 如何协调？如何通信？ | `core/src/agent/`, `core/src/codex_delegate.rs` |
| **安全系统** | 三层安全机制如何保护用户？ | `core/src/exec_policy.rs`, `core/src/guardian/` |
| **API 交互** | 如何与 LLM 通信？流式传输如何工作？ | `core/src/client.rs`, `codex-api/src/` |
| **提示工程** | 系统消息如何构造？模板如何管理？ | `core/templates/`, `core/src/client_common.rs` |
| **SDK 协议** | 前后端如何通信？SDK 如何封装？ | `protocol/src/`, `sdk/`, `app-server-protocol/` |
| **配置系统** | 配置如何分层合并？Feature 如何管理？ | `core/src/config/`, `features/` |

## 产出结构

```
learn-codex/
├── PROJECT.md              ← 本文件：项目总目标（供 review agent 了解全局）
├── PROGRESS.md             ← 任务管理：章节状态、每轮记录、中间产物追踪
├── wiki/
│   ├── README.md           ← Wiki 首页（英文，默认）
│   ├── README.zh.md        ← Wiki 首页（中文）
│   ├── 00-project-overview.md      ← 英文章节（默认）
│   ├── 00-project-overview.zh.md   ← 中文章节
│   ├── 01-architecture-overview.md / .zh.md
│   ├── ...
│   └── images/             ← 图表资源
└── diagrams/               ← 中间分析产物
```

## Wiki 章节规划

| 编号 | 章节 | 层级 | 状态 |
|------|------|------|------|
| 00 | 项目全景概览 | 基础 | 见 PROGRESS.md |
| 01 | 架构总览 | 基础 | 见 PROGRESS.md |
| 02 | Agent Loop 深度剖析 | 核心 | 见 PROGRESS.md |
| 03 | 工具系统设计 | 核心 | 见 PROGRESS.md |
| 04 | 上下文与对话管理 | 核心 | 见 PROGRESS.md |
| 05 | 子 Agent 与任务委派 | 核心 | 见 PROGRESS.md |
| 06 | 审批与安全系统 | 核心 | 见 PROGRESS.md |
| 07 | API 与模型交互 | 外围 | 见 PROGRESS.md |
| 08 | 提示工程 | 外围 | 见 PROGRESS.md |
| 09 | SDK 与协议 | 外围 | 见 PROGRESS.md |
| 10 | 配置系统 | 外围 | 见 PROGRESS.md |

> **注意**: 章节结构是演进式的，可能随分析深入调整。实时状态请查看 [PROGRESS.md](PROGRESS.md)。

## 工作流程（多 Agent 协作）

```
┌─────────────────────────────────────────────────┐
│                   工作流程                        │
│                                                   │
│  ┌──────────┐    产出章节     ┌──────────┐         │
│  │ 写作    │ ──────────────→ │ 用户     │         │
│  │ Agent   │                 │ Review   │         │
│  └────┬────┘                 └────┬─────┘         │
│       │                          │                │
│       │    ┌──────────┐          │                │
│       │    │ Review   │←─────────┘                │
│       │    │ Agent    │   审核校验                  │
│       │    └────┬─────┘                           │
│       │         │                                 │
│       │    反馈修改意见                              │
│       │         │                                 │
│       ▼         ▼                                 │
│  ┌──────────────────────┐                         │
│  │     PROGRESS.md      │  ← 共享状态             │
│  │     PROJECT.md       │  ← 共享目标             │
│  └──────────────────────┘                         │
└─────────────────────────────────────────────────┘
```

1. **写作 Agent**: 按章节逐个深入分析源码，产出 Wiki 页面
2. **用户 Review**: 审阅每一章的内容质量和方向
3. **Review Agent**: 根据 PROJECT.md（本文件）了解全局目标，对照源码审核每章的准确性、完整性
4. **共享状态**: PROGRESS.md 记录实时进展，所有 Agent 和用户都可参考

## 质量标准

每个章节应满足：

1. **准确性**: 引用的源码路径、函数名、行为描述与实际代码一致
2. **完整性**: 覆盖该主题的关键设计决策和实现细节
3. **可读性**: 不熟悉 Rust 的读者也能理解（Rust 特有概念内联讲解）
4. **图文并茂**: 使用 Mermaid 图表辅助说明架构和流程
5. **源码关联**: 关键代码段落直接引用，标注文件路径和行号

## Rust 知识点处理

不设独立的 Rust 入门章节。遇到 Rust 特有概念时（如 `Arc<T>`、`async/await`、所有权、trait 对象等），以「知识点小贴士」的形式内联讲解。
