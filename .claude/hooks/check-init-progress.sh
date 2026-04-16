#!/bin/bash
# Session start: ensure /angora loads and check init state.

echo "MANDATORY: Load /angora before doing anything else. This is not optional."
echo ""

# Check if init is in progress (partially completed)
if grep -q "## Init Progress" src/system.md 2>/dev/null; then
  echo "The design system init is incomplete. After loading /angora, run /angora-design-system-init immediately and resume from the first unchecked step below."
  echo ""
  sed -n '/## Init Progress/,$ p' src/system.md

# Check if init was never started
elif grep -q '\[TBD\]' src/system.md 2>/dev/null || grep -q '\[Placeholder' src/system.md 2>/dev/null; then
  echo "The design system has not been initialized yet. system.md still has placeholder values. After loading /angora, recommend running /angora-design-system-init before building anything."
fi