#!/bin/bash
# Check if init is in progress (partially completed)
if grep -q "## Init Progress" src/system.md 2>/dev/null; then
  echo "IMPORTANT: You MUST run the /angora-design-system-init skill immediately. Do not wait for user input. The design system init is incomplete — resume from the first unchecked step below."
  echo ""
  sed -n '/## Init Progress/,$ p' src/system.md

# Check if init was never started
elif grep -q '\[TBD\]' src/system.md 2>/dev/null || grep -q '\[Placeholder' src/system.md 2>/dev/null; then
  echo "IMPORTANT: The design system has not been initialized yet. system.md still has placeholder values. You MUST recommend running /angora-design-system-init before building any components. Do not offer building components as an equal alternative — init comes first."
fi