#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────
# Angora installer
# https://getangora.org
# ─────────────────────────────────────────────

REPO="https://github.com/Aysnc-Labs/angora"
TARBALL="${REPO}/archive/refs/heads/main.tar.gz"

# ─── Colors & formatting ────────────────────

BOLD='\033[1m'
DIM='\033[2m'
GREEN='\033[32m'
YELLOW='\033[33m'
RED='\033[31m'
RESET='\033[0m'

G1='\033[38;5;183m'
G2='\033[38;5;147m'
G3='\033[38;5;111m'
G4='\033[38;5;75m'

# ─── Helpers ─────────────────────────────────

ok()   { printf "  ${GREEN}✓${RESET} %s\n" "$1"; }
warn() { printf "  ${YELLOW}!${RESET} %s\n" "$1"; }
fail() { printf "  ${RED}✗${RESET} %s\n" "$1"; }

spin() {
  local pid=$1 msg=$2
  local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
  local i=0
  tput civis 2>/dev/null
  while kill -0 "$pid" 2>/dev/null; do
    printf "\r  ${DIM}%s${RESET} %s" "${frames[$i]}" "$msg"
    i=$(( (i + 1) % ${#frames[@]} ))
    sleep 0.08
  done
  tput cnorm 2>/dev/null
  printf "\r\033[2K"
}

DEV_PID=""
trap 'tput cnorm 2>/dev/null; [ -n "$DEV_PID" ] && kill "$DEV_PID" 2>/dev/null' EXIT

# ─── Header ──────────────────────────────────

printf "\n"
sleep 0.04
printf "${G1}${BOLD}     ▄▀█ ${G2}█▄░█ ${G3}█▀▀ █▀█ ${G4}█▀█ ▄▀█${RESET}\n"
sleep 0.04
printf "${G1}${BOLD}     █▀█ ${G2}█░▀█ ${G3}█▄█ █▄█ ${G4}█▀▄ █▀█${RESET}\n"
sleep 0.06
printf "\n"
printf "     ${DIM}design system builder${RESET}\n"
sleep 0.04
printf "     ${DIM}https://getangora.org${RESET}\n"
printf "\n"

# ─── Confirm ─────────────────────────────────

printf "  Install in ${BOLD}%s${RESET} ?\n\n" "$(pwd)"
read -r -p "  [Y/n] " response < /dev/tty
response=${response:-Y}
if [[ ! "$response" =~ ^[Yy]$ ]]; then
  printf "\n  Cancelled.\n\n"
  exit 0
fi

file_count=$(ls -A 2>/dev/null | wc -l | tr -d ' ')
if [ "$file_count" -gt 0 ]; then
  printf "\n"
  warn "Directory has ${file_count} existing items."
  read -r -p "  Continue? [y/N] " response < /dev/tty
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    printf "\n  Cancelled.\n\n"
    exit 0
  fi
fi

# ─── Dependencies ────────────────────────────

printf "\n"

if command -v node &> /dev/null; then
  ok "Node.js $(node -v)"
else
  fail "Node.js not found"
  printf "\n    Install → ${BOLD}https://nodejs.org${RESET}\n\n"
  exit 1
fi

if command -v pnpm &> /dev/null; then
  ok "pnpm v$(pnpm -v)"
else
  npm install -g pnpm > /dev/null 2>&1 &
  NPM_PID=$!
  spin $NPM_PID "Installing pnpm..."
  if ! wait $NPM_PID 2>/dev/null || ! command -v pnpm &> /dev/null; then
    fail "Could not install pnpm"
    printf "\n    Install → ${BOLD}npm install -g pnpm${RESET}\n\n"
    exit 1
  fi
  ok "pnpm v$(pnpm -v)"
fi

HAS_CLAUDE=false
if command -v claude &> /dev/null; then
  ok "Claude Code"
  HAS_CLAUDE=true
else
  warn "Claude Code not installed ${DIM}— you'll need it to use Angora${RESET}"
fi

# ─── Install ─────────────────────────────────

printf "\n"

(curl -sfL "$TARBALL" | tar xz --strip-components=1) 2>/dev/null &
DL_PID=$!
spin $DL_PID "Downloading..."
if ! wait $DL_PID 2>/dev/null; then
  fail "Download failed — check your connection and try again."
  printf "\n"
  exit 1
fi
ok "Downloaded"

pnpm install --silent 2>/dev/null &
INST_PID=$!
spin $INST_PID "Installing dependencies..."
if ! wait $INST_PID 2>/dev/null; then
  fail "pnpm install failed — try running it manually."
  printf "\n"
  exit 1
fi
ok "Dependencies installed"

git init --quiet 2>/dev/null
git add -A 2>/dev/null
git commit -m "Init Angora" --quiet 2>/dev/null
ok "Git initialized"

# ─── Done ────────────────────────────────────

S="  "
B="${GREEN}│${RESET}"

printf "\n"

if [ "$HAS_CLAUDE" = true ]; then

  # ─── Ask to launch ───────────────────────

  sleep 0.03
  printf "${S}${GREEN}╭──────────────────────────────────────────╮${RESET}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${GREEN}${BOLD}✓${RESET}  You're all set.                     ${B}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${BOLD}Start building?${RESET}                        ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${DIM}Launches dev server + Claude.${RESET}           ${B}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${GREEN}╰──────────────────────────────────────────╯${RESET}\n"
  printf "\n"

  read -r -p "  [Y/n] " response < /dev/tty
  response=${response:-Y}

  if [[ "$response" =~ ^[Yy]$ ]]; then
    printf "\n"

    # Start dev server in background
    pnpm run dev > /dev/null 2>&1 &
    DEV_PID=$!
    frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    tput civis 2>/dev/null
    for ((j=0; j<20; j++)); do
      printf "\r  ${DIM}%s${RESET} Starting dev server..." "${frames[$((j % 10))]}"
      sleep 0.08
    done
    tput cnorm 2>/dev/null
    printf "\r\033[2K"

    if kill -0 "$DEV_PID" 2>/dev/null; then
      ok "Dev server → localhost:4321"
    else
      warn "Dev server failed — run ${BOLD}pnpm run dev${RESET} manually"
    fi

    printf "\n  ${DIM}Launching Claude...${RESET}\n\n"
    claude "/angora-design-system-init" || true
    exit 0
  fi

  # User declined
  printf "\n  ${DIM}Whenever you're ready:${RESET}\n\n"
  printf "  ${BOLD}pnpm run dev${RESET}\n"
  printf "  ${BOLD}claude${RESET} → ${BOLD}/angora-design-system-init${RESET}\n"
  printf "\n"

else

  # ─── Manual steps (no Claude) ────────────

  sleep 0.03
  printf "${S}${GREEN}╭──────────────────────────────────────────╮${RESET}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${GREEN}${BOLD}✓${RESET}  You're all set.                     ${B}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${DIM}To get started:${RESET}                        ${B}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${BOLD}npm i -g @anthropic-ai/claude-code${RESET}     ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${BOLD}pnpm run dev${RESET}                           ${B}\n"
  sleep 0.03
  printf "${S}${B}   ${BOLD}claude${RESET} → ${BOLD}/angora-design-system-init${RESET}     ${B}\n"
  sleep 0.03
  printf "${S}${B}                                          ${B}\n"
  sleep 0.03
  printf "${S}${GREEN}╰──────────────────────────────────────────╯${RESET}\n"
  printf "\n"

fi
