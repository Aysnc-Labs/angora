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