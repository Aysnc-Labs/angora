---
name: angora-design-system-init
description: Start a new design system. Runs domain exploration and design system setup.
---

**Everything in this repo is scaffolding.** Existing components, design system pages, wireframes, tokens, and system.md are all starter placeholders — not approved design work. Use their file structure but replace all content. Nothing here is precious.

# Resumability

Before starting, check `system.md` for an **Init Progress** section at the bottom. If it exists:
1. Read the completed steps — skip them entirely.
2. Resume from the first uncompleted step.
3. If a step has pending user decisions noted (e.g., "needs: icon set from user"), ask for those before building.
4. Tell the user where you're resuming from: *"Picking up from Step X — [step name]. Last completed: [previous step]."*

If no Init Progress section exists, this is a fresh start — begin at Phase 1.

**Progress tracking:** After completing each step, update the Init Progress section in `system.md` immediately. Mark the step as done, note any pending decisions for the next step. This ensures the process survives context compression and new sessions.

# Roadmap

At the start of the process (or when resuming), present the full build sequence to the user so they always know what's ahead:

> **Here's what we're building (you'll approve at each checkpoint):**
>
> 1. **Creative direction** — audience, feel, color world, signature element, anti-patterns
> 2. **Tokens + style guide** — colors, type, spacing, shadows, radii in browser
> 3. **Buttons** — sizes, variants, icon buttons
> 4. **Icons** — starter icon set as components + downloadable SVGs
> 5. **Grid + Section** — Section container component, section spacing rhythm, column patterns
> 6. **Cards** — card types for your pages
> 7. **Forms** — inputs, selects, checkboxes, radios, toggles, all states

Mark the current step with ← and update the marker at each checkpoint. Always tell the user what decisions are coming next.

# Phase 1: Domain Exploration

**Do not read any files yet.** This phase is a conversation with the user — no codebase exploration, no file reads. Everything you need comes from their answers.

Four mandatory questions answered **explicitly** (not internally):

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

**Checkpoint.** Present all five outputs to the user. Ask explicitly: *"Does this creative direction feel right? Anything to adjust before I start translating this into tokens?"* Do not proceed to Phase 2 until they approve. Update Init Progress in `system.md`.

# Phase 2: Design System Setup

**Now read files.** Start with [design-principles.md](../docs/design-principles.md) for detailed guidance on color (hue rotation, shade generation, grey temperature), typography (font discovery, line-height rules), and depth (two-part shadows, five-level scale). Then read `src/system.md` and `src/styles/global.css` for the template structure to fill in.

## 2a. Structural tokens (personality-agnostic)

- Spacing scale (base 8px, ~25% jumps: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128)
- Type scale (hand-crafted, not modular ratio). Body text as fixed px: 12, 14, 16, 18, 20. Heading/display sizes use `clamp()` with `cqi` so they scale fluidly with container width: `clamp(floor, Xcqi, max)` where X = max ÷ 12 (hits max at the 1200px container). Requires a `@container` ancestor.
- Line height rules, max content widths, breakpoints

## 2b. Personality tokens (from Phase 1)

Translate Phase 1 outputs into concrete token decisions:

- **Color world → palette.** Pick the strongest 1–2 domain colors as primary/accent hue(s). Generate full 50–950 shade ranges. Choose grey temperature (warm/cool) based on the feel — "bank vault" is cool grey, "launchpad" is warm.
- **Feel → shape and depth.** "Confident" = smaller radii, firm shadows. "Playful" = larger radii, softer shadows. Match border radius scale and shadow strategy to the feel words.
- **Domain vocabulary → signature element.** The signature element from Phase 1 becomes a concrete CSS/markup choice — a specific color accent, radius treatment, animation, or layout pattern.
- Font family, full color palette (50–950 shade ranges for primary + grey at minimum)
- Shadow scale using two-part shadows (consistent application — don't mix soft diffuse with solid flat on similar elements)

## 2c. Tokens + Style Guide

`src/system.md` and `src/styles/global.css` are **scaffolding** — placeholder structure meant to be replaced with real values from Phase 1. Use the file structure (sections, `@theme` block) but replace all placeholder content (`[TBD]`, `[Placeholder]`, template token values). Don't preserve placeholder values out of caution — they're disposable. `system.md` is the "why" file — fill in Intent, Accessibility, Anti-Patterns, and Decisions Log. All token values go in `global.css` only.

Build **only** these first:
1. `global.css` — All `@theme` tokens
2. `system.md` — Intent, accessibility standard, anti-patterns, decisions log
3. `index.astro` (Style Guide) — Visual preview of all tokens (colors, type scale, spacing, shadows, radii). This is the design system home page.

**Checkpoint.** Ask the user to open the style guide in browser (`pnpm dev`). Then ask explicitly: *"How do the tokens look? Anything to adjust — palette, type scale, shadows, radii?"* Do not proceed to 2d until the user confirms the tokens are correct. If they report issues, fix them and ask again. Update Init Progress in `system.md`.

## 2d. Foundational design system pages

All sections must have a `@container` ancestor (required for responsive type tokens to work).

**Dev tools convention:** every component's root element gets `data-component="ComponentName"` (PascalCase). Sub-components too (`data-component="CardBody"`). This makes components identifiable in browser dev tools. Always first attribute in the list.

Before building each page, ask the user any decisions noted below. Build one page at a time, or batch pages that don't need user input.

1. `buttons.astro` — Sizes (sm, md, lg), variants (primary, secondary, ghost), icon buttons. Present 2–3 specific options for icon button layout (icon-left, icon-only, icon-right) and ask the user to pick.
2. `icons.astro` — Icon gallery at sm (16px), md (20px), lg (24px), xl (32px) sizes, plus color variants, with copy-to-clipboard buttons for raw SVG. Each icon is an Astro component (`src/icons/*.astro`). Ask the user to name a starter set of 8–12 icons before building.
3. `grid.astro` — Section component + section spacing rhythm + column gutter patterns.

   **Build the Section component first** (`src/components/Section.astro`):
   - Renders `<section>` with `@container`, container max-width, standard vertical padding
   - Props: `seamless` (boolean → adds `data-seamless`, adds standardized vertical padding tied to `--section-gap`), `aria-label` (for untitled sections), `aria-labelledby` (for titled sections), `class` (pass-through)
   - Non-seamless sections get no vertical padding — `page-flow` margin handles spacing. Seamless sections get vertical padding matching `--section-gap` for consistent rhythm
   - Headings are composed as children — Section doesn't own title markup. Section-level components wire `aria-labelledby` internally since they know their own heading
   - When `seamless`: adds `data-seamless` attribute so `page-flow` collapses gap between adjacent seamless sections
   - Section is a primitive (single file, not a directory) since it has no sub-components — content goes in the default slot

   **Then build the grid design system page** showing:
   - Section specimens: section with composed heading, untitled section (`aria-label`), seamless section (backgrounded, `data-seamless`)
   - Two sections stacked in `page-flow` showing correct inter-section rhythm (`--section-gap`)
   - Two seamless sections stacked showing zero gap (backgrounds butt up)
   - Column gutter patterns inside sections
   - Show the default spacing values in context and ask if the rhythm feels right before building variants.
4. `cards.astro` — Basic card patterns (content card, feature card, pricing card shell). Show the 3 variants and ask: are these the right types for your pages? Missing any?
5. `forms.astro` — Form elements: text input, textarea, select, checkbox, radio, toggle/switch, file upload, search input. All states, sizes, and variants.

**Checkpoint.** Ask the user to open all design system pages in browser (`pnpm dev`). Ask explicitly: *"How do the components look? Anything to adjust before we move on to building pages?"*

**Cleanup.** Once the user approves, remove the Init Progress section from `system.md` entirely — it's process scaffolding, not permanent documentation. The completed design system speaks for itself. With Init Progress removed, the `/angora` entry point will recognize init as complete (Intent section filled in, no Init Progress section present).
