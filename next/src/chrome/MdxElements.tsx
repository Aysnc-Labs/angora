"use client";

import { useSpecimenContext } from "./SpecimenContext";

function withSpecimenGuard(
  Tag: keyof React.JSX.IntrinsicElements,
  className: string
) {
  return function ProseElement({ children }: { children?: React.ReactNode }) {
    const { activeSpecimen, previewMode } = useSpecimenContext();
    if (activeSpecimen || previewMode) return null;
    return <Tag className={className}>{children}</Tag>;
  };
}

/** H1 — big, tight, balanced. The page's name. */
export const MdxH1 = withSpecimenGuard(
  "h1",
  "mb-4 text-4xl font-bold tracking-tighter text-balance text-foreground"
);

/** H2 — section heading with a primary accent bar. */
export function MdxH2({ children }: { children?: React.ReactNode }) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return (
    <h2 className="relative mt-14 mb-4 flex items-center gap-3 text-xl font-semibold tracking-tight text-balance text-foreground">
      <span
        aria-hidden="true"
        className="inline-block h-5 w-[3px] rounded-full bg-primary"
      />
      {children}
    </h2>
  );
}

/** H3 — small eyebrow for sub-sections. */
export const MdxH3 = withSpecimenGuard(
  "h3",
  "mt-8 mb-2 text-[11px] font-semibold uppercase tracking-widest text-chrome-muted"
);

/** Body paragraph — constrained line length, readable size. */
export const MdxP = withSpecimenGuard(
  "div",
  "max-w-[68ch] text-[15px] leading-relaxed text-pretty text-muted-foreground [&:not(:first-child)]:mt-3"
);

export function MdxUl({ children }: { children?: React.ReactNode }) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return (
    <ul role="list" className="mdx-ul my-4 max-w-[68ch] text-[15px]">
      {children}
    </ul>
  );
}

export function MdxOl({ children }: { children?: React.ReactNode }) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return (
    <ol role="list" className="mdx-ol my-4 max-w-[68ch] text-[15px]">
      {children}
    </ol>
  );
}

export const MdxLi = withSpecimenGuard("li", "");

export const MdxStrong = withSpecimenGuard(
  "strong",
  "font-semibold text-foreground"
);

export const MdxCode = withSpecimenGuard("code", "mdx-code");

export const MdxPre = withSpecimenGuard("pre", "mdx-pre");

export function MdxBlockquote({ children }: { children?: React.ReactNode }) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return <blockquote className="mdx-blockquote">{children}</blockquote>;
}

export function MdxHr() {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return (
    <hr
      aria-hidden="true"
      className="my-10 h-px border-0 bg-gradient-to-r from-chrome-border via-chrome-border to-transparent"
    />
  );
}

export function MdxA({
  href,
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  const { activeSpecimen, previewMode } = useSpecimenContext();
  if (activeSpecimen || previewMode) return null;
  return (
    <a
      href={href}
      className="mdx-link"
      {...(href?.startsWith("http")
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </a>
  );
}
