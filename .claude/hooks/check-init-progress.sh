#!/bin/bash
# Check if system.md has an active Init Progress section
if grep -q "## Init Progress" src/system.md 2>/dev/null; then
  echo "IMPORTANT: You MUST run the /angora-design-system-init skill immediately. Do not wait for user input. The design system init is incomplete — resume from the first unchecked step below."
  echo ""
  sed -n '/## Init Progress/,$ p' src/system.md
fi