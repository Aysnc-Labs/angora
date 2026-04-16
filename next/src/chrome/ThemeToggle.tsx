"use client";

import { Moon, Sun } from "@/icons";
import { useChromeState } from "./ChromeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { dark, toggleTheme } = useChromeState();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex size-7 items-center justify-center rounded-md text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
      >
        {dark ? <Sun size={14} strokeWidth={1.75} /> : <Moon size={14} strokeWidth={1.75} />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className="relative flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-chrome-border bg-chrome-hover transition-colors duration-normal ease-default hover:border-chrome-ring"
    >
      <span
        className={`pointer-events-none flex size-3.5 items-center justify-center rounded-full bg-chrome-surface shadow-sm transition-transform duration-normal ease-default ${
          dark ? "translate-x-[18px]" : "translate-x-0.5"
        }`}
      >
        {dark ? <Sun size={8} strokeWidth={2} className="text-chrome-active" /> : <Moon size={8} strokeWidth={2} className="text-chrome-active" />}
      </span>
    </button>
  );
}
