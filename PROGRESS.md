# Codex AI Agent 源码分析 — 任务管理

> 本文件是整个项目的独立任务管理中心，追踪 Wiki 结构演进、当前进度和中间产物。

## 项目信息

- **源码仓库**: https://github.com/openai/codex
- **源码本地路径**: `/Users/zoujie.wu/workspace/codex-source/`
- **产出仓库**: `/Users/zoujie.wu/workspace/learn-codex/`
- **项目目标**: 产出一套中文 Wiki，深入分析 Codex CLI 的 AI Agent 工作机制

## Wiki 结构规划（演进式，随分析深入调整）

| 编号 | 文件名 | 章节标题 | 状态 | 说明 |
|------|--------|---------|------|------|
| - | `wiki/README.md` | Wiki 首页 | DRAFT | 导航中心 |
| 00 | `wiki/00-project-overview.md` | 项目全景概览 | REVIEW | 项目结构、技术栈、入口链路 |
| 01 | `wiki/01-architecture-overview.md` | 架构总览 | DRAFT | 四层架构、核心抽象、数据流 |
| 02 | `wiki/02-prompt-and-tools.md` | 提示词与工具解析 | DRAFT | 完整 prompt 结构、工具定义、消息格式 |
| 02a | `wiki/02a-system-prompt-full.md` | (附录) Base Instructions 原文 | DRAFT | 14,700 字符完整原文 |
| 02b | `wiki/02b-developer-message-full.md` | (附录) Developer Message 原文 | DRAFT | 19,800 字符，5 个 Block |
| 03 | `wiki/03-agent-loop.md` | Agent Loop 深度剖析 | DRAFT | run_turn、采样、真实任务串讲 |
| 04 | `wiki/04-tool-system.md` | 工具系统设计 | NOT_STARTED | 工具分发、执行、沙箱 |
| 05 | `wiki/05-context-management.md` | 上下文与对话管理 | NOT_STARTED | 历史管理、压缩、Token |
| 06 | `wiki/06-sub-agent-system.md` | 子 Agent 与任务委派 | NOT_STARTED | 多 Agent、信箱、编排 |
| 07 | `wiki/07-approval-safety.md` | 审批与安全系统 | NOT_STARTED | 策略、Guardian、沙箱 |
| 08 | `wiki/08-api-model-interaction.md` | API 与模型交互 | NOT_STARTED | 客户端、流式传输、多供应商 |
| 09 | `wiki/09-sdk-protocol.md` | SDK 与协议 | NOT_STARTED | Op/Event、JSON-RPC、SDK |
| 10 | `wiki/10-config-system.md` | 配置系统 | NOT_STARTED | 配置分层、Feature flags |

> 状态定义：NOT_STARTED → IN_PROGRESS → DRAFT → REVIEW → DONE

## 中间产物追踪

| 产物 | 位置 | 关联章节 | 状态 |
|------|------|---------|------|
| 项目结构总览图 | 嵌入在 00-project-overview.md | 00 | 已创建 |
| 入口链路流程图 | 嵌入在 00-project-overview.md | 00 | 已创建 |
| Crate 依赖关系图 | 嵌入在 00-project-overview.md | 00, 01 | 已创建 |

## 每轮工作记录

### Round 1 (2026-04-12)
- **目标**: 创建项目骨架 + 完成第一章「项目全景概览」
- **完成**:
  - [x] 创建目录结构 (wiki/, diagrams/, wiki/images/)
  - [x] 创建 PROGRESS.md（任务管理文件）
  - [x] 创建 PROJECT.md（项目总目标文档，供多 Agent 协作使用）
  - [x] 创建 wiki/README.md（Wiki 首页骨架）
  - [x] 创建 wiki/00-project-overview.md（项目全景概览，DRAFT 状态）
- **产出**:
  - `PROJECT.md` — 项目总目标，包含分析维度、章节规划、工作流程、质量标准
  - `wiki/00-project-overview.md` — 7 个章节：Codex 简介、单仓结构、88 Crate 全景分类（含 Mermaid 图）、启动链路全追踪（含时序图）、核心依赖关系图、构建与任务工具链、小结
