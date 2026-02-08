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
| Build tool | Astro | Static HTML+CSS output, component model for gallery assembly |
| Styling | Tailwind CSS v4 | @theme replaces tokens.css, utility classes replace @scope CSS, design tokens as Tailwind theme |
| Element approach | Semantic HTML + Tailwind | Replaces custom elements (component-*) with plain HTML + utility classes |
| State display | Interactive by default | Components always include pseudo-class variants (hover, active, focus). Form components use `state` prop only for non-interactive states (error, success, disabled). No frozen specimens for interaction states — HTML is interactive, unlike Figma |
| Responsive type | `clamp()` with `cqi` in tokens | Heading/display sizes (2xl–7xl) use `clamp(floor, Xcqi, max)` so type scales fluidly with container width. No component-level responsive type classes needed. Requires `@container` ancestor. Body text (xs–xl) stays fixed |
