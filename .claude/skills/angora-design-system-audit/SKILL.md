---
name: angora-design-system-audit
description: Review components or pages against the design system. Use after building a component or page, or when checking existing work for violations.
argument-hint: [path]
---

# Audit: $ARGUMENTS

## Before you start

1. **Read `src/system.md`** — intent, accessibility standard, anti-patterns, decisions log.
2. **Read `src/styles/global.css`** — the token definitions you're validating against.
3. **Read [design-principles.md](../docs/design-principles.md)** — the full set of design principles informing this review.
4. **Determine the audit scope** — is the target a component (`src/components/`), a design system page (`src/pages/design-system/`), a layout (`src/pages/design-system/layouts/`), or a site page (`src/pages/*.astro`)? Some rules only apply to specific scopes (marked below). Layouts are full-page compositions — audit them like site pages (Page Rules apply) but note they use placeholder content, so skip SEO checks.

Then validate the target against the rules below.

## Hard Rules (always enforced)

### Tokens & Scoping

| Rule | Check |
|------|-------|
| Token compliance | No arbitrary values. All styling via Tailwind utility classes referencing theme tokens |
| Scoping | Component styles via Tailwind classes on elements. No global CSS selectors in component files |
| No true black | Never `#000`, `rgb(0,0,0)`, or `black`. Always near-black from the grey scale (e.g., `gray-900`, `gray-950`) |
| No generated colors | No `color-mix()`, `lighten()`, `darken()`, or `rgba()` for text on colored backgrounds. All colors from explicit palette values |

### Component Contracts

| Rule | Check |
|------|-------|
| `data-component` | Every component's root element has `data-component="Name"` (PascalCase). Sub-components too (`data-component="CardBody"`). Attribute appears first in the attribute list |
| Section composition | Section-level components (Hero, Pricing, Features, CTA, etc.) compose `Section` internally. They render `<Section>` or `<Section seamless>`, never a raw `<section>` with manual padding. Consumer never wraps them in `<Section>` |
| No outer vertical margin | Section-level components never set `margin-top`/`margin-bottom` on their outermost element. That's `page-flow`'s job. Flag any `mt-*`/`mb-*`/`my-*` on a section-level component's root |
| Images as `<img>` | All imagery uses `<img>` elements with `object-fit: cover` where needed. No CSS `background-image` for content images (heroes, cards, full-bleed sections). Position with `absolute inset-0` inside a relative container for backdrops |
| States | All components interactive by default (pseudo-class variants for `hover:`, `active:`, `focus-visible:` + transitions). Form `state` prop only for non-interactive states (error, success, disabled). Composites: own variants only, child primitives in default state |

### ARIA & Accessibility

| Rule | Check |
|------|-------|
| Contrast ratios | Per the standard in `system.md`. Non-text contrast ≥ 3:1 if WCAG 2.2 or EAA |
| Target sizes | Interactive targets ≥ 44px. Check at narrow widths too |
| ARIA regions | `<section>` has `aria-labelledby` (pointing to its heading) or `aria-label` (if no visible heading). `<nav>` has `aria-label` (critical when multiple navs on page). Related control clusters use `role="group"` with `aria-label` |
| Color independence | Don't rely on color alone to convey meaning — always a secondary indicator (icon, text, border, pattern) |
| EAA extras | If standard is EAA: verify `lang` on `<html>`, reflow at 320px, text spacing override tolerance, 200% text resize |

### Semantic HTML

| Rule | Check |
|------|-------|
| Semantic elements | Content uses semantic elements (`section`, `nav`, `h1`–`h6`, `p`, `a`, `button`, `input`, `figure`, `blockquote`, `ul`/`ol`, `footer`). No `<div>` where a semantic element fits |
| Heading hierarchy | Heading levels don't skip (no `h1` → `h3`). Section-level components accept an `as` prop or similar for heading level flexibility |

### Responsive

| Rule | Check |
|------|-------|
| Container query syntax | Responsive variants use `@sm:`, `@md:`, `@lg:`, `@xl:` (container queries). No `@media` / no viewport-based `sm:`/`md:`/`lg:` in component markup. Only exception: `design-system.css` (tooling) |
| Responsive behavior | Component actually adapts at narrow (~320px), medium (~768px), and wide (~1280px) container widths. Check: multi-column layouts stack to single column; text doesn't overflow or clip; interactive targets stay ≥ 44px; images/media scale without breaking aspect ratio; spacing reduces proportionally at narrow widths |
| `@container` ancestor | Typography scales via `clamp()`/`cqi` tokens only if a `@container` ancestor exists. Verify one is present (Section provides it). Flag `@container` on an element that has no `@sm:`/`@md:`/`@lg:` layout variants — the wrapper is useless without breakpoint-specific styles |

## Design Rules (always enforced, require judgment)

### Hierarchy

