"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSpecimenContext, specimenId } from "./SpecimenContext";
/* ─── Axe scan queue — serializes scans so they don't collide ─── */
let axeQueue: Promise<void> = Promise.resolve();

/* ─── A11y result types ─── */

interface A11yViolation {
  id: string;
  description: string;
  impact: string | null;
  nodes: number;
}

/* ─── Specimen ─── */

export function Specimen({
  title,
  width: defaultWidth,
  children,
}: {
  title: string;
  width?: number | string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { activeSpecimen } = useSpecimenContext();
  const id = specimenId(title);
  const isFullScreen = activeSpecimen === id;

  const defaultCss = defaultWidth
    ? typeof defaultWidth === "number" ? `${defaultWidth}px` : defaultWidth
    : null;

  // Resize state
  const [widthPx, setWidth] = useState<number | null>(null);
  const width = widthPx !== null ? `${widthPx}px` : defaultCss;
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  // A11y state
  const [a11yResults, setA11yResults] = useState<{
    violations: A11yViolation[];
    passes: number;
  } | null>(null);
  const [a11yScanning, setA11yScanning] = useState(false);

  // Run axe scan on mount — queued so scans don't collide
  useEffect(() => {
    if (!contentRef.current) return;

    let cancelled = false;
    setA11yScanning(true);

    const job = axeQueue.then(async () => {
      // Wait for hydration / paint
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled || !contentRef.current) return;

      try {
        const axe = (await import("axe-core")).default;
        const results = await axe.run(contentRef.current!, {
          rules: { region: { enabled: false } },
        });
        if (cancelled) return;
        setA11yResults({
          violations: results.violations.map((v) => ({
            id: v.id,
            description: v.description,
            impact: v.impact ?? null,
            nodes: v.nodes.length,
          })),
          passes: results.passes.length,
        });
      } catch {
        // scan failed silently
      } finally {
        if (!cancelled) setA11yScanning(false);
      }
    });
    axeQueue = job;

    return () => { cancelled = true; };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth ?? 0;

    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      const newWidth = Math.max(200, startWidth + (e.clientX - startX));
      setWidth(newWidth);
    }

    function onMouseUp() {
      dragging.current = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }, []);

  function openFullScreen() {
    window.open(`${pathname}?specimen=${id}`, "_blank");
  }

  // Full-screen mode: only the active specimen renders
  if (activeSpecimen !== null) {
    if (!isFullScreen) return null;
    return (
      <div className="@container">
        {children}
      </div>
    );
  }

  // Normal mode
  return (
    <div className="group/specimen my-6">
      <div
        ref={containerRef}
        className="relative"
        style={width ? { width } : undefined}
      >
        {/* Header row */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[11px] font-semibold uppercase tracking-widest text-chrome-foreground/60">
            {title}
          </h3>
          <div className="flex items-center gap-1 opacity-0 transition-opacity duration-fast group-hover/specimen:opacity-100">
            {widthPx !== null && (
              <button
                onClick={() => setWidth(null)}
                className="flex h-6 items-center gap-1 rounded px-1.5 text-[10px] text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
              >
                Reset
              </button>
            )}
            {widthPx !== null && (
              <span className="font-mono text-[10px] text-chrome-foreground/40">
                {Math.round(widthPx)}px
              </span>
            )}
            <button
              onClick={openFullScreen}
              aria-label="Open specimen full screen"
              className="flex h-6 w-6 items-center justify-center rounded text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M9 2h5v5M7 9l7-7M2 9v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="@container overflow-hidden rounded-lg border border-chrome-border bg-background p-6"
        >
          {children}
        </div>

        {/* A11y results — inline below content */}
        {(a11yScanning || a11yResults) && (
          <div className="mt-2 rounded-lg border border-chrome-border bg-chrome p-3">
            {a11yScanning ? (
              <div className="flex items-center gap-2 text-xs text-chrome-foreground">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="animate-spin text-primary">
                  <path d="M2 8a6 6 0 0 1 10.5-4M14 8a6 6 0 0 1-10.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Scanning...
              </div>
            ) : a11yResults ? (
              <div>
                {a11yResults.violations.length === 0 ? (
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l4 4 6-8" stroke="var(--color-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xs font-medium text-success">
                      No issues
                    </span>
                    <span className="text-[10px] text-chrome-foreground/40">
                      {a11yResults.passes} checks passed
                    </span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-destructive">
                        {a11yResults.violations.length} issue{a11yResults.violations.length === 1 ? "" : "s"}
                      </span>
                      <span className="text-[10px] text-chrome-foreground/40">
                        {a11yResults.passes} passed
                      </span>
                    </div>
                    {a11yResults.violations.map((v) => (
                      <div key={v.id} className="flex items-start gap-2 text-xs">
                        <svg width="10" height="10" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                          <path d="M4 4l8 8M12 4l-8 8" stroke="var(--color-destructive)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <div>
                          <span className="text-chrome-active">{v.description}</span>
                          <span className="ml-1.5 text-[10px] text-chrome-foreground/40">
                            {v.impact} · {v.nodes} element{v.nodes === 1 ? "" : "s"} · {v.id}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}

        {/* Drag handle */}
        <div
          onMouseDown={onMouseDown}
          className="absolute right-0 top-0 flex h-full w-3 cursor-col-resize items-center justify-center opacity-0 transition-opacity duration-fast hover:opacity-100 group-hover/specimen:opacity-60"
        >
          <div className="h-8 w-1 rounded-full bg-chrome-foreground/30" />
        </div>
      </div>
    </div>
  );
}

/* ─── Layout helpers ─── */

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-20 text-xs text-muted-foreground">{children}</span>
  );
}

export function Row({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) {
  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  }[align];

  return (
    <div className={`flex flex-wrap gap-3 ${alignClass}`}>{children}</div>
  );
}

export function Stack({
  children,
  gap = "md",
}: {
  children: React.ReactNode;
  gap?: "sm" | "md" | "lg";
}) {
  const gapClass = { sm: "gap-2", md: "gap-4", lg: "gap-6" }[gap];
  return <div className={`flex flex-col ${gapClass}`}>{children}</div>;
}

export function Grid({
  children,
  cols = 3,
}: {
  children: React.ReactNode;
  cols?: 2 | 3 | 4;
}) {
  const colClass = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  }[cols];

  return <div className={`grid gap-4 ${colClass}`}>{children}</div>;
}

export function Note({ children }: { children: React.ReactNode }) {
  const { activeSpecimen } = useSpecimenContext();
  if (activeSpecimen) return null;

  return (
    <div className="my-4 flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="mt-0.5 shrink-0 text-primary"
      >
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 5v1M8 8v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div className="text-sm text-foreground [&>p]:text-sm [&>p]:text-foreground">
        {children}
      </div>
    </div>
  );
}

export function DoDont({
  doExample,
  dontExample,
}: {
  doExample: React.ReactNode;
  dontExample: React.ReactNode;
}) {
  const { activeSpecimen } = useSpecimenContext();
  if (activeSpecimen) return null;

  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-success/15">
            <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l4 4 6-8" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-success">Do</span>
        </div>
        <div className="rounded-lg border border-success/20 bg-background p-4">
          {doExample}
        </div>
      </div>
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-destructive/15">
            <svg width="8" height="8" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="var(--color-destructive)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-destructive">Don't</span>
        </div>
        <div className="rounded-lg border border-destructive/20 bg-background p-4">
          {dontExample}
        </div>
      </div>
    </div>
  );
}
