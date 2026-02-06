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
Shadow scale: sm, md, lg, xl (defined in global.css @theme)

## Component Patterns
### Buttons
- Primary: solid background (bg-primary-500), white text
- Secondary: transparent, inset border (shadow-[inset_0_0_0_1px]), dark text
- Ghost: transparent, no border, muted text (text-gray-600)
- Sizes: sm (text-sm/px-4 py-2), md (text-base/px-6 py-3), lg (text-lg/px-8 py-4)

### Form Inputs
- Text input: border-gray-300, rounded-md, placeholder text-gray-400
- Textarea: same border/radius as text input, resize-y
- Select: same border/radius, custom chevron icon, appearance-none
- Checkbox: border-2 rounded-sm, checked=bg-primary-500
- Radio: border-2 rounded-full, selected=border-primary-500 with inner dot
- Toggle: track (rounded-full), thumb (white circle with shadow)
- File upload: dropzone (dashed border) or button style
- Search: leading search icon, optional clear button

### Shared Form Patterns
- States: default, hover (border-gray-400), focus (border-primary-500 + outline), disabled (opacity-50), error (border-red-500)
- Labels: text-sm font-medium text-gray-700, placed above input with gap-1.5
- Hints: text-xs, gray-400 default, red-500 for errors, green-600 for success

## Decisions Log
| Decision | Chosen | Why |
|----------|--------|-----|
| Build tool | Astro | Static HTML+CSS output, component model for gallery assembly |
| Styling | Tailwind CSS v4 | @theme replaces tokens.css, utility classes replace @scope CSS, design tokens as Tailwind theme |
| Element approach | Semantic HTML + Tailwind | Replaces custom elements (component-*) with plain HTML + utility classes |
| State display | data-state attribute | Specimen mode: state prop resolves to static classes. Demo mode: pseudo-class variants |
