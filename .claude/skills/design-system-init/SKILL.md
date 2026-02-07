---
name: design-system-init
description: Start a new design system. Runs domain exploration and design system setup.
disable-model-invocation: true
---

# Phase 1: Domain Exploration

Before any visual work. Four mandatory questions answered **explicitly** (not internally):

1. **Who is the audience?** Not "users" — the actual person. A CFO evaluating enterprise software? A developer choosing a tool?
2. **What must they accomplish?** Not "learn about the product" — the specific action. Sign up? Request a demo? Compare tiers?
3. **What should this feel like?** Specific, evocative words — "confident like a bank vault," "energetic like a launchpad." NOT "clean and modern."
4. **What accessibility standard?** Ask the user which level to target. Common options: WCAG 2.1 AA (most common — 4.5:1 normal text, 3:1 large text), WCAG 2.1 AAA (stricter — 7:1 normal text, 4.5:1 large text), WCAG 2.2 AA (adds target size ≥ 24x24px, focus-not-obscured, dragging alternatives), or EAA/EN 301 549 (European Accessibility Act — WCAG 2.1 AA plus: `lang` on `<html>`, reflow at 320px, non-text contrast ≥ 3:1, text spacing override support, text resizable to 200%). Record the chosen standard in `system.md`.

Then five mandatory outputs:

1. **Domain vocabulary** — 5+ words from the product's world (cybersecurity: shields, vaults, perimeters, sentinel)
2. **Color world** — 5+ colors that exist naturally in the product's domain
3. **Signature element** — One visual choice that could only exist for THIS product (fails the swap test)
4. **Defaults to reject** — 3+ obvious/generic choices named explicitly to consciously avoid
5. **Differentiation** — What makes this UNFORGETTABLE? The one visual thing someone will remember after closing the tab

# Phase 2: Design System Setup

**Reference:** Read [design-principles.md](../docs/design-principles.md) for detailed guidance on color (hue rotation, shade generation, grey temperature), typography (font discovery, line-height rules), and depth (two-part shadows, five-level scale).

**2a. Structural tokens** (personality-agnostic):
- Spacing scale (base 8px, ~25% jumps: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128)
- Type scale (hand-crafted, not modular ratio: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72)
- Line height rules, max content widths, breakpoints

**2b. Personality tokens** (informed by Phase 1):
- Font family, color palette (full 50-950 shade ranges), grey temperature
- Border radius scale, depth strategy (consistent application — don't mix soft diffuse shadows with solid flat shadows on similar elements)
- Shadow scale using two-part shadows

**Starting points:** Read and modify `src/system.md` and `src/styles/global.css` — they already contain the template structure. Don't start from scratch. `system.md` is the "why" file — fill in Intent, Accessibility, Anti-Patterns, and Decisions Log. All token values go in `global.css` only.

**Output:** `system.md` (intent + decisions) + `global.css` (with `@theme` tokens) + six foundational gallery pages:

1. `index.astro` (Style Guide) — Visual preview of all tokens (colors, type scale, spacing, shadows, radii). This is the gallery home page.
2. `buttons.astro` — Sizes (sm, md, lg), variants (primary, secondary, ghost), icon buttons. **Collaborate with user** on specific sizes and icon button patterns.
3. `icons.astro` — Icon gallery at sm (16px), md (20px), lg (24px), xl (32px) sizes, plus color variants, with download links. Each icon exists as both an Astro component (`src/components/icons/*.astro`) and a downloadable SVG (`public/icons/*.svg`). **Ask user to name a starter set of icons.**
4. `grid.astro` — Section spacing rhythm + column gutter patterns. **Collaborate with user** on grid variants and spacing values.
5. `cards.astro` — Basic card patterns (content card, feature card, pricing card shell). **Ask user for feedback** on card variants before proceeding.
6. `forms.astro` — Form elements: text input, textarea, select, checkbox, radio, toggle/switch, file upload, search input. All states, sizes, and variants.

**Visual review checkpoint.** User opens all six gallery pages in browser (`pnpm dev`). Approves before further component work begins.
