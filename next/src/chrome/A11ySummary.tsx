"use client";

import { useState } from "react";
import { Accessibility, Check, Copy, Loader2 } from "@/icons";
import { useA11yContext, type A11yScan } from "./A11yContext";

interface A11ySummaryProps {
  componentName: string;
  componentFile: string;
  specimenFile: string;
}

export function A11ySummary({
  componentName,
  componentFile,
  specimenFile,
}: A11ySummaryProps) {
  const ctx = useA11yContext();
  const [copied, setCopied] = useState(false);

  if (!ctx) return null;
  const { scans } = ctx;
  if (scans.length === 0) return null;

  const scanning = scans.some((s) => s.scanning);
  const totalViolations = scans.reduce((sum, s) => sum + s.violations.length, 0);
  const totalPasses = scans.reduce((sum, s) => sum + s.passes, 0);
  const hasIssues = totalViolations > 0;

  async function copyReport() {
    const md = buildReport({
      componentName,
      componentFile,
      specimenFile,
      scans,
      totalViolations,
      totalPasses,
    });
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* no-op */
    }
  }

  if (scanning && scans.every((s) => s.scanning)) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-chrome-border bg-chrome-surface px-3 py-2 text-chrome-sm text-chrome-muted">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-chrome">
          <Loader2 size={11} strokeWidth={2} className="animate-spin text-primary" />
        </span>
        Scanning {scans.length} specimen{scans.length === 1 ? "" : "s"}…
      </div>
    );
  }

  return (
    <div
      className={`mb-6 flex items-center gap-3 rounded-lg border px-3 py-2 text-chrome-sm transition-colors duration-fast ${
        hasIssues
          ? "border-destructive/30 bg-destructive/5"
          : "border-chrome-border bg-chrome-surface"
      }`}
    >
      <span
        className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
          hasIssues
            ? "bg-destructive text-destructive-foreground"
            : "bg-success text-success-foreground"
        }`}
      >
        <Accessibility size={11} strokeWidth={2.25} />
      </span>
      <span className="text-chrome-active">
        {scans.length} specimen{scans.length === 1 ? "" : "s"}
      </span>
      <span aria-hidden="true" className="text-chrome-muted">
        ·
      </span>
      <span className={hasIssues ? "text-destructive" : "text-chrome-foreground"}>
        {hasIssues
          ? `${totalViolations} issue${totalViolations === 1 ? "" : "s"}`
          : "no issues"}
      </span>
      <span className="ml-auto flex items-center gap-2">
        <span className="text-chrome-xs tabular-nums text-chrome-muted">
          {totalPasses} checks passed
        </span>
        {hasIssues && (
          <button
            onClick={copyReport}
            className="flex h-6 items-center gap-1.5 rounded-md border border-chrome-border bg-chrome-surface px-2 text-chrome-xs font-semibold text-chrome-foreground transition-colors duration-fast hover:border-chrome-ring hover:text-chrome-active"
          >
            {copied ? (
              <Check size={11} strokeWidth={2.25} className="text-success" />
            ) : (
              <Copy size={11} strokeWidth={2} />
            )}
            {copied ? "Copied" : "Copy report"}
          </button>
        )}
      </span>
    </div>
  );
}

interface ReportInput {
  componentName: string;
  componentFile: string;
  specimenFile: string;
  scans: A11yScan[];
  totalViolations: number;
  totalPasses: number;
}

function buildReport({
  componentName,
  componentFile,
  specimenFile,
  scans,
  totalViolations,
  totalPasses,
}: ReportInput): string {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const specimensWithIssues = scans.filter((s) => s.violations.length > 0);
  const displayName = componentName.replace(/([a-z])([A-Z])/g, "$1 $2");

  const lines: string[] = [];
  lines.push(
    `I'm working on the **${displayName}** component in my Angora design system and got the following accessibility violations from axe-core. Each violation includes the rule, failing selectors, and a help URL. Help me fix them in the source file.`
  );
  lines.push("");
  lines.push(`## Context`);
  lines.push("");
  lines.push(`- **Component:** \`${componentName}\``);
  lines.push(`- **Source:** \`${componentFile}\``);
  lines.push(`- **Specimen:** \`${specimenFile}\``);
  if (url) lines.push(`- **Preview:** ${url}`);
  lines.push(`- **Scanner:** axe-core (WCAG 2.1 AA)`);
  lines.push(
    `- **Summary:** ${totalViolations} violation${totalViolations === 1 ? "" : "s"} across ${specimensWithIssues.length}/${scans.length} specimen${scans.length === 1 ? "" : "s"} · ${totalPasses} checks passed`
  );
  lines.push("");

  for (const scan of specimensWithIssues) {
    lines.push(`## Specimen: ${scan.title}`);
    lines.push("");
    lines.push(
      `${scan.violations.length} violation${scan.violations.length === 1 ? "" : "s"} · ${scan.passes} checks passed`
    );
    lines.push("");
    for (const v of scan.violations) {
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
  }

  const cleanSpecimens = scans.filter((s) => s.violations.length === 0);
  if (cleanSpecimens.length > 0) {
    lines.push(`## Specimens with no issues`);
    lines.push("");
    for (const s of cleanSpecimens) {
      lines.push(`- ${s.title} (${s.passes} checks passed)`);
    }
    lines.push("");
  }

  return lines.join("\n");
}
