---
name: angora-assemble
description: Compose approved components into a full page layout. Use when building a complete marketing page from existing components.
argument-hint: <page-name>
---

# Assemble: $ARGUMENTS

Compose approved components into a full page.

## Before you start

1. **Read `src/system.md`** — intent, accessibility standard, anti-patterns.
2. **Read `src/styles/global.css`** — available tokens for page-level spacing and backgrounds.
3. **Read [design-principles.md](../docs/design-principles.md)** — especially Spacing & Layout and Finishing Touches sections.
4. **Inventory existing components** — list `src/components/*.astro` to know what's available. Only use approved, built components.

## Output files

1. **Gallery page** — `src/pages/<page-name>.astro` (using `GalleryLayout`, shows the assembled page)
2. **Full-screen view** — `src/pages/view/<page-name>.astro` (using `FullScreenLayout`, the actual page)

Add the page to the sidebar nav in `src/layouts/GalleryLayout.astro`.

## Steps

1. **Define page structure** — which components, what order, what content
2. **Assemble** — Astro page importing components, composed with Tailwind utility classes
3. **Page-level concerns** — section spacing, background alternation for rhythm, visual flow, responsive behavior via container queries
4. **Review** — run `/angora-component-audit` on the full page for hard rules + page coherence
5. **Visual review** — user opens page in browser (`pnpm dev`). Approves or iterates.