- **发现的问题**:
  - `codex-core` 是最大的 crate（398 个 .rs 文件，核心 codex.rs 7931 行），官方也在 AGENTS.md 中提醒要控制其膨胀
  - 仓库有多个 fork 的第三方依赖（ratatui, tungstenite, crossterm），说明对底层有定制需求
- **下一步**: 用户 review 第 00 章 + review agent 审核 → 然后进入第 01 章「架构总览」

### Round 2 (2026-04-12)
- **目标**: 根据 review 修正第 00 章的事实错误，并补齐总体结构中容易遗漏的部分
- **完成**:
  - [x] 将 crate 数量从 89 修正为 88
  - [x] 修正 `codex-core` 依赖关系图的箭头方向
  - [x] 重写 TUI / App Server / Core 的启动链说明
  - [x] 补充插件、连接器、云与远程模块的结构说明
  - [x] 为关键段落补充源码路径与行号范围
- **产出**:
  - `wiki/00-project-overview.md` — 已修正为基于本地源码快照的版本，并新增“从总体结构看最容易遗漏的三层”
- **状态调整**:
  - 第 00 章从 `DRAFT` 更新为 `REVIEW`
- **下一步**: 用户确认第 00 章通过后，进入第 01 章「架构总览」

### Round 3 (2026-04-12)
- **目标**: 完成第 01 章「架构总览」
- **完成**:
  - [x] 深入阅读 codex.rs、thread_manager.rs、codex_thread.rs、state/、protocol.rs 等核心源码
  - [x] 创建 wiki/01-architecture-overview.md
- **产出**:
  - `wiki/01-architecture-overview.md` — 6 个章节：四层架构图、六个核心抽象（ThreadManager/CodexThread/Codex/Session/TurnContext/Op-Event）、数据流全追踪（时序图）、表示层三种接入方式、状态管理三层模型、小结
- **状态调整**:
  - 第 01 章设为 `DRAFT`
- **下一步**: 用户 review 第 01 章 → 然后进入第 02 章「Agent Loop 深度剖析」

### Round 4 (2026-04-12)
- **目标**: 抓取 Codex 执行真实任务的完整 API 数据，为第 02 章准备素材
- **完成**:
  - [x] 编写 Node.js 转发代理脚本 (`scripts/capture-proxy.mjs`)
  - [x] 通过 `codex debug prompt-input` 获取完整初始 prompt（14,732 字符 base instructions）
  - [x] 用户在终端运行 TODOMVC 任务，从 rollout JSONL 提取完整对话数据
  - [x] 解析并整理抓取数据到 `diagrams/todomvc-capture/`
- **产出**:
  - `scripts/capture-proxy.mjs` — Node.js API 转发代理（可选工具）
  - `diagrams/todomvc-capture/README.md` — 数据说明和对话流程摘要
  - `diagrams/todomvc-capture/*.json` / `*.txt` — 提取的 prompt、对话、turn context 等（已 gitignore）
- **关键发现**:
  - Codex 优先使用 WebSocket 连接 (`ws://`), HTTP SSE 是回退方案
  - ChatGPT 登录 token 权限与 API key 不同，走代理时 API 写入可能受限
  - `codex debug prompt-input` + rollout JSONL 组合是最实用的零编译数据获取方案
  - 完整 prompt 包含 3 层：base_instructions (14K) + developer 消息 (permissions/skills/plugins 20K) + user 上下文 (AGENTS.md 3.6K)
- **下一步**: 下一轮对话中基于抓取数据 + 源码分析编写第 02 章「Agent Loop 深度剖析」

### Round 5 (2026-04-12)
- **目标**: 基于真实 TODOMVC 任务数据 + 源码分析，编写第 02 章
- **完成**:
  - [x] 深入阅读 run_turn、run_sampling_request、tool spec、client_common 等源码
  - [x] 结合抓取的 13 步对话数据，编写 wiki/02-agent-loop.md
- **产出**:
  - `wiki/02-agent-loop.md` — 8 个章节：真实任务旅程（时序图）、Prompt 三层结构（base instructions / developer / user context）、Turn 主循环（run_turn 流程图）、采样请求五步流程、工具调用生命周期、Turn Context 真实数据、自动压缩机制、小结
- **状态调整**:
  - 第 02 章设为 `DRAFT`
- **下一步**: 用户 review 第 02 章 → 然后进入第 03 章「工具系统设计」
