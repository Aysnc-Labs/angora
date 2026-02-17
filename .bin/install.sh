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
BLUE='\033[38;2;43;116;173m'
GOLD='\033[38;2;210;150;60m'
YELLOW='\033[33m'
RED='\033[31m'
WHITE='\033[97m'
RESET='\033[0m'

G1='\033[38;2;43;116;173m'
G2='\033[38;2;78;140;190m'
G3='\033[38;2;140;170;200m'
G4='\033[38;2;210;150;60m'

# ─── Helpers ─────────────────────────────────

ok()   { printf "  ${BLUE}✓${RESET} %s\n" "$1"; }
warn() { printf "  ${GOLD}!${RESET} %s\n" "$1"; }
fail() { printf "  ${RED}✗${RESET} %s\n" "$1"; }

link() { printf "\033]8;;%s\a%s\033]8;;\a" "$1" "${2:-$1}"; }

rule() { printf "  ${DIM}─────────────────────────────────────${RESET}\n"; }

open_url() {
  local url=$1
  if command -v open &>/dev/null; then open "$url"
  elif command -v xdg-open &>/dev/null; then xdg-open "$url"
  elif command -v wslview &>/dev/null; then wslview "$url"
  fi
}

launch_terminal() {
  local dir=$1 cmd=$2
  if [[ "$OSTYPE" == darwin* ]]; then
    osascript -e "
      tell application \"Terminal\"
        activate
        do script \"cd '$dir' && $cmd\"
      end tell
    " &>/dev/null
  elif command -v gnome-terminal &>/dev/null; then
    gnome-terminal -- bash -c "cd '$dir' && $cmd; exec bash" &>/dev/null &
  elif command -v xterm &>/dev/null; then
    xterm -e "cd '$dir' && $cmd; exec bash" &>/dev/null &
  else
    return 1
  fi
}

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

printf "\n\n"
sleep 0.12
printf "  ${G1}${BOLD}A ${G2}N ${G3}G O ${G4}R A${RESET}\n"
sleep 0.08
printf "\n"
printf "  ${DIM}design systems that ship${RESET}\n"
printf "  ${DIM}$(link "https://getangora.org" "getangora.org")${RESET}\n"
printf "\n"

# ─── Project directory ──────────────────────

rule
printf "\n"

TARGET_DIR="${1:-}"

if [ -n "$TARGET_DIR" ]; then
  # Argument provided — resolve to absolute path
  TARGET_DIR="$(cd "$(dirname "$TARGET_DIR")" 2>/dev/null && pwd)/$(basename "$TARGET_DIR")" || TARGET_DIR="$(pwd)/$1"

  if [ -d "$TARGET_DIR" ]; then
    printf "  Directory ${BOLD}%s${RESET} already exists.\n\n" "$TARGET_DIR"
    read -r -p "  Use it anyway? [y/N] " response < /dev/tty
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
      printf "\n  Cancelled.\n\n"
      exit 0
    fi
  else
    mkdir -p "$TARGET_DIR"
    ok "Created ${TARGET_DIR}"
    printf "\n"
  fi
  cd "$TARGET_DIR"
else
  # No argument — ask where to install
  printf "  ${BOLD}Where should we create your project?${RESET}\n\n"
  printf "  ${DIM}Enter a directory name, or press enter for current directory.${RESET}\n\n"
  read -r -p "  → " dir_input < /dev/tty
  dir_input="${dir_input:-}"

  if [ -n "$dir_input" ]; then
    TARGET_DIR="$(pwd)/$dir_input"
    if [ -d "$TARGET_DIR" ]; then
      printf "\n"
      printf "  Directory ${BOLD}%s${RESET} already exists.\n\n" "$dir_input"
      read -r -p "  Use it anyway? [y/N] " response < /dev/tty
      if [[ ! "$response" =~ ^[Yy]$ ]]; then
        printf "\n  Cancelled.\n\n"
        exit 0
      fi
    else
      mkdir -p "$TARGET_DIR"
      printf "\n"
      ok "Created ${dir_input}"
    fi
    cd "$TARGET_DIR"
  else
    TARGET_DIR="$(pwd)"
    file_count=$(ls -A 2>/dev/null | wc -l | tr -d ' ')
    if [ "$file_count" -gt 0 ]; then
      printf "\n"
      warn "Current directory has ${file_count} existing items."
      read -r -p "  Continue? [y/N] " response < /dev/tty
      if [[ ! "$response" =~ ^[Yy]$ ]]; then
        printf "\n  Cancelled.\n\n"
        exit 0
      fi
    fi
  fi
fi

printf "\n"
printf "  ${DIM}Installing in${RESET} ${BOLD}%s${RESET}\n" "$TARGET_DIR"

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
rule
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

printf "\n"
rule
sleep 0.2

if [ "$HAS_CLAUDE" = true ]; then

  printf "\n"
  printf "  ${WHITE}${BOLD}Ready.${RESET}\n"
  printf "\n"
  printf "  ${DIM}Starts the dev server here, opens Claude in a new tab.${RESET}\n"
  printf "\n"

  read -r -p "  Start building? [Y/n] " response < /dev/tty
  response=${response:-Y}

  if [[ "$response" =~ ^[Yy]$ ]]; then
    printf "\n"

    # Launch Claude in a new terminal tab
    if launch_terminal "$TARGET_DIR" "claude /angora-design-system-init"; then
      ok "Claude opened in new tab"
    else
      warn "Couldn't open a new tab — run ${BOLD}claude${RESET} manually"
    fi

    # Start dev server in this terminal
    printf "\n"
    ok "Dev server → $(link "http://localhost:4321" "localhost:4321")"
    open_url "http://localhost:4321"
    printf "\n"

    # Hand over to dev server (replaces this process)
    exec pnpm run dev
  fi

  # User declined
  printf "\n"
  printf "  ${DIM}Whenever you're ready:${RESET}\n"
  printf "\n"
  printf "  ${BOLD}pnpm run dev${RESET}\n"
  printf "  ${BOLD}claude${RESET} → ${BOLD}/angora-design-system-init${RESET}\n"
  printf "\n"

else

  # ─── Manual steps (no Claude) ────────────

  printf "\n"
  printf "  ${WHITE}${BOLD}Ready.${RESET}\n"
  printf "\n"
  printf "  ${DIM}Next steps:${RESET}\n"
  printf "\n"
  printf "  ${BOLD}npm i -g @anthropic-ai/claude-code${RESET}\n"
  printf "  ${BOLD}pnpm run dev${RESET}\n"
  printf "  ${BOLD}claude${RESET} → ${BOLD}/angora-design-system-init${RESET}\n"
  printf "\n"

fi
