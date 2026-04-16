"use client";

import { useSearchParams } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { useChromeState } from "./ChromeProvider";
import { PanelLeftOpen } from "@/icons";
import type { NavGroup } from "./types";

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
            className="fixed left-3 top-3 z-10 flex size-7 items-center justify-center rounded-md border border-chrome-border bg-chrome-surface text-chrome-foreground shadow-sm transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
          >
            <PanelLeftOpen size={15} strokeWidth={1.75} />
          </button>
        )}
        <main className="chrome-page">{children}</main>
      </div>
    </div>
  );
}
