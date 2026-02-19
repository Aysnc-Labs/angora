# Design Principles Reference

Principles that inform the audit and all design decisions.

## Core Philosophy

**Pillar 1 — Systematic Constraints:**
- Define all design tokens upfront: spacing, type scale, color shades, shadows, radii
- Never pick arbitrary values — choose from constrained sets
- Design by elimination: pick a value from your scale, try its neighbors, eliminate obviously wrong ones
- Systematize: font size, font weight, line-height, color, margin, padding, width, height, box shadows, border-radius, border-width, and opacity — every value from a predefined scale
- If you're making the same token decision twice during init, you need a system. During component work, follow existing tokens — don't extract new abstractions

**Pillar 2 — Intentional Design:**
- Personality defaults are the enemy — if another LLM would produce the same color palette, type pairing, or visual character, you failed. This applies to personality tokens (color, font, radius, shadow character, grey temperature), NOT to interaction patterns, layout conventions, or structural tokens — a nav bar should still look like a nav bar
- Every personality choice needs a "why" — if the answer is "it's common" or "it's clean," you defaulted
- Domain exploration before any visual work
- The swap test: if you could swap a personality choice for the most common alternative and the design wouldn't feel different, you defaulted. Apply to personality tokens — never to structural tokens (spacing scale, type scale, breakpoints)
- When to run it: during init, on the personality layer as a whole, not just individual values. During component work, on the component's visual treatment — could this hero/pricing table/card be dropped into a generic SaaS template without looking out of place? If yes, it's not pulling enough from the design personality
- Never converge on common personality defaults across projects — if two different projects end up with similar color palettes, type pairings, and visual character, something went wrong. Each design system must feel genuinely tailored to its domain, audience, and personality

**The Fusion:** Intentional constraints. Structural tokens (spacing scale, type scale, breakpoints) can be locked in without personality context — these are universal. Personality tokens (color palette, font, border radius, shadow depth, grey temperature) require domain exploration first — these ARE the personality.

**Scope discipline:** Don't design for content that doesn't exist. If there are 3 testimonials, don't build a carousel. If search isn't built, don't show a search bar. Match the design to the actual content and functionality available.

## Personality

- Border-radius is a personality lever — `0` = formal, `4-6px` = neutral, `12px+` = playful. Must be consistent across the entire interface.
- Font choice signals personality — serif = elegant/classic, rounded sans-serif = playful, neutral sans-serif = professional.
- Language/tone is a design decision — "Account Settings" vs "Hey, let's set things up!" conveys different personalities.
- Spatial composition should match personality. Choose between generous negative space and controlled density deliberately. Techniques available when the personality calls for it: asymmetry, overlap, diagonal flow, elements that break the grid. Symmetry is safe but forgettable; use these sparingly and only when the project's feel justifies them.

## Hierarchy

- Build hierarchy through size, weight, and spacing. Color reinforces hierarchy but must not be load-bearing — if you remove all color and the hierarchy collapses, the structure is wrong.
- Not all elements are equal. Deliberately de-emphasize secondary and tertiary information.
- Three-tier text color system: dark for primary content, medium grey for secondary, light grey for tertiary. Use exactly three tiers, not arbitrary greys.
- Only two font weights for UI: normal (400 or 500) and bold (600 or 700). Never use weights under 400 — use lighter color or smaller size instead.
- Emphasize by de-emphasizing: make everything around the focal point quieter. Sometimes the best way to make something stand out is to remove backgrounds/styles from competing elements (e.g., remove a sidebar's background color so it doesn't compete with the main content).
- Labels are a last resort — combine labels and values when possible ("12 left in stock" not "In stock: 12"). When labels are necessary, de-emphasize them (smaller, lighter, thinner). Exception: on info-dense spec pages where users scan for labels, emphasize the label and lighten the value.
- Separate visual hierarchy from document hierarchy — an `h1` doesn't need to be the biggest visual element. Section titles often act as labels and should be small. Style based on hierarchy role, not HTML tag.
- Balance weight and contrast — icons are visually "heavy" (high surface area), so give them a softer color to balance with adjacent text. Thin borders that are too subtle should be made wider (2px), not darker.
- Semantics are secondary — primary actions: solid high-contrast backgrounds. Secondary: outline or lower contrast. Tertiary: styled like links. Destructive actions aren't always big and red — use secondary treatment with a confirmation step where it becomes primary.
- Don't use grey text on colored backgrounds — hand-pick a same-hue color with adjusted chroma/lightness. Never use `opacity` or `rgba(255,255,255,0.5)` — it looks washed out and lets the background bleed through on images/patterns. For colored text on colored backgrounds, rotate hue toward cyan/magenta/yellow to increase contrast while staying colorful, instead of approaching white.

