"use client";

import { useChromeState } from "./ChromeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { dark, toggleTheme } = useChromeState();

  if (compact) {
    return (
      <button
        onClick={toggleTheme}
        aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        className="flex h-7 w-7 items-center justify-center rounded-md text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      className="relative flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full border border-chrome-border bg-chrome-hover transition-colors duration-normal ease-default hover:border-chrome-foreground/30"
    >
      <span
        className={`pointer-events-none flex h-4 w-4 items-center justify-center rounded-full bg-chrome-surface shadow-sm transition-transform duration-normal ease-default ${
          dark ? "translate-x-[20px]" : "translate-x-[2px]"
        }`}
      >
        {dark ? (
          <SunIcon size={8} />
        ) : (
          <MoonIcon size={8} />
        )}
      </span>
    </button>
  );
}

function SunIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="text-chrome-active">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <path
        d="M8 1v2M8 13v2M1 8h2M13 8h2M3.5 3.5l1.4 1.4M11.1 11.1l1.4 1.4M3.5 12.5l1.4-1.4M11.1 4.9l1.4-1.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="text-chrome-active">
      <path
        d="M6.5.5a.5.5 0 0 0-.598.577A6 6 0 1 0 14.923 9.1a.5.5 0 0 0-.577-.598A5 5 0 0 1 6.5.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
