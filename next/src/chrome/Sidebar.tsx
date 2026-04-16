"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useChromeState } from "./ChromeProvider";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

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
    return new Set(active ? [active.title] : [groups[0]?.title]);
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
    <aside className="flex w-[248px] shrink-0 flex-col border-r border-chrome-border bg-chrome">
      {/* Header */}
      <div className="flex h-12 items-center justify-between border-b border-chrome-border px-4">
        <Link
          href="/design-system"
          className="flex items-center gap-2 text-[13px] font-semibold tracking-tight text-chrome-active no-underline transition-opacity duration-fast hover:opacity-80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-primary">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Angora
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          aria-label="Collapse sidebar"
          className="flex h-6 w-6 items-center justify-center rounded text-chrome-foreground/50 transition-colors duration-fast hover:text-chrome-active"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2.5">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex h-8 w-full items-center gap-2 rounded-md border border-chrome-border bg-chrome-surface px-2.5 text-xs text-chrome-foreground/50 transition-colors duration-fast hover:border-chrome-foreground/20 hover:text-chrome-foreground"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <path d="M11.5 11.5L14.5 14.5M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="flex-1 text-left">Search...</span>
          <kbd className="rounded border border-chrome-border px-1 font-mono text-[10px]">/</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map((group) => {
          const isOpen = query.trim() || openGroups.has(group.title);
          return (
            <div key={group.title} className="mb-0.5">
              <button
                onClick={() => toggleGroup(group.title)}
                aria-expanded={!!isOpen}
                className="flex h-7 w-full items-center gap-1.5 rounded-md px-2 text-[10px] font-semibold uppercase tracking-widest text-chrome-foreground/60 transition-colors duration-fast hover:text-chrome-foreground"
              >
                <svg
                  width="8"
                  height="8"
                  viewBox="0 0 16 16"
                  fill="none"
                  className={`shrink-0 transition-transform duration-fast ${isOpen ? "rotate-90" : ""}`}
                >
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {group.title}
                <span className="ml-auto font-mono text-[9px] font-normal text-chrome-foreground/40">
                  {group.items.length}
                </span>
              </button>
              {isOpen && (
                <ul className="mt-0.5 space-y-px pl-1">
                  {group.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={`group flex h-7 items-center rounded-md pl-5 pr-2 text-[13px] no-underline transition-all duration-fast ${
                            active
                              ? "bg-primary/8 font-medium text-primary"
                              : "text-chrome-foreground hover:bg-chrome-hover hover:text-chrome-active"
                          }`}
                        >
                          <span className={`mr-2 h-1 w-1 rounded-full transition-colors duration-fast ${
                            active ? "bg-primary" : "bg-chrome-foreground/20 group-hover:bg-chrome-foreground/40"
                          }`} />
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
      <div className="border-t border-chrome-border px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-chrome-foreground/30">
            angora dev
          </span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
