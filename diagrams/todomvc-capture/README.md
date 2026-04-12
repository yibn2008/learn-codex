# TODOMVC 任务抓取数据

通过 `codex debug prompt-input` + rollout JSONL 文件抓取的完整数据。

## 文件说明

| 文件 | 说明 |
|------|------|
| `01-base-instructions.txt` | 完整的 base instructions（14,732 字符），即 Codex 的 system prompt |
| `02-developer-message.json` | developer 角色消息（permissions + skills + plugins 指令） |
| `03-user-context.json` | 自动注入的用户上下文（AGENTS.md + 环境信息） |
| `04-turn-context.json` | Turn 级配置快照（model、sandbox、approval 等） |
| `05-conversation.json` | 完整对话流（13 个 ResponseItem） |
| `06-full-rollout.json` | 原始 rollout 数据（28 条记录） |

## 对话流程摘要

```
[00] developer message → permissions + skills + plugins 指令 (19,790 chars)
[01] user message     → AGENTS.md 注入 + 环境上下文 (3,650 chars)
[02] user message     → "Create todomvc.html..." 用户输入 (96 chars)
[03] reasoning        → 模型内部思考
[04] assistant        → 回复：计划创建文件
[05] custom_tool_call → apply_patch 创建 /tmp/todomvc.html
[06] tool_output      → 文件创建成功
[07] assistant        → 回复：校验文件
[08] function_call    → exec_command: wc -l（并行调用 1）
[09] function_call    → exec_command: sed -n '1,20p'（并行调用 2）
[10] function_output  → 行数结果
[11] function_output  → 文件头部内容
[12] assistant        → 最终回复：文件已创建
```

## 数据来源

- 任务执行于 2026-04-12
- Codex 版本: 0.120.0
- 模型: gpt-5.4
- Rollout 文件: `~/.codex/sessions/2026/04/12/rollout-2026-04-12T15-33-12-019d809b-e067-7790-b119-c14bc62796c6.jsonl`
