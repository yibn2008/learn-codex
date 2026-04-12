# 02 附录 — 完整 API 请求逐段注解

> 本文件是第 3 轮（最后一轮）Codex 向 LLM 发送的完整 Responses API 请求，按字段逐段展示并注解。
> 数据通过自定义 `model_provider` (`supports_websockets=false`) + Node.js 代理抓取。Codex v0.120.0, model gpt-5.4。

---

## 1. 请求顶层字段

```json
{
  "model": "gpt-5.4",
  "stream": true,
  "parallel_tool_calls": true,
  "reasoning": {
    "effort": "high"
  }
}
```

| 字段 | 值 | 说明 |
|------|-----|------|
| `model` | `gpt-5.4` | 使用的模型 |
| `stream` | `True` | 始终流式返回 |
| `parallel_tool_calls` | `True` | 允许模型在单次回复中并行调用多个工具 |
| `reasoning.effort` | `high` | 推理强度 |
| `reasoning.summary` | `?` | 推理摘要输出方式 |

## 2. instructions（系统指令，14,732 字符）

Agent 的人格底座。编译时从 markdown 模板嵌入，运行时不可修改。

```
You are Codex, a coding agent based on GPT-5. You and the user share the same workspace and collaborate to achieve the user's goals.

# Personality

You are a deeply pragmatic, effective software engineer. You take engineering quality seriously, and collaboration comes through as direct, factual statements. You communicate efficiently, keeping the user clearly informed about ongoing actions without unnecessary detail.

## Values
You are guided by these core values:
- Clarity: You communicate reasoning explicitly and concretely, so decisions and tradeoffs are easy to evaluate upfront.
- Pragmat

... [中间省略约 13,000 字符，完整内容见源码] ...

tain formatting).
- Before performing file edits of any kind, you provide updates explaining what edits you are making.
- As you are thinking, you very frequently provide updates even if not taking any actions, informing the user of your progress. You interrupt your thinking and send multiple updates in a row if thinking for more than 100 words.
- Tone of your updates MUST match your personality.

```

