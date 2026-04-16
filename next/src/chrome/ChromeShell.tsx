"use client";

import { useSearchParams } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useChromeState } from "./ChromeProvider";

interface NavGroup {
  title: string;
  items: { label: string; href: string }[];
}

export function ChromeShell({
  groups,
  children,
}: {
  groups: NavGroup[];
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const { sidebarOpen, setSidebarOpen } = useChromeState();
  const specimenMode = searchParams.has("specimen");

  // Specimen full-screen: no chrome, clean canvas
  if (specimenMode) {
    return (
      <div className="min-h-full bg-background p-8 lg:p-16">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar groups={groups} />
      <div className="relative flex-1 overflow-y-auto">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="fixed left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-md border border-chrome-border bg-chrome-surface text-chrome-foreground shadow-sm transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