## Spacing & Layout

- Err on the side of generous whitespace. Dense UIs (dashboards, data tables) are a deliberate exception where tighter spacing is correct.
- Concrete spacing scale with ~25% jumps, base on 16px. No linear scales, no arbitrary values. Actual values live in `global.css`.
- Don't fill the whole screen — give elements the space they need, no more. When a narrow component feels unbalanced in wide space, split into columns (form + supporting text) rather than stretching the component.
- Don't use proportional grids for sidebar/content layouts — sidebars should be fixed-width (e.g., 240-320px) with the main content flexing. Use `width: 240px` + `flex: 1`, never `grid-template-columns: 1fr 3fr`. CSS Grid is fine for actual grid layouts (feature cards, pricing columns).
- Use `max-width` for centering contained components (cards, modals, login forms). Only shrink when viewport is smaller. Don't use percentage-based widths or grid columns — they make components different sizes at different breakpoints instead of maintaining their ideal width.
- Relative sizing doesn't scale — large elements shrink faster than small ones at smaller viewports. Don't use proportional relationships.
- Button padding doesn't scale proportionally — large buttons need disproportionately more padding, small buttons need less. Specify padding per size variant (e.g., `8px 16px` sm, `12px 24px` md, `16px 32px` lg), never use `em` for button padding.
- Avoid ambiguous spacing — related elements must be closer together than unrelated elements. Always. Applies to form labels/inputs, section headings, list items, horizontal layouts.

## Typography

- Hand-crafted type scale, not modular ratios. Practical jumps, no fractional pixels.
- Use px or rem, not em — em nesting breaks the system.
- Prefer fonts with 5+ weights (10+ styles on Google Fonts). Avoid condensed or short x-height fonts for body text. Headline/display fonts don't work at small sizes even with increased letter-spacing — don't repurpose them.
- System font stack fallback: `-apple-system, Segoe UI, Roboto, Noto Sans, Ubuntu, Cantarell, Helvetica Neue, sans-serif`.
- Line length: 45–75 characters. Use `max-width` in `ch` units (e.g., `max-width: 65ch`) on text containers. Constrain paragraph width independently if a content area has full-width elements.
- Line height proportional to both font size AND line length: 1.5–1.75 for body text, 1.0–1.2 for display/heading text. Wide content (35em+) may need up to 2.0. Narrow columns can use tighter values.
- Tighten letter-spacing on headlines. Widen on all-caps text.
- Baseline-align mixed font sizes, don't center-align them.
- Center-align only for very short text (2–3 lines max). If centered text is too long, rewrite it shorter or left-align it. Body copy should always be left-aligned.
- Right-align numbers in tables.
- Not every link needs a color — in link-heavy interfaces (nav lists, sidebars, settings), use heavier font weight or darker color instead. Show underline/color on hover only for ancillary links.
- Hyphenate justified text — `text-align: justify` always needs `hyphens: auto`.

### Modern CSS Typography

