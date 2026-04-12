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
| 00 | `wiki/00-project-overview.md` | 项目全景概览 | DRAFT | 项目结构、技术栈、入口链路 |
| 01 | `wiki/01-architecture-overview.md` | 架构总览 | NOT_STARTED | 四层架构、核心抽象、数据流 |
| 02 | `wiki/02-agent-loop.md` | Agent Loop 深度剖析 | NOT_STARTED | run_turn、采样、流式处理 |
| 03 | `wiki/03-tool-system.md` | 工具系统设计 | NOT_STARTED | 工具分发、执行、沙箱 |
| 04 | `wiki/04-context-management.md` | 上下文与对话管理 | NOT_STARTED | 历史管理、压缩、Token |
| 05 | `wiki/05-sub-agent-system.md` | 子 Agent 与任务委派 | NOT_STARTED | 多 Agent、信箱、编排 |
| 06 | `wiki/06-approval-safety.md` | 审批与安全系统 | NOT_STARTED | 策略、Guardian、沙箱 |
| 07 | `wiki/07-api-model-interaction.md` | API 与模型交互 | NOT_STARTED | 客户端、流式传输、多供应商 |
| 08 | `wiki/08-prompt-engineering.md` | 提示工程 | NOT_STARTED | 系统消息、模板、动态注入 |
| 09 | `wiki/09-sdk-protocol.md` | SDK 与协议 | NOT_STARTED | Op/Event、JSON-RPC、SDK |
| 10 | `wiki/10-config-system.md` | 配置系统 | NOT_STARTED | 配置分层、Feature flags |

> 状态定义：NOT_STARTED → IN_PROGRESS → DRAFT → REVIEW → DONE

## 中间产物追踪

| 产物 | 位置 | 关联章节 | 状态 |
|------|------|---------|------|
| 项目结构总览图 | 嵌入在 00-project-overview.md | 00 | 待创建 |
| 入口链路流程图 | 嵌入在 00-project-overview.md | 00 | 待创建 |
| Crate 依赖关系图 | diagrams/ | 00, 01 | 待创建 |

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
  - `wiki/00-project-overview.md` — 7 个章节：Codex 简介、单仓结构、89 Crate 全景分类（含 Mermaid 图）、启动链路全追踪（含时序图）、核心依赖关系图、构建系统、小结
- **发现的问题**:
  - `codex-core` 是最大的 crate（398 个 .rs 文件，核心 codex.rs 7931 行），官方也在 AGENTS.md 中提醒要控制其膨胀
  - 仓库有多个 fork 的第三方依赖（ratatui, tungstenite, crossterm），说明对底层有定制需求
- **下一步**: 用户 review 第 00 章 + review agent 审核 → 然后进入第 01 章「架构总览」
