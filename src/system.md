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

## Tokens — Structural
Base spacing unit: 8px
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128
Type scale: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72
Line heights: 1.0 (display), 1.2 (heading), 1.5 (body), 1.75 (small)
Max content width: 1200px
Breakpoints: 640px, 768px, 1024px, 1280px

## Tokens — Personality
Font: [TBD]
Grey temperature: [TBD]
Primary color: [TBD]
Color shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
Border radius: [TBD]
Depth strategy: [TBD]
Shadow scale: sm, md, lg, xl (defined in tokens.css)

## Component Patterns
### Buttons
- Primary: solid background, white text
- Secondary: transparent, border, dark text
- Ghost: transparent, no border, muted text
- Sizes: sm (14px/8×16), md (16px/12×24), lg (18px/16×32)

## Decisions Log
| Decision | Chosen | Why |
|----------|--------|-----|
| Build tool | Astro | Static HTML+CSS output, component model maps 1:1 to custom elements |
| Element prefix | `component-` | Distinguishes design system elements from generic `site-` prefix |
