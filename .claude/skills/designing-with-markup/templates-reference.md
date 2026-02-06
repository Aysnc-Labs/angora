# Templates Reference

Starter templates for Phase 2 (init). Adapt to the project's personality — these are starting points, not rigid formats.

## system.md Template

```markdown
# Design System

## Intent
[2-3 sentences: who is this for, what should it feel like, what is the personality]
[This is the North Star — every decision traces back here]

## Accessibility
Standard: [WCAG 2.1 AA | WCAG 2.1 AAA | WCAG 2.2 AA]
Contrast — normal text: [4.5:1 | 7:1]
Contrast — large text: [3:1 | 4.5:1]
Target size: [n/a | ≥ 24x24px (WCAG 2.2)]

## Anti-Patterns
[Explicit list of things NOT to do for this project]
- e.g., No sharp corners (conflicts with warm personality)
- e.g., No dramatic drop shadows
- e.g., No pure black text

## Tokens — Structural
Base spacing unit: 8px
Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128
Type scale: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72
Line heights: 1.0 (display), 1.2 (heading), 1.5 (body), 1.75 (small)
Max content width: 1200px
Breakpoints: 640px, 768px, 1024px, 1280px

## Tokens — Personality
Font: [chosen font] ([why])
Grey temperature: [cool/warm] (hsl [hue] base, [description])
Primary color: hsl([h], [s]%, [l]%) — [why this color]
Color shades: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
Border radius: [default]px, [cards]px, 9999px (pills)
Depth strategy: [chosen strategy]
Shadow scale: sm, md, lg, xl (defined in tokens.css)

## Component Patterns
### [Component Name]
- [Key property]: [token reference]
- [Key property]: [token reference]

## Decisions Log
| Decision | Chosen | Why |
|----------|--------|-----|
| Depth | [strategy] | [reason] |
| Grey temp | [temp] | [reason] |
| Radius | [values] | [reason] |
```

**Rules:**
- Must stay under 200 lines — if it grows, the most important information gets diluted
- Intent section is the North Star — every decision traces back to it
- Decisions Log: every personality-driven choice gets a "why"
- Update Component Patterns when a component is used 2+ times

## tokens.css Template

```css
:root {
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Typography */
  --font-family: '[Font]', system-ui, sans-serif;
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 30px;
  --text-4xl: 36px;
  --text-5xl: 48px;
  --text-6xl: 60px;
  --text-7xl: 72px;

  /* Line height */
  --leading-none: 1;
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Colors — Grey ([temperature], [hue] base) */
  --gray-50: hsl([h], 20%, 98%);
  --gray-100: hsl([h], 18%, 96%);
  --gray-200: hsl([h], 16%, 90%);
  --gray-300: hsl([h], 14%, 82%);
  --gray-400: hsl([h], 12%, 64%);
  --gray-500: hsl([h], 10%, 46%);
  --gray-600: hsl([h], 14%, 34%);
  --gray-700: hsl([h], 18%, 24%);
  --gray-800: hsl([h], 22%, 16%);
  --gray-900: hsl([h], 25%, 10%);
  --gray-950: hsl([h], 30%, 6%);

  /* Colors — Primary */
  --primary-50: hsl([h], [s]%, 97%);
  --primary-100: hsl([h], [s]%, 93%);
  --primary-200: hsl([h], [s]%, 85%);
  --primary-300: hsl([h], [s]%, 74%);
  --primary-400: hsl([h], [s]%, 62%);
  --primary-500: hsl([h], [s]%, 52%);
  --primary-600: hsl([h], [s]%, 44%);
  --primary-700: hsl([h], [s]%, 36%);
  --primary-800: hsl([h], [s]%, 28%);
  --primary-900: hsl([h], [s]%, 20%);
  --primary-950: hsl([h], [s]%, 12%);

  /* Semantic */
  --color-text-primary: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-text-tertiary: var(--gray-400);
  --color-bg: white;
  --color-bg-subtle: var(--gray-50);
  --color-border: var(--gray-200);

  /* Shadows (two-part: direct light + ambient occlusion) */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
  --shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Layout */
  --content-width: 1200px;
}
```

**Rules:**
- No raw values allowed in component files — everything references tokens via `var(--token)`
- Semantic aliases required (color-text-primary, color-bg, etc.)
- Adjust grey hue, primary hue/saturation, and shadow opacity to match project personality
- Increase saturation as lightness moves away from 50% to prevent washed-out shades
- Rotate hue slightly toward bright hues when lightening, dark hues when darkening (max 20-30 degrees)