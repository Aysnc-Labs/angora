#!/bin/bash
# Injected before every user message to keep skills loaded.

cat <<'EOF'
Based on what the user just said, should any angora skills be loaded? If YES, load them NOW before responding. You cannot ask good questions without skills loaded. Skills contain the design system expertise. Load first, respond second.
EOF

exit 0
