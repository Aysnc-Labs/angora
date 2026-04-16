"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, PanelLeftClose, Search } from "@/icons";
import { ThemeToggle } from "./ThemeToggle";
import { useChromeState } from "./ChromeProvider";
import type { NavGroup } from "./types";

interface SidebarProps {
  groups: NavGroup[];
}

export function Sidebar({ groups }: SidebarProps) {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen, setCommandPaletteOpen } = useChromeState();
  const [query, setQuery] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => {
    const active = groups.find((g) =>
      g.items.some((item) => pathname === item.href)
    );
    return new Set(active ? [active.title] : groups.map((g) => g.title));
  });

  const filtered = useMemo(() => {
    if (!query.trim()) return groups;
    const q = query.toLowerCase();
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          item.label.toLowerCase().includes(q)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  function toggleGroup(title: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  if (!sidebarOpen) return null;

  return (
    <aside className="flex w-sidebar shrink-0 flex-col border-r border-chrome-border bg-chrome">
      {/* Header */}
      <div className="flex h-chrome-header items-center justify-between border-b border-chrome-border px-4">
        <Link
          href="/design-system"
          className="flex items-center gap-2 text-chrome-sm font-semibold tracking-tight text-chrome-active no-underline transition-opacity duration-fast hover:opacity-80"
        >
          <BrandMark />
          Angora
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Collapse sidebar"
          className="flex size-6 items-center justify-center rounded text-chrome-muted transition-colors duration-fast hover:text-chrome-active"
        >
          <PanelLeftClose size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Search */}
      <div className="p-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="group/search flex h-chrome-input w-full items-center gap-2 rounded-md border border-chrome-border bg-chrome-surface px-2.5 text-chrome-sm text-chrome-muted transition-colors duration-fast hover:border-chrome-ring hover:text-chrome-foreground"
        >
          <Search size={13} strokeWidth={1.75} className="shrink-0" />
          <span className="flex-1 text-left">Search...</span>
          <kbd className="flex h-4 min-w-4 items-center justify-center rounded border border-chrome-border bg-chrome px-1 font-mono text-chrome-xs text-chrome-muted transition-colors duration-fast group-hover/search:border-chrome-ring">
            /
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map((group) => {
          const isOpen = query.trim() || openGroups.has(group.title);
          return (
            <div key={group.title} className="mb-1">
              <button
                onClick={() => toggleGroup(group.title)}
                aria-expanded={!!isOpen}
                className="flex h-chrome-row w-full items-center gap-1.5 rounded-md px-2 text-chrome-xs font-semibold uppercase text-chrome-muted transition-colors duration-fast hover:text-chrome-foreground"
              >
                <ChevronRight
                  size={10}
                  strokeWidth={2.25}
                  className={`shrink-0 transition-transform duration-fast ${isOpen ? "rotate-90" : ""}`}
                />
                {group.title}
                <span className="ml-auto font-mono text-chrome-xs font-normal tabular-nums text-chrome-muted">
                  {group.items.length}
                </span>
              </button>
              {isOpen && (
                <ul role="list" className="mt-0.5 space-y-px pl-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`group relative flex h-chrome-row items-center rounded-md pl-4 pr-2 text-chrome-sm no-underline transition-colors duration-fast ${
                            active
                              ? "bg-chrome-accent text-primary"
                              : "text-chrome-foreground hover:bg-chrome-hover hover:text-chrome-active"
                          }`}
                        >
                          {active && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-1.5 left-1 w-[2px] rounded-full bg-primary"
                            />
                          )}
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex h-chrome-header items-center justify-between border-t border-chrome-border px-4">
        <span className="font-mono text-chrome-xs text-chrome-muted">angora dev</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}

function BrandMark() {
  return (
    <span className="flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3L3 8l9 5 9-5-9-5z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M3 13l9 5 9-5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
      </svg>
    </span>
  );
}
