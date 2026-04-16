"use client";

import { useSpecimenContext } from "./SpecimenContext";

function withSpecimenGuard(
  Tag: keyof React.JSX.IntrinsicElements,
  className: string
) {
  return function ProseElement({ children }: { children?: React.ReactNode }) {
    const { activeSpecimen } = useSpecimenContext();
    if (activeSpecimen) return null;
    return <Tag className={className}>{children}</Tag>;
  };
}

export const MdxH1 = withSpecimenGuard("h1", "text-2xl font-semibold tracking-tight text-foreground");
export const MdxH2 = withSpecimenGuard("h2", "mt-10 mb-4 text-xs font-semibold uppercase tracking-widest text-chrome-foreground/60");
export const MdxH3 = withSpecimenGuard("h3", "text-sm font-semibold text-foreground");
export const MdxP = withSpecimenGuard("div", "text-sm leading-relaxed text-muted-foreground");
export const MdxUl = withSpecimenGuard("ul", "list-disc space-y-1 pl-5 text-sm text-muted-foreground");
export const MdxOl = withSpecimenGuard("ol", "list-decimal space-y-1 pl-5 text-sm text-muted-foreground");
export const MdxStrong = withSpecimenGuard("strong", "font-semibold text-foreground");
export const MdxCode = withSpecimenGuard("code", "rounded bg-chrome px-1.5 py-0.5 font-mono text-[12px] text-primary");
export const MdxPre = withSpecimenGuard("pre", "overflow-x-auto rounded-lg border border-chrome-border bg-chrome p-4 font-mono text-xs leading-relaxed");
export const MdxLi = withSpecimenGuard("li", "");
export const MdxBlockquote = withSpecimenGuard("blockquote", "border-l-2 border-primary/30 pl-4 text-sm italic text-muted-foreground");

export function MdxHr() {
  const { activeSpecimen } = useSpecimenContext();
  if (activeSpecimen) return null;
  return <hr className="my-8 border-chrome-border" />;
}
