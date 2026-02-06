# designing-with-markup

Design engineering for enterprise marketing sites where HTML + CSS is the design medium. Produces a visual design system + component gallery that serves as the source of truth for engineering teams. No JavaScript, no interactivity — a static visual contract.

**Scope:** Marketing sites — heroes, pricing, features, testimonials, CTAs, navigation, footers. Not app UI, not dashboards.

## Core Philosophy

### Two Pillars

**Pillar 1 — Systematic Constraints (Refactoring UI):**
- Define all design tokens upfront: spacing, type scale, color shades, shadows, radii
- Never pick arbitrary values — choose from constrained sets
- Design by elimination, not imagination
- If you're making the same decision twice, you need a system

**Pillar 2 — Intentional Design (interface-design):**
- Defaults are the enemy — if another AI would produce the same output, you failed
- Every choice needs a "why" — if the answer is "it's common" or "it's clean," you defaulted
- Domain exploration before any visual work
- The swap test: if you could swap a choice for the most common alternative and the design wouldn't feel different, you defaulted

### The Fusion

**Intentional constraints.** Structural tokens (spacing scale, type scale, breakpoints) can be locked in without personality context — these are universal. Personality tokens (color palette, font, border radius, shadow depth, grey temperature) require domain exploration first — these ARE the personality.

## File Structure

```
design-system/
  system.md              <- Design memory (Claude reads this every session)
  tokens.css             <- Single source of truth (browser reads this)
  gallery/
    index.html           <- Links to all components
    _base.html           <- Shared base: reset, body typography, gallery chrome
    hero.html            <- All hero variants/states
    navigation.html
    pricing.html
    ...                  <- One file per component type
```

- `system.md` — Design decisions, constraints, patterns. Under 200 lines. See Templates Reference below for template.
- `tokens.css` — CSS custom properties. No raw values in components. See Templates Reference below for template.
- `_base.html` — Contains everything shared across gallery pages: the `<head>` (meta, font imports, token link), global reset (`*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }`), body typography (font-family, font-size, line-height, color, background, font-smoothing), and gallery chrome styles (section headings, labels, specimen layout). This is the single source for all global styles — **component pages must not redefine any of this.**
- `gallery/*.html` — Each component page copies the base structure from `_base.html` and adds ONLY its component-specific `<style>` block (the `@scope` rules). No reset, no body styles, no gallery chrome — those come from the base. When `_base.html` changes, propagate to all component pages.

## Markup Convention

### Custom Elements for Structure, Semantic HTML for Content

Custom elements are design containers. Semantic HTML serves content. No Shadow DOM.

```html
<site-hero>
  <h1>Build faster websites</h1>
  <p>The modern way to ship marketing sites at scale.</p>
  <site-hero-actions>
    <a href="/start" role="button">Get Started</a>
    <a href="/learn">Learn More</a>
  </site-hero-actions>
</site-hero>
```

**Naming rules:**
- Component root: `site-{component}` (e.g., `site-hero`, `site-pricing`)
- Structural children: `site-{component}-{child}` (e.g., `site-hero-actions`)
- Content: semantic HTML (`h1`-`h6`, `p`, `a`, `img`, `ul`, `figure`, `blockquote`)
- Design roles without semantic equivalent: `data-role` attribute (e.g., `<p data-role="eyebrow">`)

**Images: always use `<img>`, never CSS background images.** Use `<img>` with `object-fit: cover` for all imagery including hero backgrounds, card covers, and full-bleed sections. This enables responsive images via `srcset`/`sizes` and `<picture>`, provides `alt` text for accessibility, and lets the browser optimize loading with `loading="lazy"` and `fetchpriority`. Position with CSS (`position: absolute; inset: 0`) inside a relatively-positioned container when used as a backdrop.

### `@scope` for Style Isolation

Each component's styles scoped to its custom element. No style leakage, no global selectors.

```css
@scope (site-hero) {
  :scope {
    max-width: var(--content-width);
    margin-inline: auto;
    padding: var(--space-20) var(--space-6);
    text-align: center;
  }
  h1 {
    font-size: var(--text-5xl);
    font-weight: 700;
    line-height: var(--leading-tight);
    color: var(--color-text-primary);
    letter-spacing: -0.02em;
  }
}
```