| Rule | Check |
|------|-------|
| Three-tier emphasis | Clear primary/secondary/tertiary emphasis using size + weight + color together |
| Three-tier text color | Exactly three text color tiers: dark (e.g., `gray-900`) for primary, medium (e.g., `gray-500`) for secondary, light (e.g., `gray-400`) for tertiary. Flag arbitrary in-between greys that don't serve one of these three roles |
| Font weight discipline | Only two weights: normal (`font-normal`/`font-medium`, 400–500) and bold (`font-semibold`/`font-bold`, 600–700). Flag `font-thin`, `font-extralight`, `font-light` (under 400) |
| Label treatment | Labels should be de-emphasized (smaller, lighter, thinner). Combine labels and values when possible ("12 left in stock" not "In stock: 12") |
| Grey on colored backgrounds | No `text-gray-*` or opacity-based text on colored backgrounds. Hand-pick a same-hue color with adjusted saturation/lightness |

### Spacing

| Rule | Check |
|------|-------|
| Proximity grouping | Related elements closer together, groups further apart. No ambiguous spacing where the relationship between elements is unclear |
| Generous whitespace | Start with too much, not too little. Flag areas that feel cramped — especially padding inside cards, space between section heading and content |

### Typography

| Rule | Check |
|------|-------|
| Line length | 45–75 characters. Use `max-w-[Xch]` (prefer `ch` units) on text containers. Constrain paragraphs independently if container has full-width elements |
| Line height | Proportional to font size: 1.5–1.75 for body text, 1.0–1.2 for display/heading text. Wider content may need up to 2.0 |
| `text-wrap: balance` | Headings (`h1`–`h4`, display text) should have `text-wrap: balance` to prevent orphan lines. The `prose` utility applies this automatically |
| `text-wrap: pretty` | Body text (`p`, `li`, `blockquote`) should have `text-wrap: pretty` to prevent single-word last lines. The `prose` utility applies this automatically |
| Letter-spacing | Headlines should tighten tracking (`tracking-tight` or `tracking-tighter`). All-caps text should widen (`tracking-wide` or `tracking-wider`) |
| Center-align limits | Center-aligned text only for very short blocks (1–3 lines). Body copy and longer text must be left-aligned. Flag centered paragraphs |
| Tabular numbers | Numbers in tables, stats, and vertically-aligned contexts should use `tabular-nums` (`font-variant-numeric: tabular-nums`) |

### Color

| Rule | Check |
|------|-------|
| Meaning, not decoration | Color communicates meaning. Greys for structure, color for emphasis and action |
| Semantic color usage | Red for errors/destructive, yellow/amber for warnings, green for success. Don't repurpose semantic colors for decoration |

### Depth

| Rule | Check |
|------|-------|
| Consistent application | Similar elements at the same elevation. Light source from above |
| Shadow interaction | Interactive elevated elements: hover increases shadow (lift), active decreases shadow (press). Flag elevated buttons/cards without shadow transitions |
| Fewer borders | Prefer box shadows, different background colors, or extra spacing over borders for visual separation. Flag heavy `border` usage where a subtler technique would work |

## Page Rules (site pages only — `src/pages/*.astro`, not design system pages)

Skip this section when auditing components or design system specimen pages.

| Rule | Check |
|------|-------|
| `page-flow` wrapper | Sections wrapped in `<main class="page-flow">` for inter-section spacing |
| Section component | Every section on the page uses the Section component (directly or via a section-level component that composes it internally). No raw `<section>` elements with manual padding |
| No double-wrapping | Section-level components (Hero, Features, etc.) already compose Section internally. Don't wrap them in `<Section>` again on the page |
| Seamless usage | Sections with background colors/images use `<Section seamless>` (or the section-level component's `seamless` prop). Adjacent seamless sections should butt up (0 gap) |
| Background rhythm | Page has visual rhythm — some variation in section backgrounds (alternating light/dark, or strategic use of color). Flag a page where every section is the same plain background |
| SEO | Page has `<title>`, `<meta name="description">`. Template-driven pages wire SEO from table fields (`meta_title`, `meta_description`). Flag missing OG tags on public-facing pages |

## Soft Rules

- **Anti-pattern violations** — anything listed in `system.md` Anti-Patterns section.
- **Pattern consistency** — does this component follow the conventions established by existing components? Read 2–3 peers to compare.
- **Personality alignment (swap test)** — could you swap this component's styling for the most generic version and the design wouldn't feel different? If yes, it's defaulting — flag it.
- **Prose utility** — content-heavy sections (articles, about copy, rich text from CMS) should use the `prose` utility class from `global.css`. It handles heading sizes, vertical rhythm, list styling, blockquotes, links, `text-wrap`, and inline treatments. Components (cards, heroes) should NOT use `prose` — they own their spacing explicitly via `gap-*` classes.
- **Finishing touches** — are there opportunities to supercharge defaults? Custom list bullets, styled blockquotes, accent borders, subtle background decoration. Don't mandate these, but suggest where they'd elevate the work.

## Output

Report all violations with: file path, line number, rule category, rule name, and suggested fix.

Severity levels:
- **Error** — hard rule violation. Must fix.
- **Warning** — design rule violation. Should fix — explain why.
- **Info** — soft rule suggestion. Propose, don't mandate.

Group findings by file, then by severity. Fix all errors and warnings before showing components to the user.