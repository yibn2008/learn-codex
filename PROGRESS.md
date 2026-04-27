# Codex AI Agent 源码分析 — 任务管理

> 本文件是整个项目的独立任务管理中心，追踪 Wiki 结构演进、当前进度和中间产物。

## 项目信息

- **源码仓库**: https://github.com/openai/codex
- **源码本地路径**: `.codex-source/`（运行 `./setup.sh` 自动克隆）
- **项目目标**: 产出一套中文 Wiki，深入分析 Codex CLI 的 AI Agent 工作机制

## Wiki 结构规划（演进式，随分析深入调整）

| 编号 | 文件名 | 章节标题 | 状态 | 说明 |
|------|--------|---------|------|------|
| - | `wiki/README.zh.md` | Wiki 首页 | DRAFT | 导航中心 |
| 00 | `wiki/00-project-overview.zh.md` | 项目全景概览 | REVIEW | 项目结构、技术栈、入口链路 |
| 01 | `wiki/01-architecture-overview.zh.md` | 架构总览 | DRAFT | 四层架构、核心抽象、数据流 |
| 02 | `wiki/02-prompt-and-tools.zh.md` | 提示词与工具解析 | DRAFT | 完整 prompt 结构、工具定义、消息格式 |
| 02a | `wiki/02a-system-prompt-full.md` | (附录) Base Instructions 原文 | DRAFT | 14,700 字符完整原文 |
| 02b | `wiki/02b-developer-message-full.md` | (附录) Developer Message 原文 | DRAFT | 19,800 字符，5 个 Block |
| 03 | `wiki/03-agent-loop.zh.md` | Agent Loop 深度剖析 | DRAFT | run_turn、采样、真实任务串讲 |
| 04 | `wiki/04-tool-system.zh.md` | 工具系统设计 | DRAFT | 工具分发、并行控制、审批沙箱 |
| 05 | `wiki/05-context-management.zh.md` | 上下文与对话管理 | DRAFT | ContextManager、差分更新、压缩、Token 估算 |
| 06 | `wiki/06-sub-agent-system.zh.md` | 子 Agent 与任务委派 | DRAFT | AgentControl、Mailbox、v2 工具、审批委托 |
| 07 | `wiki/07-approval-safety.zh.md` | 审批与安全系统 | DRAFT | 三层架构、ExecPolicy、Guardian、Sandbox、网络 |
| 08 | `wiki/08-api-model-interaction.zh.md` | API 与模型交互 | DRAFT | 双级客户端、WebSocket/SSE、多供应商 |
| 09 | `wiki/09-sdk-protocol.zh.md` | SDK 与协议 | DRAFT | Op/Event 协议、App Server、TS/Python SDK |
| 10 | `wiki/10-config-system.zh.md` | 配置系统 | DRAFT | 分层合并、Feature Flags、权限配置 |

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
  - [x] 创建 wiki/README.zh.md（Wiki 首页骨架）
  - [x] 创建 wiki/00-project-overview.zh.md（项目全景概览，DRAFT 状态）
- **产出**:
  - `PROJECT.md` — 项目总目标，包含分析维度、章节规划、工作流程、质量标准
  - `wiki/00-project-overview.zh.md` — 7 个章节：Codex 简介、单仓结构、Crate 全景分类（含 Mermaid 图）、启动链路全追踪（含时序图）、核心依赖关系图、构建与任务工具链、小结
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
  - `wiki/00-project-overview.zh.md` — 已修正为基于本地源码快照的版本，并新增“从总体结构看最容易遗漏的三层”
- **状态调整**:
  - 第 00 章从 `DRAFT` 更新为 `REVIEW`
- **下一步**: 用户确认第 00 章通过后，进入第 01 章「架构总览」

### Round 3 (2026-04-12)
- **目标**: 完成第 01 章「架构总览」
- **完成**:
  - [x] 深入阅读 codex.rs、thread_manager.rs、codex_thread.rs、state/、protocol.rs 等核心源码
  - [x] 创建 wiki/01-architecture-overview.zh.md
- **产出**:
  - `wiki/01-architecture-overview.zh.md` — 6 个章节：四层架构图、六个核心抽象（ThreadManager/CodexThread/Codex/Session/TurnContext/Op-Event）、数据流全追踪（时序图）、表示层三种接入方式、状态管理三层模型、小结
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
  - [x] 结合抓取的 13 步对话数据，编写 wiki/02-agent-loop.zh.md
- **产出**:
  - `wiki/02-agent-loop.zh.md` — 8 个章节：真实任务旅程（时序图）、Prompt 三层结构（base instructions / developer / user context）、Turn 主循环（run_turn 流程图）、采样请求五步流程、工具调用生命周期、Turn Context 真实数据、自动压缩机制、小结
- **状态调整**:
  - 第 02 章设为 `DRAFT`
- **下一步**: 用户 review 第 02 章 → 然后进入第 03 章「工具系统设计」

### Round 6 (2026-04-12)
- **目标**: 抓取完整 API 请求体（含 tools 定义），重构第 02 章
- **完成**:
  - [x] 通过自定义 model_provider（`supports_websockets=false`）+ Node.js 代理成功抓取完整 API 请求
  - [x] 抓到 3 轮完整请求/响应（含 77 个工具定义、14K instructions、多轮 messages）
  - [x] 将附录子页面移到 `wiki/02-appendix/` 子目录
  - [x] 从 index.html 侧边栏移除附录页面
- **产出**:
  - `diagrams/todomvc-capture/0001~0003-*.json` — 完整的 3 轮 API 请求/响应 dump（已 gitignore）
  - `scripts/capture-proxy-v2.mjs` — 改进版代理（替换 auth + 拒绝 WS）
  - `wiki/02-appendix/` — 附录子目录
- **关键发现**:
  - 正确的抓包方法：自定义 `model_providers` 配置 `supports_websockets=false` + Node.js 代理替换 auth
  - 单次请求包含 77 个工具定义（16 核心 + 61 GitHub MCP）
  - 每轮请求都携带完整的 instructions（14,732 字符）和所有工具定义
- **抓包命令参考**:
  ```bash
  # 1. 启动代理
  node scripts/capture-proxy-v2.mjs --port 9999 --out-dir ./diagrams/todomvc-capture &
  # 2. 执行任务
  export OPENAI_API_KEY=$(grep OPENAI_API_KEY .env | cut -d= -f2)
  codex exec \
    -c 'model_providers.capture.name="Capture"' \
    -c 'model_providers.capture.base_url="http://localhost:9999"' \
    -c 'model_providers.capture.wire_api="responses"' \
    -c 'model_providers.capture.supports_websockets=false' \
    -c 'model_providers.capture.env_key="OPENAI_API_KEY"' \
    -c 'model_provider="capture"' \
    "your task"
  ```
- **下一步**: 基于完整抓包数据重写第 02 章，逐条消息注解
