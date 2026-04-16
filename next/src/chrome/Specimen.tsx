"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Accessibility,
  Check,
  ChevronRight,
  Copy,
  Info,
  Maximize2,
  X,
} from "@/icons";
import { useSpecimenContext, specimenId } from "./SpecimenContext";
import {
  useA11yContext,
  type A11yScan,
  type A11yViolation,
} from "./A11yContext";

/* ─── Axe scan queue — serializes scans so they don't collide ─── */
let axeQueue: Promise<void> = Promise.resolve();

/* ─── Specimen ─── */

export function Specimen({
  title,
  description,
  width: defaultWidth,
  children,
}: {
  title: string;
  description?: string;
  width?: number | string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { activeSpecimen, previewMode, claimFirst } = useSpecimenContext();
  const a11yCtx = useA11yContext();
  const id = specimenId(title);
  const isFullScreen = activeSpecimen === id;

  const defaultCss = defaultWidth
    ? typeof defaultWidth === "number"
      ? `${defaultWidth}px`
      : defaultWidth
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
  const [a11yExpanded, setA11yExpanded] = useState(false);

  const peakImpact = useMemo(() => {
    const rank = { minor: 1, moderate: 2, serious: 3, critical: 4 } as const;
    let peak: keyof typeof rank | null = null;
    for (const v of a11yResults?.violations ?? []) {
      if (!v.impact) continue;
      if (!peak || rank[v.impact] > rank[peak]) peak = v.impact;
    }
    return peak;
  }, [a11yResults]);

  // Run axe scan on mount — queued so scans don't collide
  useEffect(() => {
    if (previewMode) return;
    if (!contentRef.current) return;

    let cancelled = false;
    setA11yScanning(true);
    a11yCtx?.register({
      id,
      title,
      scanning: true,
      passes: 0,
      violations: [],
    });

    const job = axeQueue.then(async () => {
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      if (cancelled || !contentRef.current) return;

      try {
        const axe = (await import("axe-core")).default;
        const results = await axe.run(contentRef.current!, {
          rules: { region: { enabled: false } },
        });
        if (cancelled) return;

        const violations: A11yViolation[] = results.violations.map((v) => ({
          id: v.id,
          description: v.description,
          help: v.help,
          helpUrl: v.helpUrl,
          impact: (v.impact as A11yViolation["impact"]) ?? null,
          targets: v.nodes.flatMap((n) =>
            Array.isArray(n.target) ? n.target.map((t) => String(t)) : []
          ),
        }));

        setA11yResults({ violations, passes: results.passes.length });
        a11yCtx?.register({
          id,
          title,
          scanning: false,
          passes: results.passes.length,
          violations,
        });
      } catch {
        a11yCtx?.register({ id, title, scanning: false, passes: 0, violations: [] });
      } finally {
        if (!cancelled) setA11yScanning(false);
      }
    });
    axeQueue = job;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewMode]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    const startX = e.clientX;
    const startWidth = containerRef.current?.offsetWidth ?? 0;

    function onMouseMove(ev: MouseEvent) {
      if (!dragging.current) return;
      const newWidth = Math.max(200, startWidth + (ev.clientX - startX));
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

  /* ── Preview mode ── */
  if (previewMode) {
    const isFirst = claimFirst(id);
    if (!isFirst) return null;
    return <div className="@container">{children}</div>;
  }

  /* ── Full-screen mode ── */
  if (activeSpecimen !== null) {
    if (!isFullScreen) return null;
    return <div className="@container">{children}</div>;
  }

  const isResized = widthPx !== null;
  const hasScan = a11yScanning || a11yResults !== null;
  const violationCount = a11yResults?.violations.length ?? 0;
  const isClean = !a11yScanning && a11yResults !== null && violationCount === 0;

  return (
    <figure className="specimen-root group/specimen animate-rise-in">
      {/* Editorial label (outside card) */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold tracking-tight text-balance text-foreground">
          {title}
        </h3>
        {description && (
          <p className="mt-2 max-w-[68ch] text-[15px] leading-relaxed text-pretty text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {/* Resizable container */}
      <div
        ref={containerRef}
        className="relative"
        style={width ? { width } : undefined}
      >
        {/* Unified canvas card — content + flush a11y strip */}
        <div className="specimen-canvas overflow-hidden rounded-xl bg-chrome-surface shadow-md">
          <div ref={contentRef} className="@container p-8">
            {children}
          </div>

          {/* A11y strip — flush to bottom of same card */}
          {hasScan && (
            <A11yStrip
              scanning={a11yScanning}
              clean={isClean}
              peakImpact={peakImpact}
              results={a11yResults}
              expanded={a11yExpanded}
              setExpanded={setA11yExpanded}
              title={title}
            />
          )}
        </div>

        {/* Toolbar — straddles the top-right corner, slightly overhanging */}
        <div
          className={`absolute -right-2 top-0 z-10 -translate-y-1/2 flex items-center gap-0 rounded-md border bg-chrome-surface p-0.5 shadow-md transition-colors duration-fast ${
            isResized ? "border-chrome-ring" : "border-chrome-border"
          }`}
        >
          {isResized && (
            <>
              <span className="flex h-6 items-center gap-1.5 pl-2 pr-1 font-mono text-chrome-xs tabular-nums text-chrome-active">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
                {Math.round(widthPx!)}px
              </span>
              <button
                onClick={() => setWidth(null)}
                className="flex h-6 items-center rounded px-2 text-chrome-xs font-semibold text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
              >
                Reset
              </button>
              <span aria-hidden="true" className="mx-0.5 h-4 w-px bg-chrome-border" />
            </>
          )}
          <button
            onClick={openFullScreen}
            aria-label="Open specimen full screen"
            title="Open full screen"
            className="flex size-6 items-center justify-center rounded text-chrome-foreground transition-colors duration-fast hover:bg-chrome-hover hover:text-chrome-active"
          >
            <Maximize2 size={12} strokeWidth={1.75} />
          </button>
        </div>

        {/* Drag handle — always visible, vertically centered on the card */}
        <div
          onMouseDown={onMouseDown}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize specimen"
          className="group/drag absolute inset-y-0 right-0 flex w-4 cursor-col-resize items-center justify-center"
        >
          <div className="h-16 w-1 rounded-full bg-chrome-border transition-colors duration-fast group-hover/specimen:bg-chrome-foreground group-hover/drag:!bg-primary" />
        </div>
      </div>
    </figure>
  );
}

/* ─── A11y strip — lives flush at the bottom of the specimen canvas ─── */

function A11yStrip({
  scanning,
  clean,
  peakImpact,
  results,
  expanded,
  setExpanded,
  title,
}: {
  scanning: boolean;
  clean: boolean;
  peakImpact: "minor" | "moderate" | "serious" | "critical" | null;
  results: { violations: A11yViolation[]; passes: number } | null;
  expanded: boolean;
  setExpanded: (v: boolean) => void;
  title: string;
}) {
  const [copied, setCopied] = useState(false);
  const a11yCtx = useA11yContext();
  const componentContext = a11yCtx?.componentContext ?? null;

  const isCritical = peakImpact === "critical" || peakImpact === "serious";
  const hasIssues = results !== null && !clean && !scanning;

  // Neutral strip background — color carried by the icon circle + label only
  const tint = "bg-chrome";

  if (scanning) {
    return (
      <div className="flex items-center gap-2 border-t border-chrome-border bg-chrome px-4 py-2.5 animate-in fade-in">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-chrome-muted/15 text-chrome-muted animate-pulse">
          <Accessibility size={11} strokeWidth={2.25} />
        </span>
        <span className="text-chrome-sm font-semibold text-chrome-foreground animate-pulse">
          Scanning accessibility…
        </span>
      </div>
    );
  }

  if (!results) return null;

  async function copyOne() {
    const md = buildSingleReport(title, results!, componentContext);
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  }

  return (
    <div className="animate-in fade-in">
      <div
        className={`flex items-center gap-2 border-t border-chrome-border px-4 py-2.5 ${tint}`}
      >
        <span
          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
            clean
              ? "bg-success/15 text-success"
              : isCritical
                ? "bg-destructive/15 text-destructive"
                : "bg-warning/20 text-warning"
          }`}
        >
          <Accessibility size={11} strokeWidth={2.25} />
        </span>
        {clean ? (
          <>
            <span className="text-chrome-sm font-semibold text-success">
              No a11y issues
            </span>
            <span className="text-chrome-xs tabular-nums text-chrome-muted">
              {results.passes} checks passed
            </span>
          </>
        ) : (
          <>
            <span
              className={`text-chrome-sm font-semibold ${
                isCritical ? "text-destructive" : "text-warning"
              }`}
            >
              {results.violations.length} issue{results.violations.length === 1 ? "" : "s"}
            </span>
            <span className="text-chrome-xs tabular-nums text-chrome-muted">
              {results.passes} checks passed
            </span>
          </>
        )}
        {hasIssues && (
          <div className="ml-auto flex items-center gap-1.5">
            <button
              onClick={copyOne}
              className="flex h-6 items-center gap-1.5 rounded-md border border-chrome-border bg-chrome-surface px-2 text-chrome-xs font-semibold text-chrome-foreground shadow-sm transition-colors duration-fast hover:border-chrome-ring hover:text-chrome-active"
            >
              {copied ? (
                <Check size={11} strokeWidth={2.25} className="text-success" />
              ) : (
                <Copy size={11} strokeWidth={2} />
              )}
              {copied ? "Copied" : "Copy details"}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label={expanded ? "Collapse" : "Expand"}
              className="flex size-6 items-center justify-center rounded-md border border-chrome-border bg-chrome-surface text-chrome-foreground shadow-sm transition-colors duration-fast hover:border-chrome-ring hover:text-chrome-active"
            >
              <ChevronRight
                size={12}
                strokeWidth={2}
                className={`transition-transform duration-fast ${expanded ? "rotate-90" : ""}`}
              />
            </button>
          </div>
        )}
      </div>

      {hasIssues && expanded && (
        <ul
          role="list"
          className="divide-y divide-chrome-border border-t border-chrome-border bg-chrome-surface"
        >
          {results.violations.map((v) => (
            <li key={v.id} className="px-4 py-4">
              <div className="flex flex-wrap items-center gap-2">
                <ImpactBadge impact={v.impact} />
                <span className="rounded border border-chrome-border bg-chrome px-1.5 py-0.5 font-mono text-chrome-xs text-chrome-foreground">
                  {v.id}
                </span>
                <span className="text-chrome-sm font-semibold text-chrome-active">
                  {v.help}
                </span>
              </div>
              <p className="mt-2 max-w-[68ch] text-chrome-sm leading-relaxed text-chrome-foreground">
                {v.description}
              </p>
              {v.targets.length > 0 && (
                <div className="mt-3">
                  <div className="mb-1 text-chrome-xs font-semibold uppercase text-chrome-muted">
                    Failing selectors
                  </div>
                  <ul
                    role="list"
                    className="flex flex-col gap-0.5 rounded-md border border-chrome-border bg-chrome p-2 font-mono text-chrome-xs text-chrome-foreground"
                  >
                    {v.targets.slice(0, 6).map((t, i) => (
                      <li key={i} className="truncate">
                        <span className="mr-1.5 text-primary">›</span>
                        {t}
                      </li>
                    ))}
                    {v.targets.length > 6 && (
                      <li className="text-chrome-muted">
                        + {v.targets.length - 6} more
                      </li>
                    )}
                  </ul>
                </div>
              )}
              <a
                href={v.helpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-6 items-center gap-1 rounded-md border border-chrome-border bg-chrome-surface px-2 text-chrome-xs font-semibold text-primary no-underline shadow-sm transition-colors duration-fast hover:border-primary/40"
              >
                Learn more
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ImpactBadge({ impact }: { impact: A11yViolation["impact"] }) {
  if (!impact) return null;
  const tone =
    impact === "critical" || impact === "serious"
      ? "bg-destructive/10 text-destructive"
      : "bg-warning/15 text-warning";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-chrome-xs font-semibold uppercase ${tone}`}
    >
      {impact}
    </span>
  );
}

function buildSingleReport(
  specimenTitle: string,
  results: { violations: A11yViolation[]; passes: number },
  componentContext: { name: string; file: string; specimenFile: string } | null
): string {
  const lines: string[] = [];
  const url = typeof window !== "undefined" ? window.location.href : "";
  const displayName = componentContext
    ? componentContext.name.replace(/([a-z])([A-Z])/g, "$1 $2")
    : null;

  if (componentContext && displayName) {
    lines.push(
      `I'm working on the **${displayName}** component in my Angora design system. The **${specimenTitle}** specimen has ${results.violations.length} accessibility violation${results.violations.length === 1 ? "" : "s"}. Help me fix ${results.violations.length === 1 ? "it" : "them"} in the source file.`
    );
    lines.push("");
    lines.push(`## Context`);
    lines.push("");
    lines.push(`- **Component:** \`${componentContext.name}\``);
    lines.push(`- **Source:** \`${componentContext.file}\``);
    lines.push(`- **Specimen:** \`${componentContext.specimenFile}\` (${specimenTitle})`);
    if (url) lines.push(`- **Preview:** ${url}`);
    lines.push(`- **Scanner:** axe-core (WCAG 2.1 AA)`);
    lines.push(
      `- **Summary:** ${results.violations.length} violation${results.violations.length === 1 ? "" : "s"} · ${results.passes} checks passed`
    );
    lines.push("");
  } else {
    lines.push(`## ${specimenTitle}`);
    lines.push(
      `${results.violations.length} violation${results.violations.length === 1 ? "" : "s"}, ${results.passes} checks passed.`
    );
    lines.push("");
  }

  lines.push(`## Violations`);
  lines.push("");
  for (const v of results.violations) {
    lines.push(`### [${(v.impact ?? "unknown").toUpperCase()}] ${v.help}`);
    lines.push("");
    lines.push(`**Rule:** \`${v.id}\``);
    lines.push("");
    lines.push(v.description);
    lines.push("");
    if (v.targets.length > 0) {
      lines.push(`**Failing selectors:**`);
      for (const sel of v.targets) lines.push(`- \`${sel}\``);
      lines.push("");
    }
    lines.push(`[Learn more](${v.helpUrl})`);
    lines.push("");
  }
  return lines.join("\n");
}

/* ─── Layout helpers ─── */

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-20 text-chrome-sm text-muted-foreground">{children}</span>
  );
}

export function Row({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
}) {
  const alignClass = { start: "items-start", center: "items-center", end: "items-end" }[align];
  return <div className={`flex flex-wrap gap-3 ${alignClass}`}>{children}</div>;
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
  const colClass = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" }[cols];
  return <div className={`grid gap-4 ${colClass}`}>{children}</div>;
}

export function Note({ children }: { children: React.ReactNode }) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;

  return (
    <aside
      role="note"
      className="my-6 overflow-hidden rounded-md border border-chrome-border bg-chrome-surface shadow-sm"
    >
      <div className="flex items-center gap-2 border-b border-chrome-border bg-primary/[0.04] px-5 py-2.5">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Info size={11} strokeWidth={2.25} />
        </span>
        <span className="text-chrome-xs font-bold uppercase tracking-[0.15em] text-primary">
          Note
        </span>
      </div>
      <div className="px-5 py-4 text-[15px] leading-relaxed text-pretty text-foreground [&>*]:!max-w-none [&_div]:text-[15px] [&_div]:leading-relaxed [&_div]:!text-foreground">
        {children}
      </div>
    </aside>
  );
}

export function DoDont({
  doExample,
  dontExample,
}: {
  doExample: React.ReactNode;
  dontExample: React.ReactNode;
}) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;

  return (
    <div className="my-8 grid gap-4 sm:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-success/25 bg-chrome-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-success/15 bg-success/[0.08] px-5 py-2.5">
          <span className="flex size-5 items-center justify-center rounded-full bg-success text-success-foreground">
            <Check size={11} strokeWidth={2.5} />
          </span>
          <span className="text-chrome-xs font-bold uppercase tracking-[0.15em] text-success">
            Do
          </span>
        </div>
        <div className="px-6 py-5">{doExample}</div>
      </div>
      <div className="overflow-hidden rounded-xl border border-destructive/25 bg-chrome-surface shadow-sm">
        <div className="flex items-center gap-2 border-b border-destructive/15 bg-destructive/[0.08] px-5 py-2.5">
          <span className="flex size-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground">
            <X size={11} strokeWidth={2.5} />
          </span>
          <span className="text-chrome-xs font-bold uppercase tracking-[0.15em] text-destructive">
            Don&rsquo;t
          </span>
        </div>
        <div className="px-6 py-5">{dontExample}</div>
      </div>
    </div>
  );
}
