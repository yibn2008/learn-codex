# learn-codex

> **Language**: **English** · [中文](README.zh.md)

> A source-level analysis of [OpenAI Codex CLI](https://github.com/openai/codex). The goal is a maintainable Wiki that systematically breaks down how this production-grade AI agent actually works.

## What this repo is

This repo is **not** the Codex source code itself. It is a **deep-dive Wiki** built around reading the Codex source.

Areas covered:

- Project layout and the startup chain
- The Agent Loop execution model
- Tool system, context management, sub-agents, and safety mechanisms
- Surrounding systems: API, SDK, protocol, configuration

The final artifact is a chapter-by-chapter Wiki that is useful for:

- Quickly building a mental model of Codex's architecture
- Tech sharing or internal training material
- Pre-reading before diving into the official source

## Where to start

If you're new to this repo, read in this order:

1. [PROJECT.md](PROJECT.md) (Chinese)
   Project goals, analysis scope, chapter plan, and source-of-truth baseline.
2. [PROGRESS.md](PROGRESS.md) (Chinese)
   Live status, chapter state, and round-by-round work log.
3. [wiki/README.md](wiki/README.md)
   Wiki home — start with the chapter navigation.
4. [wiki/00-project-overview.md](wiki/00-project-overview.md) and [wiki/01-architecture-overview.md](wiki/01-architecture-overview.md)
   These two chapters establish the global mental model and are the recommended entry points.

## Repo layout

```text
learn-codex/
├── README.md                # English landing page (you are here)
├── README.zh.md             # Chinese landing page
├── PROJECT.md               # Project goals, scope, chapter plan (Chinese)
├── PROGRESS.md              # Progress tracker, chapter status, work log (Chinese)
├── AGENTS.md                # Writing / review / diagram conventions (Chinese)
├── index.html               # Web preview with global EN/中文 toggle
├── wiki/                    # The Wiki itself
│   ├── README.md            # Wiki home / chapter navigation (English)
│   ├── README.zh.md         # Wiki home (Chinese)
│   ├── 00-project-overview.md      # English version
│   ├── 00-project-overview.zh.md   # Chinese version
│   ├── ...
│   └── 02-appendix/         # Appendix and capture notes
├── diagrams/                # Intermediate analysis artifacts
└── scripts/                 # Capture proxy and helper scripts
```

## Bilingual content (English / 中文)

Each Wiki page exists in two language variants:

- `xx.md` — English (default)
- `xx.zh.md` — 中文

All 12 chapters and the full-request appendix are available in both languages. The Chinese version is treated as the source of truth and updated first when content changes; the English version follows.

The web preview ([index.html](index.html)) provides a global `EN / 中文` toggle in the sidebar that applies across all chapters. The choice is remembered across sessions. If a particular page is missing in the chosen language, the preview falls back to the other language with a small notice banner.

Project management documents (`PROJECT.md`, `PROGRESS.md`, `AGENTS.md`) are Chinese-only — they are internal collaboration documents used by the writing and review agents.

## How the content is organized

The project uses an **"overview first, then deep dive"** approach:

- Chapters 00 and 01 establish the overall architecture and key abstractions
- Later chapters cover prompts, the Agent Loop, tools, context, sub-agents, safety, and so on
- The appendix folder holds capture data, fully annotated requests, and other supporting material

Each chapter follows these conventions:

- A flow diagram and pseudocode up front; details follow
- Key claims are traceable to source code via clickable GitHub links
- Rust-specific concepts are explained inline — no Rust prerequisite assumed

Full writing and review conventions are in [AGENTS.md](AGENTS.md) (Chinese).

## How to preview

### Option 1: Read the Markdown directly

Start at [wiki/README.md](wiki/README.md) and read chapter by chapter.

### Option 2: Open the web preview

A static preview page is at [index.html](index.html). To read it in a browser, start a local static server from the project root:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

The sidebar has a global EN/中文 toggle; the choice is remembered across sessions.

### Option 3: GitHub Pages

The repo is laid out as a GitHub Pages static site. Once enabled and deployed, the default URL is:

```text
https://yibn2008.github.io/learn-codex/
```

## Source-of-truth baseline

- Analysis target: `openai/codex`
- Default baseline: the local source snapshot declared in [PROJECT.md](PROJECT.md)
- Citation rule: key source locations in the prose should be **clickable GitHub links**, not plain-text paths

If a chapter pins to a specific commit or historical version, it must declare that baseline explicitly.

## Maintenance conventions

- After completing or revising a chapter, update [PROGRESS.md](PROGRESS.md)
- After editing Chinese files, check for Unicode replacement characters (`���`) caused by truncation
- Diagrams exist to support comprehension — split complex content into multiple diagrams instead of cramming everything into one Mermaid graph

If your goal is to extend or review a chapter, read [AGENTS.md](AGENTS.md) and [PROJECT.md](PROJECT.md) first, then open the corresponding Wiki page.