### States via Attributes

All states rendered statically. No JavaScript. Attributes, not classes.

**Primitive vs composite components:** Primitives (button, badge, input) show all their own states and variants in their gallery page. Composite components (hero, pricing, nav) show *their own* variants but render child primitives in default state only — the child's states are already documented in its own gallery page. Don't repeat button hover/focus/disabled states inside every component that uses a button.

```html
<site-button>Subscribe</site-button>
<site-button state="hover">Subscribe</site-button>
<site-button state="active">Subscribe</site-button>
<site-button state="focus">Subscribe</site-button>
<site-button disabled>Subscribe</site-button>

<!-- Variants -->
<site-button variant="primary">Get Started</site-button>
<site-button variant="secondary">Learn More</site-button>
<site-button variant="ghost">Cancel</site-button>
```

```css
@scope (site-button) {
  :scope { /* default styles */ }
  :scope[state="hover"] { background: var(--primary-600); }
  :scope[state="active"] { background: var(--primary-700); transform: translateY(1px); }
  :scope[state="focus"] { outline: 2px solid var(--primary-300); outline-offset: 2px; }
  :scope[disabled] { opacity: 0.5; cursor: not-allowed; }
  :scope[variant="secondary"] { background: transparent; border: 1px solid var(--color-border); }
  :scope[variant="ghost"] { background: transparent; color: var(--color-text-secondary); }
}
```

## Workflow

### Phase 1: Domain Exploration

Before any visual work. Four mandatory questions answered **explicitly** (not internally):

1. **Who is the audience?** Not "users" — the actual person. A CFO evaluating enterprise software? A developer choosing a tool?
2. **What must they accomplish?** Not "learn about the product" — the specific action. Sign up? Request a demo? Compare tiers?
3. **What should this feel like?** Specific, evocative words — "confident like a bank vault," "energetic like a launchpad." NOT "clean and modern."
4. **What accessibility standard?** Ask the user which level to target. Common options: WCAG 2.1 AA (most common — 4.5:1 normal text, 3:1 large text), WCAG 2.1 AAA (stricter — 7:1 normal text, 4.5:1 large text), or WCAG 2.2 AA (adds target size ≥ 24x24px for interactive elements, focus-not-obscured, and dragging alternatives). Record the chosen standard in `system.md` and enforce it in the review gate.

Then four mandatory outputs:

1. **Domain vocabulary** — 5+ words from the product's world (cybersecurity: shields, vaults, perimeters, sentinel)
2. **Color world** — 5+ colors that exist naturally in the product's domain
3. **Signature element** — One visual choice that could only exist for THIS product (fails the swap test)
4. **Defaults to reject** — 3+ obvious/generic choices named explicitly to consciously avoid

### Phase 2: Design System Setup

**2a. Structural tokens** (personality-agnostic):
- Spacing scale (base 8px, ~25% jumps: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 128)
- Type scale (hand-crafted, not modular ratio: 12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72)
- Line height rules, max content widths, breakpoints

