# Design Principles Reference

Principles that inform the audit and all design decisions.

## Core Philosophy

**Pillar 1 — Systematic Constraints:**
- Define all design tokens upfront: spacing, type scale, color shades, shadows, radii
- Never pick arbitrary values — choose from constrained sets
- Design by elimination, not imagination
- If you're making the same decision twice, you need a system

**Pillar 2 — Intentional Design:**
- Defaults are the enemy — if another AI would produce the same output, you failed
- Every choice needs a "why" — if the answer is "it's common" or "it's clean," you defaulted
- Domain exploration before any visual work
- The swap test: if you could swap a choice for the most common alternative and the design wouldn't feel different, you defaulted

**The Fusion:** Intentional constraints. Structural tokens (spacing scale, type scale, breakpoints) can be locked in without personality context — these are universal. Personality tokens (color palette, font, border radius, shadow depth, grey temperature) require domain exploration first — these ARE the personality.

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
- Never converge on common defaults across projects — if two different projects end up looking similar, something went wrong. Each design system must feel genuinely tailored to its domain, audience, and personality. Run the swap test on the whole system, not just individual choices.

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
- Spatial composition is a design tool — asymmetry, overlap, diagonal flow, grid-breaking elements, generous negative space OR controlled density. Choose deliberately based on personality. Symmetry is safe but forgettable; asymmetry creates energy and memorability when the project calls for it.

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

- `text-wrap: balance` on headings — equalizes line lengths so you don't get one-word orphan lines. Use on all `h1`-`h4` and short display text.
- `text-wrap: pretty` on body text — prevents orphans (single words on the last line of a paragraph). Apply broadly to `p`, `li`, `blockquote`.
- Use `ch` units for line-length constraints — `max-width: 65ch` is more precise than `em` because it measures actual character width. Prefer over `em` for text containers.
- `font-variant-numeric: tabular-nums` for numbers in tables, stats, and anywhere numbers need to align vertically. `oldstyle-nums` for numbers within body prose.
- `font-optical-sizing: auto` — lets variable fonts adjust glyph shapes for the rendered size (thinner strokes at display sizes, sturdier at body). Enable by default on variable fonts.
- `-webkit-font-smoothing: antialiased` + `text-rendering: optimizeLegibility` — crisper text on macOS. Apply to `body`.
- `hanging-punctuation: first` — optically aligns opening quotes and bullets at the left margin edge. Use on blockquotes and pull quotes.
- `font-display: swap` on `@font-face` rules — shows fallback text immediately, swaps in the web font when loaded. Prevents invisible text during loading.
- `clamp()` for fluid type sizing — `font-size: clamp(1rem, 0.5rem + 2vw, 2rem)` scales smoothly between breakpoints without media queries. Use for hero headlines and display text; keep body text at fixed sizes for consistency.

## Color

- Use OKLCH, not hex or RGB — perceptually uniform lightness means L=0.5 looks equally bright regardless of hue, so palette generation is predictable. `oklch(L C H)` where L = lightness (0–1), C = chroma (0–0.4), H = hue angle (0–360). HSL is acceptable but inferior — equal HSL lightness values look different across hues. Warning: design tools (Figma, Sketch) use HSB/HSV, not HSL or OKLCH. Always convert for CSS.
- True black looks unnatural — always use near-black (e.g., `oklch(0.16 0.014 264)` / `hsl(220, 13%, 10%)`), never `#000` or `rgb(0,0,0)` for text or backgrounds.
- You need more colors than you think: 8-10 greys, 5-10 shades per primary/accent, plus semantic colors (yellow for warnings, red for errors/destructive, green for success, plus highlight colors for badges).
- Nine shades per color (100-900): base at 500 (must work as button background with white text), darkest at 900 (for text), lightest at 100 (for tinted backgrounds like alerts). Fill: 700/300 first, then 800/600/400/200.
- Increase saturation (chroma in OKLCH) as lightness moves away from the midpoint to prevent washed-out shades.
- Rotate hue toward bright hues (60/180/300) to lighten, toward dark hues (0/120/240) to darken — preserves saturation. Max 20-30 degree rotation. Why these numbers: perceived brightness has three peaks (yellow 60, cyan 180, magenta 300) and three valleys (red 0, green 120, blue 240). Rotating toward a peak brightens; toward a valley darkens.
- Greys don't have to be grey — saturate with blue for cool, yellow/orange for warm. Increase saturation for lighter/darker shades to maintain temperature. Build grey scale from endpoints: darkest = your darkest text color, lightest = a subtle off-white background.
- Accessible doesn't mean ugly — flip contrast (dark text on light tinted background). For colored text on colored backgrounds, rotate hue toward cyan/magenta/yellow to increase contrast while staying colorful, instead of approaching white.
- Don't rely on color alone — always provide a secondary indicator (icon, text, contrast). For charts, use light vs dark shades of one hue rather than distinct colors (more accessible for colorblind users).
- Never use CSS `lighten()`/`darken()` or `color-mix()` — these generate arbitrary shades outside your palette. Always use explicit predefined shade values.
- **Semantic token layer:** Raw palette values (gray-50 through gray-950, primary-50 through primary-950) are defined as CSS custom properties outside `@theme`. Semantic role-based tokens (`--color-background`, `--color-foreground`, `--color-card`, etc.) are defined inside `@theme` and reference the primitives. Only semantic tokens generate Tailwind utility classes — components use `bg-card`, `text-foreground`, `border-border`, never `bg-gray-50` or `text-gray-900`. This is structural enforcement: incorrect usage is impossible because the raw palette utilities don't exist.

