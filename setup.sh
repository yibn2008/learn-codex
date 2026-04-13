#!/usr/bin/env bash
# setup.sh — 克隆 Codex 源码到本地，供 Wiki 分析参考
#
# 用法:
#   ./setup.sh            # 克隆到 .codex-source/
#   ./setup.sh <commit>   # 克隆并 checkout 到指定 commit

set -euo pipefail

REPO_URL="https://github.com/openai/codex.git"
TARGET_DIR="$(cd "$(dirname "$0")" && pwd)/.codex-source"

if [ -d "$TARGET_DIR" ]; then
  echo "✓ Codex 源码目录已存在: $TARGET_DIR"
  echo "  如需重新克隆，请先删除该目录: rm -rf $TARGET_DIR"
  exit 0
fi

echo "→ 克隆 Codex 源码到 $TARGET_DIR ..."
git clone --depth 1 "$REPO_URL" "$TARGET_DIR"

if [ -n "${1:-}" ]; then
  echo "→ Checkout 到指定 commit: $1"
  cd "$TARGET_DIR"
  git fetch --depth 1 origin "$1"
  git checkout "$1"
fi

echo "✓ 完成！源码位于: $TARGET_DIR"
echo "  Rust crate 数量: $(find "$TARGET_DIR" -name 'Cargo.toml' | wc -l | tr -d ' ')"
echo "  .rs 文件数量: $(find "$TARGET_DIR" -name '*.rs' | wc -l | tr -d ' ')"
