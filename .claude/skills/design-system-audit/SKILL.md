---
name: design-system-audit
description: Review components or pages against the design system. Use after building a component or when checking existing work for violations.
argument-hint: [path]
---

# Audit: $ARGUMENTS

## Before you start

1. **Read `src/system.md`** — intent, accessibility standard, anti-patterns, decisions log.
2. **Read `src/styles/global.css`** — the token definitions you're validating against.
3. **Read [design-principles.md](../docs/design-principles.md)** — the full set of design principles informing this review.

Then validate the target against the rules below.

## Hard Rules (always enforced)

| Rule | Check |
|------|-------|
| Token compliance | No arbitrary values. All styling via Tailwind utility classes referencing theme tokens |
| Hierarchy | Clear primary/secondary/tertiary emphasis (size + weight + color) |
| Spacing | Related elements closer, groups further apart |
| Typography | Line length 45-75 chars. Line height proportional to font size |
| Color | Communicates meaning, not decoration. Greys for structure, color for emphasis |
| Accessibility | Contrast ratios per the standard in `system.md`. Check target sizes if WCAG 2.2. If EAA: verify `lang` on `<html>`, reflow at 320px, non-text contrast ≥ 3:1, text spacing override tolerance, 200% text resize. Don't rely on color alone. |
| Depth | Consistent application across similar elements. Light source from above. |
| States | All components interactive by default (pseudo-class variants). Form `state` prop only for non-interactive states (error, success, disabled). Composites: own variants only, child primitives in default state |
| Semantic HTML | Content uses semantic elements (`section`, `nav`, `h1`-`h6`, `p`, `a`, `button`, `input`, etc.) |
| Scoping | Component styles via Tailwind classes on elements. No global CSS selectors in component files |
| Responsive syntax | Container queries via Tailwind `@` variants (`@sm:`, `@md:`, etc.). No `@media` / no viewport-based `sm:`/`md:` in component markup |
| Responsive behavior | Component must actually adapt at narrow (~320px), medium (~768px), and wide (~1280px) container widths. Typography scales automatically via `clamp()`/`cqi` tokens — verify a `@container` ancestor exists or text won't scale. Check: multi-column layouts stack to single column at narrow widths; text doesn't overflow or get clipped; interactive targets ≥ 44px at narrow widths; images/media scale without breaking aspect ratio or overflowing; spacing reduces proportionally (not the same large gaps at 320px as 1280px). Flag any component that uses `@container` but has no `@sm:`/`@md:`/`@lg:` layout variants — the wrapper is useless without breakpoint-specific styles |

## Soft Rules (from system.md)

Anti-pattern violations, pattern consistency, personality alignment (swap test).

## Output

Report all violations with: file path, line number, rule violated, and suggested fix. Fix all violations before showing components to the user.