- `text-wrap: balance` on headings (`h1`–`h4` and short display text)
- `text-wrap: pretty` on body text (`p`, `li`, `blockquote`)
- `font-variant-numeric: tabular-nums` for numbers in tables, stats, and vertical alignment. `oldstyle-nums` for numbers within body prose
- `font-optical-sizing: auto` on variable fonts
- `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility` on `body`
- `hanging-punctuation: first` on blockquotes and pull quotes
- `font-display: swap` on `@font-face` rules
- `clamp()` for fluid type on hero headlines and display text; keep body text at fixed sizes

## Color

- Use OKLCH. Constrain to: L = 0–1, C = 0–0.4, H = 0–360.
- True black looks unnatural — always use near-black (e.g., `oklch(0.16 0.014 264)`), never `#000` or `rgb(0,0,0)`. In dark mode, background around L=0.15. Pure black causes halation — white text glows/bleeds for people with astigmatism (30–60% of population).
- You need more colors than you think: 8–10 greys, 5–10 shades per primary/accent, plus semantic colors (yellow for warnings, red for errors/destructive, green for success, plus highlight colors for badges).
- Nine shades per color (100–900): base at 500 (must work as button background with white text), darkest at 900 (for text), lightest at 100 (for tinted backgrounds like alerts). Fill: 700/300 first, then 800/600/400/200.
- Increase saturation (chroma) as lightness moves away from the midpoint to prevent washed-out shades.
- Rotate hue toward bright hues (60°/180°/300°) to lighten, toward dark hues (0°/120°/240°) to darken. Max 20–30° rotation.
- Greys don't have to be grey — add chroma with a blue hue for cool, yellow/orange hue for warm. Increase chroma for lighter/darker shades to maintain temperature. Build grey scale from endpoints: darkest = your darkest text color, lightest = a subtle off-white background.
- Don't rely on color alone — always provide a secondary indicator (icon, text, contrast). For charts, use light vs dark shades of one hue rather than distinct colors (more accessible for colorblind users).
- Never use CSS `lighten()`/`darken()` or `color-mix()` — these generate arbitrary shades outside your palette. Always use explicit predefined shade values.
- **Semantic token layer:** Raw palette values (gray-50 through gray-950, primary-50 through primary-950) are defined as CSS custom properties outside `@theme`. Semantic role-based tokens (`--color-background`, `--color-foreground`, `--color-card`, etc.) are defined inside `@theme` and reference the primitives. Only semantic tokens generate Tailwind utility classes — components use `bg-card`, `text-foreground`, `border-border`, never `bg-gray-50` or `text-gray-900`. This is structural enforcement: incorrect usage is impossible because the raw palette utilities don't exist.

## Depth