**完整源码**: [protocol/src/prompts/base_instructions/default.md](https://github.com/openai/codex/blob/main/codex-rs/protocol/src/prompts/base_instructions/default.md)

## 3. tools（16 个核心工具）

以下为过滤掉 61 个 MCP 插件工具后的 16 个核心工具定义。

### 3.1 `exec_command` [function]

> Runs a command in a PTY, returning output or a session ID for ongoing interaction.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cmd` | string | Y | Shell command to execute. |
| `justification` | string |  | Only set if sandbox_permissions is \"require_escalated\". |
| `login` | boolean |  | Whether to run the shell with -l/-i semantics. Defaults to t |
| `max_output_tokens` | number |  | Maximum number of tokens to return. Excess output will be tr |
| `prefix_rule` | array |  | Only specify when sandbox_permissions is `require_escalated` |
| `sandbox_permissions` | string |  | Sandbox permissions for the command. Set to "require_escalat |
| `shell` | string |  | Shell binary to launch. Defaults to the user's default shell |
| `tty` | boolean |  | Whether to allocate a TTY for the command. Defaults to false |
| `workdir` | string |  | Optional working directory to run the command in; defaults t |
| `yield_time_ms` | number |  | How long to wait (in milliseconds) for output before yieldin |

### 3.2 `write_stdin` [function]

> Writes characters to an existing unified exec session and returns recent output.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `chars` | string |  | Bytes to write to stdin (may be empty to poll). |
| `max_output_tokens` | number |  | Maximum number of tokens to return. Excess output will be tr |
| `session_id` | number | Y | Identifier of the running unified exec session. |
| `yield_time_ms` | number |  | How long to wait (in milliseconds) for output before yieldin |

### 3.3 `list_mcp_resources` [function]

> Lists resources provided by MCP servers. Resources allow servers to share data that provides context to language models,

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cursor` | string |  | Opaque cursor returned by a previous list_mcp_resources call |
| `server` | string |  | Optional MCP server name. When omitted, lists resources from |

### 3.4 `list_mcp_resource_templates` [function]

> Lists resource templates provided by MCP servers. Parameterized resource templates allow servers to share data that take

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `cursor` | string |  | Opaque cursor returned by a previous list_mcp_resource_templ |
| `server` | string |  | Optional MCP server name. When omitted, lists resource templ |

### 3.5 `read_mcp_resource` [function]

> Read a specific resource from an MCP server given the server name and resource URI.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `server` | string | Y | MCP server name exactly as configured. Must match the 'serve |
| `uri` | string | Y | Resource URI to read. Must be one of the URIs returned by li |

### 3.6 `update_plan` [function]

> Updates the task plan.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `explanation` | string |  |  |
| `plan` | array | Y | The list of steps |

### 3.7 `request_user_input` [function]

> Request user input for one to three short questions and wait for the response. This tool is only available in Plan mode.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `questions` | array | Y | Questions to show the user. Prefer 1 and do not exceed 3 |

### 3.8 `tool_suggest` [function]

> # Tool suggestion discovery

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action_type` | string | Y | Suggested action for the tool. Use "install" or "enable". |
| `suggest_reason` | string | Y | Concise one-line user-facing reason why this tool can help w |
| `tool_id` | string | Y | Connector or plugin id to suggest. Must be one of: figma@ope |
| `tool_type` | string | Y | Type of discoverable tool to suggest. Use "connector" or "pl |

### 3.9 `apply_patch` [custom]

> Use the `apply_patch` tool to edit files. This is a FREEFORM tool, so do not wrap the patch in JSON.

自由文本格式（非 JSON Schema），模型直接输出补丁文本。

### 3.10 `(unnamed)` [web_search]

### 3.11 `view_image` [function]

> View a local image from the filesystem (only use if given a full filepath by the user, and the image isn't already attac

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `path` | string | Y | Local filesystem path to an image file |

### 3.12 `spawn_agent` [function]

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `agent_type` | string |  | Optional type name for the new agent. If omitted, `default`  |
| `fork_context` | boolean |  | When true, fork the current thread history into the new agen |
| `items` | array |  | Structured input items. Use this to pass explicit mentions ( |
| `message` | string |  | Initial plain-text task for the new agent. Use either messag |
| `model` | string |  | Optional model override for the new agent. Replaces the inhe |
| `reasoning_effort` | string |  | Optional reasoning effort override for the new agent. Replac |

### 3.13 `send_input` [function]

> Send a message to an existing agent. Use interrupt=true to redirect work immediately. You should reuse the agent by send

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `interrupt` | boolean |  | When true, stop the agent's current task and handle this imm |
| `items` | array |  | Structured input items. Use this to pass explicit mentions ( |
| `message` | string |  | Legacy plain-text message to send to the agent. Use either m |
| `target` | string | Y | Agent id to message (from spawn_agent). |

### 3.14 `resume_agent` [function]

> Resume a previously closed agent by id so it can receive send_input and wait_agent calls.

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | Y | Agent id to resume. |

### 3.15 `wait_agent` [function]

> Wait for agents to reach a final status. Completed statuses may include the agent's final message. Returns empty status 

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `targets` | array | Y | Agent ids to wait on. Pass multiple ids to wait for whicheve |
| `timeout_ms` | number |  | Optional timeout in milliseconds. Defaults to 30000, min 100 |

### 3.16 `close_agent` [function]

> Close an agent and any open descendants when they are no longer needed, and return the target agent's previous status be

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | string | Y | Agent id to close (from spawn_agent). |

## 4. input（10 条消息，逐条展示）

这是第 3 轮请求的完整 input 数组。前 3 条是每轮都有的固定上下文，后 7 条是前两轮累积的对话历史。

### 4.1 消息 [0]: `message`
**角色**: `developer`

**Block 1** (input_text, 607 字符):

```
<permissions instructions>
Filesystem sandboxing defines which files can be read or written. `sandbox_mode` is `workspace-write`: The sandbox permits reading files, and editing files in `cwd` and `writable_roots`. Editing files in other directories r

... [省略，共 607 字符] ...
```

**Block 2** (input_text, 646 字符):

```
<apps_instructions>
## Apps (Connectors)
Apps (Connectors) can be explicitly triggered in user messages in the format `[$app-name](app://{connector_id})`. Apps can also be implicitly triggered as long as the context suggests usage of available apps.


... [省略，共 646 字符] ...
```

**Block 3** (input_text, 7666 字符):

```
<skills_instructions>
## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for 

... [省略，共 7666 字符] ...
```

**Block 4** (input_text, 1213 字符):

```
<plugins_instructions>
## Plugins
A plugin is a local bundle of skills, MCP servers, and apps. Below is the list of plugins that are enabled and available in this session.
### Available plugins
- `GitHub`: Inspect repositories, triage pull requests a

... [省略，共 1213 字符] ...
```

---

### 4.2 消息 [1]: `message`
**角色**: `user`

**Block 1** (input_text, 3453 字符):

```
# AGENTS.md instructions for /Users/zoujie.wu/workspace/learn-codex

<INSTRUCTIONS>
# learn-codex 项目开发规则

## 中文内容输出规则

- **禁止产生 Unicode 乱码**：输出中文内容时，必须确保所有中文字符完整输出，不得出现 U+FFFD 替换字符（显示为 `���`）。这类乱码是中文字符在输出时被截断造成的。
- 每次生成或修改包含中文的文件后，应使用 `grep -rn '���'

... [省略，共 3453 字符] ...
```

**Block 2** (input_text, 197 字符):

```
<environment_context>
  <cwd>/Users/zoujie.wu/workspace/learn-codex</cwd>
  <shell>zsh</shell>
  <current_date>2026-04-12</current_date>
  <timezone>Asia/Singapore</timezone>
</environment_context>
```

---

### 4.3 消息 [2]: `message`
**角色**: `user`

**Block 1** (input_text, 85 字符):

```
Create a file called /tmp/todomvc3.html with a minimal TODOMVC page using HTML CSS JS
```

---

### 4.4 消息 [3]: `reasoning`

模型内部推理过程（加密，对外不可见）。

---

### 4.5 消息 [4]: `message`
**角色**: `assistant`

**Block 1** (output_text, 84 字符):

```
正在创建 `/tmp/todomvc3.html`，我会直接写成单文件的最小 TodoMVC：包含 HTML 结构、基础样式和原生 JS 的新增/切换/删除/筛选逻辑。
```

---

### 4.6 消息 [5]: `custom_tool_call`

**工具**: `apply_patch`

```
*** Begin Patch
*** Add File: /tmp/todomvc3.html
+<!DOCTYPE html>
+<html lang="en">
+<head>
+  <meta charset="UTF-8">
+  <meta name="viewport" content="width=device-width, initial-scale=1.0">
+  <title>TodoMVC Minimal</title>
+  <style>
+    :root {
+      --bg: #f5f5f5;
+      --panel: #ffffff;
+  

... [省略，共 7887 字符] ...
```

---

### 4.7 消息 [6]: `custom_tool_call_output`

```
Exit code: 0
Wall time: 0 seconds
Output:
Success. Updated the following files:
A /tmp/todomvc3.html

```

---

### 4.8 消息 [7]: `message`
**角色**: `assistant`

**Block 1** (output_text, 36 字符):

```
文件已写入。我在做一次快速校验，确认它已落盘且是可直接打开的单文件页面。
```

---

### 4.9 消息 [8]: `function_call`

**工具**: `exec_command`

```json
{
  "cmd": "ls -l /tmp/todomvc3.html && grep -n \"TodoMVC\" /tmp/todomvc3.html",
  "workdir": "/Users/zoujie.wu/workspace/learn-codex",
  "yield_time_ms": 1000,
  "max_output_tokens": 1200
}
```

---

### 4.10 消息 [9]: `function_call_output`

```
Chunk ID: e080db
Wall time: 0.0000 seconds
Process exited with code 0
Original token count: 40
Output:
-rw-r--r--@ 1 zoujie.wu  wheel  7516 Apr 12 16:23 /tmp/todomvc3.html
6:  <title>TodoMVC Minimal</title>
188:    <section class="todoapp" aria-label="TodoMVC">

```

---

## 5. response（LLM 回复）

**最终回复**:

```
已创建 `/tmp/todomvc3.html`。

这是一个单文件的最小 TodoMVC 页面，包含基础的 HTML/CSS/JS，支持新增任务、切换完成状态、按 `All/Active/Completed` 筛选，以及 `Clear completed`。直接用浏览器打开这个文件即可。
```

**Token 使用**:

```json
{
  "input_tokens": 24623,
  "input_tokens_details": {
    "cached_tokens": 24448
  },
  "output_tokens": 70,
  "output_tokens_details": {
    "reasoning_tokens": 0
  },
  "total_tokens": 24693
}
```

---

**返回**: [02 — 提示词与工具解析](../02-prompt-and-tools.md)