**2b. Personality tokens** (informed by Phase 1):
- Font family, color palette (full 50-950 shade ranges), grey temperature
- Border radius scale, depth strategy (consistent application — don't mix soft diffuse shadows with solid flat shadows on similar elements)
- Shadow scale using two-part shadows

**Output:** `system.md` + `tokens.css` + `gallery/style-guide.html` (visual preview of all tokens).
See Templates Reference below for starter templates.

**Visual review checkpoint.** User opens `style-guide.html` in browser. Approves before component work begins.

### Phase 3: Component Building

For each component:

1. **Declare intent** — What is it for? What hierarchy? What states?
2. **Reference system.md** — Check existing patterns. Extend, don't duplicate.
3. **Build** — Custom element markup + @scope CSS. All states via attributes. All values from tokens.css.
4. **Self-review gate** — Validate against hard rules (see below).
5. **Visual review** — User opens gallery page. Approves or iterates.
6. **Update system.md** — Record new reusable patterns.

**Suggested component order:** Typography specimens, Buttons/CTAs, Navigation, Hero sections, Feature grids, Pricing tables, Testimonials, Stats, Logo clouds, FAQ, CTA sections, Footer, Cards.

### Phase 4: Self-Review Gate

Dispatch a validation subagent after every component. Fresh context, loaded with the hard rules, `system.md`, `tokens.css`, and the generated component.

**Hard rules (always enforced):**

| Rule | Check |
|------|-------|
| Token compliance | No raw values. Everything uses `var(--token)` |
| Hierarchy | Clear primary/secondary/tertiary emphasis (size + weight + color) |
| Spacing | Related elements closer, groups further apart |
| Typography | Line length 45-75 chars. Line height proportional to font size |
| Color | Communicates meaning, not decoration. Greys for structure, color for emphasis |
| Accessibility | Contrast ratios per the standard chosen in Phase 1 (recorded in `system.md`). Check target sizes if WCAG 2.2. Don't rely on color alone. |
| Depth | Consistent application across similar elements. Light source from above. |
| States | Primitives: default, hover, active, focus, disabled. Composites: own variants only, child primitives in default state |
| Semantic HTML | Content uses semantic elements. Custom elements only for structure |
| Scoping | All styles use @scope. No global selectors in component files |

**Soft rules** (from `system.md`): anti-pattern violations, pattern consistency, personality alignment (swap test).

Fix violations before showing components to the user.

For the full set of design principles informing the review, see Design Principles Reference below.

### Phase 5: Page Assembly

Compose approved components into full pages:

1. Define page structure — which components, what order, what content
2. Assemble — single HTML importing `tokens.css`, containing the components
3. Page-level concerns: section spacing, background alternation for rhythm, visual flow, responsive behavior
4. Full-page review against hard rules + page coherence

### Phase 6: System Evolution

- Add to `system.md` when a component is used 2+ times or establishes a reusable pattern
- Update tokens only when truly necessary — resist adding values
- Keep `system.md` under 200 lines

## Commands

### `init`
Start new design system. Runs Phase 1 + Phase 2: domain exploration, token definition, style guide preview.

### `component <name>`
Build a new component. Runs Phase 3 for the specified component type.

### `audit [path]`
Review existing components or pages against the design system. Runs Phase 4 on demand.

### `status`
Display current state: direction, tokens defined, components built, patterns established.

### `assemble <page-name>`
Compose approved components into a full page. Runs Phase 5.

## What This Is NOT

- **Not a component framework.** No JavaScript, no reactivity. Static visual contract.
- **Not framework-specific.** Pure HTML + CSS. Engineers port to their framework.
- **Not a Figma replacement.** Design in code, not a visual tool.
- **Not for app UI.** Marketing sites only.

---

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

---

# Design Principles Reference

Principles from Refactoring UI and interface-design that inform the self-review gate and all design decisions.

## Process & Personality

- Design in grayscale first — establish hierarchy through spacing, contrast, and size before adding color. Color masks hierarchy problems.
- Start with a feature, not a layout — design actual functionality before the shell/navigation.
- Work in short cycles — design a simple version, build it, iterate on the working thing. Don't design everything upfront. Low-fidelity work (sketches, wireframes) is disposable — use it to explore, then abandon it once decisions are made.
- Be a pessimist — design the smallest useful version you can ship. Don't imply functionality in your designs that isn't ready to build.
- Border-radius is a personality lever — `0` = formal, `4-6px` = neutral, `12px+` = playful. Must be consistent across the entire interface.
- Font choice signals personality — serif = elegant/classic, rounded sans-serif = playful, neutral sans-serif = professional.
- Language/tone is a design decision — "Account Settings" vs "Hey, let's set things up!" conveys different personalities.
- Systematize everything — define constrained scales for font size, font weight, line-height, color, margin, padding, width, height, box shadows, border-radius, border-width, and opacity. If you're picking a value, it should come from a predefined scale.
- Design by elimination — pick a value from your scale, try its neighbors, eliminate obviously wrong ones. Never pick arbitrary values.
- Start mobile-first (~400px), then scale up. You'll change less than you think.

## Hierarchy

- Not all elements are equal. Deliberately de-emphasize secondary and tertiary information.
- Size isn't everything — use font weight AND color, not just font size, to create hierarchy.
- Three-tier text color system: dark (e.g., gray-900) for primary content, medium grey (e.g., gray-500) for secondary, light grey (e.g., gray-400) for tertiary. Use exactly three tiers, not arbitrary greys.
- Only two font weights for UI: normal (400 or 500) and bold (600 or 700). Never use weights under 400 — use lighter color or smaller size instead.
- Emphasize by de-emphasizing: make everything around the focal point quieter. Sometimes the best way to make something stand out is to remove backgrounds/styles from competing elements (e.g., remove a sidebar's background color so it doesn't compete with the main content).
- Labels are a last resort — combine labels and values when possible ("12 left in stock" not "In stock: 12"). When labels are necessary, de-emphasize them (smaller, lighter, thinner). Exception: on info-dense spec pages where users scan for labels, emphasize the label and lighten the value.
- Separate visual hierarchy from document hierarchy — an `h1` doesn't need to be the biggest visual element. Section titles often act as labels and should be small. Style based on hierarchy role, not HTML tag.
- Balance weight and contrast — icons are visually "heavy" (high surface area), so give them a softer color to balance with adjacent text. Thin borders that are too subtle should be made wider (2px), not darker.
- Semantics are secondary — primary actions: solid high-contrast backgrounds. Secondary: outline or lower contrast. Tertiary: styled like links. Destructive actions aren't always big and red — use secondary treatment with a confirmation step where it becomes primary.
- Don't use grey text on colored backgrounds — hand-pick a same-hue color with adjusted saturation/lightness. Never use `opacity` or `rgba(255,255,255,0.5)` — it looks washed out and lets the background bleed through on images/patterns.

## Spacing & Layout

- Start with too much white space, then remove until satisfied. Not the other way around. Dense UIs (dashboards, data tables) are a deliberate exception where tighter spacing is correct.
- Concrete spacing scale with ~25% jumps: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256. Base on 16px (divides nicely, matches default browser font size). No linear scales, no arbitrary values.
- Don't fill the whole screen — give elements the space they need, no more. When a narrow component feels unbalanced in wide space, split into columns (form + supporting text) rather than stretching the component.
- Grids are overrated — sidebars should be fixed-width (e.g., 240-320px) with the main content flexing. Use `width: 240px` + `flex: 1`, never `grid-template-columns: 1fr 3fr`.
- Use `max-width` for centering contained components (cards, modals, login forms). Only shrink when viewport is smaller. Don't use percentage-based widths or grid columns — they make components different sizes at different breakpoints instead of maintaining their ideal width.
- Relative sizing doesn't scale — large elements shrink faster than small ones at smaller viewports. Don't use proportional relationships.
- Button padding doesn't scale proportionally — large buttons need disproportionately more padding, small buttons need less. Specify padding per size variant (e.g., `8px 16px` sm, `12px 24px` md, `16px 32px` lg), never use `em` for button padding.
- Avoid ambiguous spacing — related elements must be closer together than unrelated elements. Always. Applies to form labels/inputs, section headings, list items, horizontal layouts.

## Typography

- Hand-crafted type scale, not modular ratios. Practical jumps, no fractional pixels.
- Use px or rem, not em — em nesting breaks the system.
- Fonts with 5+ weights tend to be higher quality. Filter for 10+ styles on Google Fonts. Avoid condensed or short x-height fonts for body text — optimize for legibility at small sizes. Headline/display fonts don't work at small sizes even with increased letter-spacing — don't repurpose them.
- Font discovery: sort by popularity on font directories to narrow choices; inspect CSS of well-designed sites to find proven typefaces.
- System font stack as a safe default: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif`.
- Line length: 45-75 characters. Use `max-width` in em units (20-35em) on text containers. Constrain paragraph width independently — if a content area has full-width images, apply `max-width` to `<p>` elements specifically.
- Line height proportional to both font size AND line length: taller for small text (1.5-1.75), tighter for large display text (1.0-1.2). Wide content (35em+) may need line-height up to 2.0. Narrow columns can use tighter values.
- Tighten letter-spacing on headlines. Widen on all-caps text.
- Baseline-align mixed font sizes, don't center-align them.
- Center-align only for very short text (2-3 lines max). If centered text is too long, rewrite it shorter or left-align it. Body copy should always be left-aligned.
- Right-align numbers in tables — makes decimal comparison easier at a glance.
- Not every link needs a color — in link-heavy interfaces (nav lists, sidebars, settings), use heavier font weight or darker color instead. Ancillary links: show underline/color on hover only.
- Hyphenate justified text — if using `text-align: justify`, always add `hyphens: auto`.

### Modern CSS Typography

- `text-wrap: balance` on headings — equalizes line lengths so you don't get one-word orphan lines. Use on all `h1`–`h4` and short display text.
- `text-wrap: pretty` on body text — prevents orphans (single words on the last line of a paragraph). Apply broadly to `p`, `li`, `blockquote`.
- Use `ch` units for line-length constraints — `max-width: 65ch` is more precise than `em` because it measures actual character width. Prefer over `em` for text containers.
- `font-variant-numeric: tabular-nums` for numbers in tables, stats, and anywhere numbers need to align vertically. `oldstyle-nums` for numbers within body prose.
- `font-optical-sizing: auto` — lets variable fonts adjust glyph shapes for the rendered size (thinner strokes at display sizes, sturdier at body). Enable by default on variable fonts.
- `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility` — crisper text on macOS. Apply to `body`.
- `hanging-punctuation: first` — optically aligns opening quotes and bullets at the left margin edge. Use on blockquotes and pull quotes.
- `font-display: swap` on `@font-face` rules — shows fallback text immediately, swaps in the web font when loaded. Prevents invisible text during loading.
- `clamp()` for fluid type sizing — `font-size: clamp(1rem, 0.5rem + 2vw, 2rem)` scales smoothly between breakpoints without media queries. Use for hero headlines and display text; keep body text at fixed sizes for consistency.

## Color

- Use HSL, not hex or RGB — human-perceivable attributes. Warning: design tools (Figma, Sketch) use HSB, not HSL. The values are NOT interchangeable — lightness in HSL ≠ brightness in HSB. Always convert to HSL for CSS.
- True black looks unnatural — always use near-black (e.g., `hsl(220, 13%, 10%)`), never `#000` or `rgb(0,0,0)` for text or backgrounds.
- You need more colors than you think: 8-10 greys, 5-10 shades per primary/accent, plus semantic colors (yellow for warnings, red for errors/destructive, green for success, plus highlight colors for badges).
- Nine shades per color (100-900): base at 500 (must work as button background with white text), darkest at 900 (for text), lightest at 100 (for tinted backgrounds like alerts). Fill: 700/300 first, then 800/600/400/200.
- Increase saturation as lightness moves away from 50% to prevent washed-out shades.
- Rotate hue toward bright hues (60/180/300) to lighten, toward dark hues (0/120/240) to darken — preserves saturation. Max 20-30 degree rotation. Why these numbers: perceived brightness has three peaks (yellow 60, cyan 180, magenta 300) and three valleys (red 0, green 120, blue 240). Rotating toward a peak brightens; toward a valley darkens.
- Greys don't have to be grey — saturate with blue for cool, yellow/orange for warm. Increase saturation for lighter/darker shades to maintain temperature. Build grey scale from endpoints: darkest = your darkest text color, lightest = a subtle off-white background.
- Accessible doesn't mean ugly — flip contrast (dark text on light tinted background). For colored text on colored backgrounds, rotate hue toward cyan/magenta/yellow to increase contrast while staying colorful, instead of approaching white.
- Don't rely on color alone — always provide a secondary indicator (icon, text, contrast). For charts, use light vs dark shades of one hue rather than distinct colors (more accessible for colorblind users).
- Never use CSS `lighten()`/`darken()` or `color-mix()` — these generate arbitrary shades outside your palette. Always use explicit predefined shade values.

## Depth

- Shadows, flat-color depth, solid shadows, and overlapping are complementary depth tools — use them together, but keep the application consistent (e.g., don't mix soft diffuse shadows with solid flat shadows on similar elements).
- Emulate a light source from above. Raised elements: lighter top edge (`inset box-shadow` or `border-top` with lighter shade) + dark, sharp-edged shadow below (low blur radius — a couple of pixels). Hand-pick the lighter color — don't use semi-transparent white (`rgba(255,255,255,0.1)` sucks saturation from colored surfaces). Keep it subtle — borrow cues from the real world, but don't aim for photo-realism.
- Inset/recessed elements: dark `inset box-shadow` at top (positive y-offset) + lighter bottom edge. Use for wells, text inputs, checkboxes.
- Shadows: use two-part shadows (one larger/softer for direct light, one tighter/darker for ambient occlusion). At higher elevations, the ambient (tight) shadow fades away.
- Define a shadow scale — five levels is usually enough (sm, md, lg, xl, 2xl). Start by defining the smallest and largest, then fill the middle linearly. Smaller = slightly raised (buttons), medium = dropdowns, large = modals.
- Shadow interaction states: hover = increase shadow (element lifts), active/click = decrease or remove shadow (element presses). Exception: drag-and-drop — shadow *increases* on click to lift the item above its peers for dragging. Always transition shadow size on interactive elements.
- Flat designs can have depth: lighter = closer, darker = recessed. Solid shadows (no blur) for flat aesthetic.
- Overlap elements to create layers — offset cards across background transitions, make elements taller than parents. For overlapping images, use a border matching the background color (`border: 3px solid white`) to create separation, not `gap` or `margin`.

## Images & Icons

- Use good photos. Unsplash or professional photographer. No smartphone photos.
- Text on images — four techniques:
  - **Overlay**: semi-transparent black (for light text) or white (for dark text) behind text area.
  - **Lower contrast + adjust brightness**: flatten the image, compensate with brightness so it doesn't go muddy.
  - **Colorize**: lower contrast + desaturate + solid fill with `mix-blend-mode: multiply`.
  - **Text shadow**: large blur radius, NO offset — `text-shadow: 0 0 20px rgba(0,0,0,0.5)`. Not a traditional directional shadow. Works best combined with reduced image contrast (additive technique, not standalone).
- Don't scale icons up beyond intended size. Enclose small icons in shapes with background colors.
- Don't scale icons down either — favicons and small contexts need purpose-redrawn simplified versions.
- Don't scale screenshots down too far. Use tablet-layout screenshots, partial screenshots, or simplified UI illustrations.
- User-uploaded images: fix aspect ratio with `object-fit: cover` in fixed containers. Prevent background bleed with subtle `inset box-shadow` or semi-transparent inner border (`border: 1px solid rgba(0,0,0,0.1)`), NOT a regular solid border (clashes with image colors).

## Finishing Touches

- Supercharge defaults: replace bullets with icons, promote quotes into visual elements (large colored quotation marks), style links with custom underlines, style checkboxes/radio buttons with brand colors on `:checked`.
- Add color with accent borders: top of cards, active nav items, side of alerts, under headlines, top of entire layout.
- Decorate backgrounds: alternate section colors, subtle gradients (hues within 30 degrees max — wider looks garish), repeating patterns at very low contrast (opacity 0.05-0.1), simple geometric shapes (circles, dots, diagonal lines) positioned in corners.
- Patterns don't have to tile the full background — running along just one edge (top, bottom) of a section is more subtle.
- Use fewer borders: try box shadows (works best when element color differs from background), different background colors, or extra spacing instead.
- Empty states matter: use illustrations, emphasize CTAs, and **hide supporting UI** (tabs, filters, sort controls) entirely when there's no content to operate on. Don't show a fully-rendered shell around emptiness.
- Think outside the box: dropdowns can have sections, columns, icons, and supporting text. Tables can combine columns into rich cells with images and color. Radio buttons can be selectable cards.
