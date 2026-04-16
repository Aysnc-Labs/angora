"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useChromeState } from "./ChromeProvider";

interface CommandItem {
  id: string;
  label: string;
  section: string;
  href?: string;
  action?: () => void;
  shortcut?: string;
  icon?: React.ReactNode;
}

interface CommandPaletteProps {
  navItems: { label: string; href: string }[];
}

export function CommandPalette({ navItems }: CommandPaletteProps) {
  const { commandPaletteOpen, setCommandPaletteOpen, toggleTheme, dark } =
    useChromeState();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const commands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // Components
    navItems.forEach((item) => {
      items.push({
        id: `nav-${item.href}`,
        label: item.label,
        section: "Components",
        href: item.href,
        icon: <ComponentIcon />,
      });
    });

    // Actions
    items.push({
      id: "toggle-theme",
      label: dark ? "Switch to light mode" : "Switch to dark mode",
      section: "Actions",
      action: toggleTheme,
      shortcut: "",
      icon: <ThemeIcon />,
    });
    items.push({
      id: "home",
      label: "Go to overview",
      section: "Navigation",
      href: "/design-system",
      icon: <HomeIcon />,
    });

    return items;
  }, [navItems, toggleTheme, dark]);

  const filtered = useMemo(() => {
    if (!query.trim()) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (cmd) =>
        cmd.label.toLowerCase().includes(q) ||
        cmd.section.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.section) || [];
      list.push(item);
      map.set(item.section, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  // Focus input on open
  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [commandPaletteOpen]);

  // Reset active index on filter change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function execute(item: CommandItem) {
    setCommandPaletteOpen(false);
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      e.preventDefault();
      execute(filtered[activeIndex]);
    }
  }

  if (!commandPaletteOpen) return null;

  let flatIndex = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setCommandPaletteOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-150" />

      {/* Palette */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-chrome-border bg-chrome-surface shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Search input */}
        <div className="flex items-center border-b border-chrome-border px-4">
          <svg
            width="15"
            height="15"
            viewBox="0 0 16 16"
            fill="none"
            className="shrink-0 text-chrome-foreground"
          >
            <path
              d="M11.5 11.5L14.5 14.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search components, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 flex-1 border-0 bg-transparent px-3 text-sm text-chrome-active outline-none placeholder:text-chrome-foreground/50"
          />
          <kbd className="flex h-5 items-center rounded border border-chrome-border px-1.5 font-mono text-[10px] text-chrome-foreground">
            esc
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-72 overflow-y-auto p-2">
          {sections.length === 0 && (
            <div className="px-3 py-8 text-center text-sm text-chrome-foreground">
              No results found.
            </div>
          )}
          {sections.map(([section, items]) => (
            <div key={section}>
              <div className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-chrome-foreground/60">
                {section}
              </div>
              {items.map((item) => {
                flatIndex++;
                const isActive = flatIndex === activeIndex;
                const idx = flatIndex;
                return (
                  <button
                    key={item.id}
                    data-active={isActive}
                    onClick={() => execute(item)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-fast ${
                      isActive
                        ? "bg-primary/10 text-chrome-active"
                        : "text-chrome-foreground hover:text-chrome-active"
                    }`}
                  >
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${isActive ? "text-primary" : "text-chrome-foreground"}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="flex h-5 items-center rounded border border-chrome-border px-1.5 font-mono text-[10px] text-chrome-foreground">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ThemeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 2v1M8 13v1M2 8h1M13 8h1M4.2 4.2l.7.7M11.1 11.1l.7.7M4.2 11.8l.7-.7M11.1 4.9l.7-.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 8l6-6 6 6M4 7v6h3v-3h2v3h3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
