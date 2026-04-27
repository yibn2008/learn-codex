# learn-codex

> **语言 / Language**: [English](README.md) · **中文**

> 一个围绕 [OpenAI Codex CLI](https://github.com/openai/codex) 源码的中文分析项目，目标是产出一套可持续维护的 Wiki，系统拆解其 AI Agent 工作机制。

## 这个仓库是什么

本仓库不是 Codex 源码本身，而是针对 Codex 源码的**中文解读与知识整理仓库**。

分析重点包括：

- 项目整体结构与启动链路
- Agent Loop 的执行过程
- 工具系统、上下文管理、子 Agent 与安全机制
- API / SDK / 协议 / 配置等外围支撑系统

项目最终产物是一套按章节组织的 Wiki，适合用来：

- 快速建立对 Codex 架构的整体认知
- 作为技术分享或内部培训材料
- 在阅读官方源码前先建立心智模型

## 从哪里开始读

如果你是第一次进入这个仓库，建议按下面顺序阅读：

1. [PROJECT.md](PROJECT.md)  
   先看项目目标、分析范围、章节规划和事实基线。
2. [PROGRESS.md](PROGRESS.md)  
   查看当前进度、章节状态和每轮工作记录。
3. [wiki/README.md](wiki/README.md)  
   进入 Wiki 首页，从章节导航开始阅读。
4. [wiki/00-project-overview.md](wiki/00-project-overview.md) 和 [wiki/01-architecture-overview.md](wiki/01-architecture-overview.md)  
   这两章负责建立全局认知，适合作为正式阅读入口。

## 仓库结构

```text
learn-codex/
├── README.md                # 仓库首页：项目说明与阅读入口
├── PROJECT.md               # 项目总目标、分析范围、章节规划
├── PROGRESS.md              # 进度追踪、章节状态、工作记录
├── AGENTS.md                # 本仓库的写作 / review / 图表约束
├── index.html               # Wiki Web 预览页
├── wiki/                    # 正式 Wiki 内容
│   ├── README.md            # Wiki 首页 / 章节导航
│   ├── 00-project-overview.md
│   ├── 01-architecture-overview.md
│   ├── ...
│   └── 02-appendix/         # 附录与抓包说明
├── diagrams/                # 中间分析产物
└── scripts/                 # 抓包与辅助脚本
```

## 当前内容组织

本项目采用“**总览先行，专题展开**”的写法：

- 第 00 / 01 章先建立整体结构和关键抽象
- 后续章节再分别深入提示词、Agent Loop、工具系统、上下文管理、子 Agent、安全系统等主题
- 附录目录用于存放抓包数据说明、完整请求注解等支撑材料

Wiki 章节默认遵循以下原则：

- 使用中文编写
- 每章优先给出整体流程图和伪代码，再展开细节
- 关键结论需要能追溯到本地源码，并落文为可点击的 GitHub 链接
- 面向没有 Rust 背景的读者，Rust 特有概念以内联方式解释

更完整的写作与 review 规则见 [AGENTS.md](AGENTS.md)。

## 如何预览

### 方式一：直接读 Markdown

直接从 [wiki/README.md](wiki/README.md) 进入，按章节阅读即可。

### 方式二：打开 Web 预览页

仓库内提供了静态预览页 [index.html](index.html)。如果想在浏览器中阅读，可以在项目根目录启动一个本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

### 方式三：GitHub Pages

仓库已按 GitHub Pages 的静态站点方式组织。启用并部署成功后，默认访问地址为：

```text
https://yibn2008.github.io/learn-codex/
```

## 事实基线

- 分析对象：`openai/codex`
- 默认事实基线：以 [PROJECT.md](PROJECT.md) 中声明的本地源码快照为准
- 引用规范：正文中的关键源码位置应尽量落为可点击的 GitHub 链接，而不是纯文本路径

如果后续某一章基于特定 commit 或历史版本，应在章节中单独标明版本基线。

## 维护约定

- 完成或修订章节后，同步更新 [PROGRESS.md](PROGRESS.md)
- 修改中文文件后，检查是否引入 Unicode 替换字符导致的乱码
- 图表优先服务于认知建立，复杂内容拆图，不把细节全部塞进 Mermaid

如果你的目标是继续补写或 review 某一章，先读 [AGENTS.md](AGENTS.md) 和 [PROJECT.md](PROJECT.md)，再进入对应 Wiki 页面。