- Shadows, flat-color depth, solid shadows, and overlapping are complementary depth tools — use them together, but keep the application consistent (e.g., don't mix soft diffuse shadows with solid flat shadows on similar elements).
- Emulate a light source from above. Raised elements: lighter top edge (`inset box-shadow` or `border-top` with lighter shade) + dark, sharp-edged shadow below (low blur radius). Hand-pick the lighter color — don't use semi-transparent white (`rgba(255,255,255,0.1)` drains chroma from colored surfaces). Keep it subtle.
- Inset/recessed elements: dark `inset box-shadow` at top (positive y-offset) + lighter bottom edge. Use for wells, text inputs, checkboxes.
- Two-part shadows: one larger/softer for direct light, one tighter/darker for ambient occlusion. At higher elevations, the ambient (tight) shadow fades away.
- Five-level shadow scale (sm, md, lg, xl, 2xl). Start by defining the smallest and largest, then fill the middle linearly. Smaller = slightly raised (buttons), medium = dropdowns, large = modals.
- Shadow interaction states: hover = increase shadow (lift), active = decrease shadow (press). Exception: drag-and-drop — shadow *increases* on click to lift the item above peers. Always transition shadow on interactive elements.
- Flat designs can have depth: lighter = closer, darker = recessed. Solid shadows (no blur) for flat aesthetic.
- Overlap elements to create layers — offset cards across background transitions, make elements taller than parents. For overlapping images, use a border matching the background color for separation, not `gap` or `margin`.

## Dark Mode

### Color

- Dark mode is a first-class theme, not an inversion. Every color decision must be deliberate for both modes. Never algorithmically invert.
- Desaturate accent colors — reduce chroma for dark surfaces. Saturated colors cause visual vibration. Maintain brand hue; shift lightness and chroma only.
- Pair every background with a guaranteed-contrast foreground. The `--color-*` / `--color-*-foreground` convention enforces this structurally. When you define `--color-primary`, you must define `--color-primary-foreground`.
- Meet WCAG AA in both modes independently. 4.5:1 for normal text, 3:1 for large text and non-text elements, in both modes.

### Elevation

- Replace shadows with tonal elevation. Higher surfaces are lighter; lower surfaces are darker.
- If shadows must exist, the background must be light enough (dark gray, not black) to provide contrast. Shadow tokens use increased opacity in dark mode (e.g., 0.08 → 0.25).

### Images & Media

- Photographs: dim slightly — `filter: brightness(0.8) contrast(1.25)` via `.dark` class. (1.25 matches Tailwind's `contrast-125` utility.)
- Logos & illustrations: use `<picture>` with `prefers-color-scheme` media query for alternate assets. Or ensure transparent backgrounds.
- Avoid baked-in white backgrounds — they become glowing rectangles in dark mode.

### Transitions

- Transition `background-color` and `color` (200–500ms), not the entire page.
- Respect `prefers-reduced-motion`.
- Set `color-scheme` in CSS — both as CSS property on `html` and `<meta name="color-scheme">` in `<head>`.

## Images & Icons

- Text on images — four techniques:
  - **Overlay**: semi-transparent black (for light text) or white (for dark text) behind text area.
  - **Lower contrast + adjust brightness**: flatten the image, compensate with brightness so it doesn't go muddy.
  - **Colorize**: lower contrast + desaturate + solid fill with `mix-blend-mode: multiply`.
  - **Text shadow**: large blur radius, NO offset — `text-shadow: 0 0 20px rgba(0,0,0,0.5)`. Works best combined with reduced image contrast (additive technique, not standalone).
- Don't scale icons up beyond intended size. Enclose small icons in shapes with background colors.
- Don't scale icons down either — small contexts need purpose-redrawn simplified versions.
- Don't scale screenshots down too far. Use tablet-layout screenshots, partial screenshots, or simplified UI illustrations.
- User-uploaded images: fix aspect ratio with `object-fit: cover` in fixed containers. Prevent background bleed with subtle `inset box-shadow` or semi-transparent inner border (`border: 1px solid rgba(0,0,0,0.1)`), NOT a regular solid border (clashes with image colors).

## Finishing Touches

These are options to consider where they'd elevate the work — not a checklist to apply everywhere. Most pages should have one or two; most individual components need none.

- **Upgraded defaults** (consider per-component): replace bullets with icons, promote quotes into visual elements, style links with custom underlines, style checkboxes/radio buttons with brand colors on `:checked`.
- **Accent borders** (consider per-component): top of cards, active nav items, side of alerts, under headlines, top of entire layout.
- **Background decoration** (consider per-section): alternate section colors, subtle gradients (hues within 30° max), repeating patterns at very low contrast (opacity 0.05–0.1), simple geometric shapes in corners. Advanced: gradient meshes, noise/grain textures (opacity 0.03–0.08).
- Patterns don't have to tile the full background — running along one edge is more subtle.
- Use fewer borders: try box shadows, different background colors, or extra spacing instead.
- Empty states matter: use illustrations, emphasize CTAs, and **hide supporting UI** (tabs, filters, sort controls) entirely when there's no content to operate on.
- **Richer patterns** (consider when a component feels too simple for its importance): dropdowns can have sections, columns, icons, and supporting text. Tables can combine columns into rich cells. Radio buttons can be selectable cards. Don't apply these by default — use them when the standard version undersells the content.
