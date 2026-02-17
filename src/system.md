# Design System

## Intent
[Placeholder — run `init` to complete domain exploration and define the design personality]

## Accessibility
Standard: [TBD — chosen during init]
Contrast — normal text: [TBD]
Contrast — large text: [TBD]
Non-text contrast: [TBD]
Target size: [TBD]
Reflow: [TBD]
Text spacing override: [TBD]
Text resize: [TBD]
Lang attribute: [TBD]

## Anti-Patterns
[Populated during init — explicit list of things NOT to do]

## Decisions Log
| Decision | Chosen | Why |
|----------|--------|-----|
| Build tool | Astro | Static HTML+CSS output, component model for design system and site assembly |
| Responsive type | `clamp()` with `cqi` in tokens | Heading/display sizes (2xl–7xl) use `clamp(floor, Xcqi, max)` so type scales fluidly with container width. No component-level responsive type classes needed. Requires `@container` ancestor. Body text (xs–xl) stays fixed |
| Token architecture | Three-tier: primitive → semantic → component | Semantic tokens swap between themes; components never touch primitives. Only semantic tokens in `@theme`, so raw palette utilities don't exist — architectural enforcement |
| Semantic token names | shadcn convention: `background`, `foreground`, `card`, `muted`, `accent`, `primary`, `secondary`, `destructive`, `border`, `input`, `ring` + `-foreground` pairs | Largest component ecosystem — engineers are at home immediately. No learning curve |
| Color space | OKLCH | Perceptually uniform lightness — L=0.7 looks equally bright regardless of hue. Makes dark palette generation reliable. shadcn has migrated to OKLCH |
| Dark mode trigger | `.dark` class on `<html>` via `@custom-variant dark (&:where(.dark, .dark *))` | Tailwind default, shadcn convention. Familiar to widest audience |
| Dark surface color | Dark gray (~L=0.15), never pure black | Pure black causes halation — white text glows/bleeds for 30–60% of people with astigmatism. Material, Apple, Atlassian consensus |
| Dark elevation | Tonal — higher surfaces lighter, no shadows | Shadows invisible on dark backgrounds. Use surface lightness to convey depth. Material, Apple, Atlassian consensus |
| Design system chrome dark mode | Full toggle — sidebar, specimens, headers all switch. Rewrite `design-system.css` to Tailwind utilities + semantic tokens | Validates chrome itself in dark mode. Dark mode comes free via semantic tokens |
