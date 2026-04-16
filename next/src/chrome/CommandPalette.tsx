"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Home, LayoutGrid, Moon, Search, Sun } from "@/icons";
import { useChromeState } from "./ChromeProvider";

interface CommandItem {
  id: string;
  label: string;
  section: string;
  href?: string;
  action?: () => void;
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

    navItems.forEach((item) => {
      items.push({
        id: `nav-${item.href}`,
        label: item.label,
        section: "Components",
        href: item.href,
        icon: <LayoutGrid size={13} strokeWidth={1.75} />,
      });
    });

    items.push({
      id: "home",
      label: "Go to overview",
      section: "Navigation",
      href: "/design-system",
      icon: <Home size={13} strokeWidth={1.75} />,
    });

    items.push({
      id: "toggle-theme",
      label: dark ? "Switch to light mode" : "Switch to dark mode",
      section: "Actions",
      action: toggleTheme,
      icon: dark ? <Sun size={13} strokeWidth={1.75} /> : <Moon size={13} strokeWidth={1.75} />,
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

  const sections = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.section) || [];
      list.push(item);
      map.set(item.section, list);
    });
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setQuery("");
      setActiveIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector("[data-active='true']");
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function execute(item: CommandItem) {
    setCommandPaletteOpen(false);
    if (item.href) router.push(item.href);
    else if (item.action) item.action();
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-150" />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-chrome-border bg-chrome-surface shadow-xl animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Search input */}
        <div className="flex items-center gap-2 border-b border-chrome-border px-4">
          <Search size={15} strokeWidth={1.75} className="shrink-0 text-chrome-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search components, actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-12 flex-1 border-0 bg-transparent text-sm text-chrome-active outline-none placeholder:text-chrome-muted"
          />
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
          {sections.length === 0 && (
            <div className="px-3 py-8 text-center text-chrome-sm text-chrome-muted">
              No results for &ldquo;{query}&rdquo;.
              <br />
              <span className="mt-1 inline-block text-chrome-xs">
                Try{" "}
                <code className="rounded bg-chrome px-1.5 py-0.5 font-mono">
                  /angora-component {query}
                </code>{" "}
                in the CLI
              </span>
            </div>
          )}
          {sections.map(([section, items], sectionIdx) => (
            <div
              key={section}
              className={sectionIdx > 0 ? "mt-1 border-t border-chrome-border pt-1" : ""}
            >
              <div className="px-3 pb-1 pt-1.5 text-chrome-xs font-semibold uppercase text-chrome-muted">
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
                        ? "bg-chrome-accent text-chrome-active"
                        : "text-chrome-foreground hover:text-chrome-active"
                    }`}
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center ${isActive ? "text-primary" : "text-chrome-muted"}`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex h-9 items-center gap-3 border-t border-chrome-border bg-chrome px-4 text-chrome-xs text-chrome-muted">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <span>Navigate</span>
          <span aria-hidden="true">·</span>
          <Kbd>↵</Kbd>
          <span>Select</span>
          <span className="ml-auto flex items-center gap-1.5">
            <Kbd>esc</Kbd>
            <span>Close</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="flex h-4 min-w-4 items-center justify-center rounded border border-chrome-border bg-chrome-surface px-1 font-mono text-chrome-xs text-chrome-foreground">
      {children}
    </kbd>
  );
}