## Depth

- Shadows, flat-color depth, solid shadows, and overlapping are complementary depth tools — use them together, but keep the application consistent (e.g., don't mix soft diffuse shadows with solid flat shadows on similar elements).
- Emulate a light source from above. Raised elements: lighter top edge (`inset box-shadow` or `border-top` with lighter shade) + dark, sharp-edged shadow below (low blur radius — a couple of pixels). Hand-pick the lighter color — don't use semi-transparent white (`rgba(255,255,255,0.1)` sucks saturation from colored surfaces). Keep it subtle — borrow cues from the real world, but don't aim for photo-realism.
- Inset/recessed elements: dark `inset box-shadow` at top (positive y-offset) + lighter bottom edge. Use for wells, text inputs, checkboxes.
- Shadows: use two-part shadows (one larger/softer for direct light, one tighter/darker for ambient occlusion). At higher elevations, the ambient (tight) shadow fades away.
- Define a shadow scale — five levels is usually enough (sm, md, lg, xl, 2xl). Start by defining the smallest and largest, then fill the middle linearly. Smaller = slightly raised (buttons), medium = dropdowns, large = modals.
- Shadow interaction states: hover = increase shadow (element lifts), active/click = decrease or remove shadow (element presses). Exception: drag-and-drop — shadow *increases* on click to lift the item above its peers for dragging. Always transition shadow size on interactive elements.
- Flat designs can have depth: lighter = closer, darker = recessed. Solid shadows (no blur) for flat aesthetic.
- Overlap elements to create layers — offset cards across background transitions, make elements taller than parents. For overlapping images, use a border matching the background color (`border: 3px solid white`) to create separation, not `gap` or `margin`.

## Dark Mode

### Color

- **Dark mode is a first-class theme, not an inversion.** Every color and elevation decision must be deliberate for both modes. Never algorithmically invert.
- **Use dark gray, never pure black.** Background around OKLCH L=0.15. Pure black causes halation — white text glows/bleeds for people with astigmatism (30-60% of population).
- **Desaturate accent colors.** Reduce chroma for colors on dark surfaces. Saturated colors cause visual vibration — an optical shimmer that strains eyes. Maintain brand hue; shift lightness and chroma only.
- **Pair every background with a guaranteed-contrast foreground.** The `--color-*` / `--color-*-foreground` convention enforces this structurally. When you define `--color-primary`, you must define `--color-primary-foreground`.
- **Meet WCAG AA in both modes independently.** Dark mode does not get a pass. 4.5:1 for normal text, 3:1 for large text and non-text elements, in both modes.

### Elevation

- **Replace shadows with tonal elevation.** Higher surfaces are lighter; lower surfaces are darker. Shadows vanish against dark backgrounds — use surface lightness to convey depth instead.
- **Material approach:** Semi-transparent white overlay on base surface, opacity increasing with elevation (0% at base, ~16% at highest). Material 3 uses primary-tinted overlay for brand warmth.
- **Apple approach:** Binary system — "base" (dimmer) and "elevated" (brighter). Simpler than Material's continuous gradient.
- **If shadows must exist**, the background must be light enough (dark gray, not black) to provide contrast. Shadow tokens use increased opacity in dark mode (e.g., 0.08 → 0.25 for main shadow).

### Images & Media

- **Photographs:** Dim slightly — `filter: brightness(0.8) contrast(1.2)` via `.dark` class. Prevents bright images from being jarring against dark surfaces.
- **Logos & illustrations:** Use `<picture>` with `prefers-color-scheme` media query for alternate assets. Or ensure transparent backgrounds.
- **Avoid baked-in white backgrounds.** They become glowing rectangles in dark mode. Prefer transparent or neutral backgrounds.

### Transitions

- **Transition color properties**, not the entire page. 200-500ms on `background-color` and `color`.
- **Respect `prefers-reduced-motion`.** No transition animation for users who requested reduced motion.
- **Set `color-scheme` in CSS.** This single declaration fixes scrollbars, form controls, and browser-native UI. Both as CSS property on `html` and `<meta name="color-scheme">` in `<head>`.

### Anti-Aliasing

- **Light text on dark backgrounds** can show halo effects from sub-pixel rendering. Mitigated by `-webkit-font-smoothing: antialiased` (set globally), but be aware during testing — check both modes.

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
- Decorate backgrounds: alternate section colors, subtle gradients (hues within 30 degrees max — wider looks garish), repeating patterns at very low contrast (opacity 0.05-0.1), simple geometric shapes (circles, dots, diagonal lines) positioned in corners. Advanced techniques: gradient meshes for organic color blends, noise/grain textures (`filter: url(#noise)` SVG or CSS `background-image` with tiny repeated noise tile), layered transparencies for depth, dramatic shadows on floating elements, and grain overlays at low opacity (0.03-0.08) to add tactile warmth to flat surfaces.
- Patterns don't have to tile the full background — running along just one edge (top, bottom) of a section is more subtle.
- Use fewer borders: try box shadows (works best when element color differs from background), different background colors, or extra spacing instead.
- Empty states matter: use illustrations, emphasize CTAs, and **hide supporting UI** (tabs, filters, sort controls) entirely when there's no content to operate on. Don't show a fully-rendered shell around emptiness.
- Think outside the box: dropdowns can have sections, columns, icons, and supporting text. Tables can combine columns into rich cells with images and color. Radio buttons can be selectable cards.