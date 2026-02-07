# designing-with-markup

A **design deliverable** — not a code deliverable. This replaces Figma + design tokens as the source of truth for engineering teams. HTML + CSS is the design medium. The gallery is the spec; the tokens are the annotations; the rendered components are the acceptance test.

Engineering teams consume this the way they'd consume a Figma file: open the gallery, inspect the component, translate it into their framework (React + Tailwind, Vue + UnoCSS, Svelte, whatever). Nobody ships this HTML to production — they ship their framework's version, validated against this gallery.

**Scope:** Marketing sites — heroes, pricing, features, testimonials, CTAs, navigation, footers. Not app UI, not dashboards.

## Core Philosophy

### Two Pillars

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

### The Fusion

**Intentional constraints.** Structural tokens (spacing scale, type scale, breakpoints) can be locked in without personality context — these are universal. Personality tokens (color palette, font, border radius, shadow depth, grey temperature) require domain exploration first — these ARE the personality.

## Build Layer

**Astro** is the build tool. It produces static HTML+CSS — no client-side JavaScript. **Tailwind CSS v4** is the styling layer, integrated via `@tailwindcss/vite`. Design tokens are defined in `src/styles/global.css` using Tailwind's `@theme` directive — this is the single source of truth for all design values.

- Astro components render semantic HTML with Tailwind utility classes. No custom elements, no `@scope` CSS.
- Component props (`variant`, `size`, `disabled`) resolve to Tailwind class strings at build time. No client-side JavaScript.
- Components are always interactive — they include Tailwind pseudo-class variants (`hover:`, `active:`, `focus-visible:`) and transition utilities. No frozen "specimen mode" for interaction states.
- Form components use a `state` prop for states that can't be triggered by gallery interaction (e.g., `error`, `success`, `disabled`, `dragover`). These render the visual state statically with a `data-state` attribute for engineer reference.
- Astro component names don't need a prefix (just `Button.astro`, not `SiteButton.astro`).
- Icon components live in `src/components/icons/` and drop the `Icon` prefix — the directory provides context (e.g., `icons/ArrowRight.astro`, imported as `import ArrowRight from '../components/icons/ArrowRight.astro'`).

## File Structure

- `system.md` — The "why" file. Intent, accessibility standard, anti-patterns, and decisions log. No token values (that's `global.css`) and no component patterns (that's the components). **Read before building or reviewing a component (Phase 3, Phase 4). Not needed for edits to existing components or page assembly.**
- `global.css` — `@import "tailwindcss"` + `@theme` block with all design tokens. Single source of truth.
- `reset.css` — Font smoothing extras. Tailwind's preflight handles box-sizing and margin resets.
- `gallery.css` — Gallery chrome: fixed left sidebar nav (scrollable, 240px), specimen rows, labels, demo areas. This is tooling — it doesn't ship to production.
- `GalleryLayout.astro` — Imports global.css, reset.css, and gallery.css. Renders sidebar nav + `<main>` with `<slot />`. Accepts `fullscreenHref` prop to show a "View full screen" link. The sidebar nav lists all gallery pages; the Style Guide is the index/home page.
- `FullScreenLayout.astro` — Minimal layout (global.css + reset.css only). Used by `/view/*` pages to render components without gallery chrome.
- `components/*.astro` — Each component renders semantic HTML with Tailwind utility classes. Props (`variant`, `size`, `disabled`, and `state` for form components) resolve to class strings at build time.
- `pages/*.astro` — Gallery pages using `GalleryLayout`. Each documents one component type with specimens organized into descriptive sections (variants, sizes, compositions, reference tables).
- `pages/view/*.astro` — Full-screen views using `FullScreenLayout`. Simple showcases of all component variations without gallery chrome — for seeing components in action.
- `public/icons/*.svg` — Standalone SVG files served statically. Downloadable from the icons gallery page.

## Markup Convention

### Semantic HTML + Tailwind Classes

All components use semantic HTML elements styled with Tailwind utility classes. No custom elements, no Shadow DOM.

```html
<section class="max-w-[var(--container-max)] mx-auto py-20 px-6 text-center">
  <h1 class="text-5xl font-bold leading-tight text-gray-900 tracking-tight">Build faster websites</h1>
  <p class="text-xl text-gray-600 mt-4 max-w-[65ch] mx-auto">The modern way to ship marketing sites at scale.</p>
  <div class="flex gap-4 justify-center mt-8">
    <a href="/start" class="...button classes...">Get Started</a>
    <a href="/learn" class="...button classes...">Learn More</a>
  </div>
</section>
```

**Rules:**
- Content: semantic HTML (`h1`-`h6`, `p`, `a`, `img`, `ul`, `figure`, `blockquote`, `section`, `nav`, `footer`)
- Layout/structure: Tailwind utility classes (`flex`, `grid`, `max-w-*`, `p-*`, `gap-*`)
- Design roles without semantic equivalent: `data-role` attribute (e.g., `<p data-role="eyebrow">`)
- No arbitrary values outside Tailwind's theme — all styling references theme tokens via utility classes

**Images: always use `<img>`, never CSS background images.** Use `<img>` with `object-fit: cover` (`object-cover` in Tailwind) for all imagery including hero backgrounds, card covers, and full-bleed sections. This enables responsive images via `srcset`/`sizes` and `<picture>`, provides `alt` text for accessibility, and lets the browser optimize loading with `loading="lazy"` and `fetchpriority`. Position with Tailwind classes (`absolute inset-0`) inside a relatively-positioned container when used as a backdrop.

### Container Queries, Not Media Queries

All responsive behavior uses container queries so components adapt to their container, not the viewport. This keeps components portable — a card in a 3-column grid adapts differently than the same card in a sidebar. No viewport-based responsive variants (`sm:`, `md:`, `lg:`) in component markup — only container query variants.

Tailwind v4 has built-in container query support:
- `@container` utility sets `container-type: inline-size` on the parent
- `@sm:`, `@md:`, `@lg:`, `@xl:` variants trigger at container breakpoints (640/768/1024/1280px)
- Named containers: `@container/card` → `@sm/card:` for targeted queries

```html
<section class="@container">
  <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-6">
    <!-- cards -->
  </div>
</section>
```

The only `@media` queries allowed are in `gallery.css` (tooling, not a deliverable).

### States

Components are interactive by default — they include pseudo-class variants (`hover:`, `active:`, `focus-visible:`) and transitions. Engineers hover, click, and tab to see interaction states directly in the gallery. No frozen "specimen mode" for interaction states — this is the advantage of HTML over Figma.

**Form components** use a `state` prop for states that can't be triggered by gallery interaction:

```astro
<!-- Error state — can't be triggered by clicking -->
<TextInput state="error" label="Username" value="ab" hint="Must be at least 3 characters" />

<!-- Renders to: -->
<input class="... border-red-500" data-state="error" />
```

Valid `state` values for form components: `error`, `success`, `disabled`, `dragover` (file upload), `has-value` (search). Without a `state` prop, form components render interactively like everything else.

**Primitive vs composite components:** Primitives (button, badge, input) show all their own variants in their gallery page. Composite components (hero, pricing, nav) show *their own* variants but render child primitives in default state only — the child's states are already documented in its own gallery page.

## Workflow

| Goal | Phase |
|------|-------|
| Start a new design system | Phase 1 + 2 |
| Build a component | Phase 3 |
| Review against the system | Phase 4 |
| Compose a full page | Phase 5 |

### Phase 1–2: Init

Domain exploration + design system setup. Read `BOOTSTRAP.md` for the full process — mandatory questions, outputs, token definitions, and the six foundational gallery pages. **After Phase 2 is complete, delete `BOOTSTRAP.md` and remove this reference.**

### Phase 3: Component Building

For each component:

1. **Declare intent** — What is it for? What hierarchy? What states?
2. **Reference system.md** — Check anti-patterns and decisions log. Stay consistent.
3. **Build** — Semantic HTML + Tailwind utility classes. Always interactive (pseudo-class variants). Use `state` prop only for form states that can't be triggered by interaction (error, success, disabled). All values from theme tokens.
4. **Self-review gate** — Validate against hard rules (see below).
5. **Visual review** — User opens gallery page. Approves or iterates.
6. **Update system.md** — Only if you made a new decision worth recording (added to anti-patterns or decisions log). Most components won't need an update.

**Suggested component order:** Typography specimens, Navigation, Hero sections, Feature grids, Pricing tables, Testimonials, Stats, Logo clouds, FAQ, CTA sections, Footer. (Buttons, icons, cards, grid, and forms are already built in Phase 2.)

### Phase 4: Self-Review Gate

Dispatch a validation subagent after every component. Fresh context, loaded with the hard rules, `system.md`, `global.css` theme, and the generated component.

**Hard rules (always enforced):**

| Rule | Check |
|------|-------|
| Token compliance | No arbitrary values. All styling via Tailwind utility classes referencing theme tokens |
| Hierarchy | Clear primary/secondary/tertiary emphasis (size + weight + color) |
| Spacing | Related elements closer, groups further apart |
| Typography | Line length 45-75 chars. Line height proportional to font size |
| Color | Communicates meaning, not decoration. Greys for structure, color for emphasis |
| Accessibility | Contrast ratios per the standard chosen in Phase 1 (recorded in `system.md`). Check target sizes if WCAG 2.2. If EAA: verify `lang` on `<html>`, reflow at 320px, non-text contrast ≥ 3:1, text spacing override tolerance, 200% text resize. Don't rely on color alone. |
| Depth | Consistent application across similar elements. Light source from above. |
| States | All components interactive by default (pseudo-class variants). Form `state` prop only for non-interactive states (error, success, disabled). Composites: own variants only, child primitives in default state |
| Semantic HTML | Content uses semantic elements (`section`, `nav`, `h1`–`h6`, `p`, `a`, `button`, `input`, etc.) |
| Scoping | Component styles via Tailwind classes on elements. No global CSS selectors in component files |
| Responsiveness | Container queries via Tailwind `@` variants (`@sm:`, `@md:`, etc.). No `@media` / no viewport-based `sm:`/`md:` in component markup |

**Soft rules** (from `system.md`): anti-pattern violations, pattern consistency, personality alignment (swap test).

Fix violations before showing components to the user.

For the full set of design principles informing the review, see Design Principles Reference below.

### Phase 5: Page Assembly

Compose approved components into full pages:

1. Define page structure — which components, what order, what content
2. Assemble — Astro page importing components, composed with Tailwind utility classes
3. Page-level concerns: section spacing, background alternation for rhythm, visual flow, responsive behavior
4. Full-page review against hard rules + page coherence

### Phase 6: System Evolution

- `system.md` only grows when you discover a new anti-pattern or make a system-wide decision. Token values live in `global.css`; component patterns live in the components.
- Update `global.css` tokens only when truly necessary — resist adding values.

## What This Is

- **A Figma replacement.** The gallery IS the design file. Components are the visual spec. Tailwind theme tokens are the design annotations. Engineers inspect this instead of a Figma inspect panel.
- **Framework-agnostic.** The gallery shows semantic HTML + Tailwind classes — engineers translate to their stack's conventions. The Tailwind class strings on each specimen are the exact visual spec.
- **The acceptance test.** Does the React component match the gallery specimen? That's the review gate. The gallery is the source of truth, not the framework implementation.

## What This Is NOT

- **Not a code deliverable.** Nobody ships the gallery HTML to production. They ship their framework's version, validated against the gallery.
- **Not a component framework.** No JavaScript, no reactivity. Static visual contract.
- **Not for app UI.** Marketing sites only.

---

# Design Principles Reference

Principles that inform the self-review gate and all design decisions.

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
- Decorate backgrounds: alternate section colors, subtle gradients (hues within 30 degrees max — wider looks garish), repeating patterns at very low contrast (opacity 0.05-0.1), simple geometric shapes (circles, dots, diagonal lines) positioned in corners. Advanced techniques: gradient meshes for organic color blends, noise/grain textures (`filter: url(#noise)` SVG or CSS `background-image` with tiny repeated noise tile), layered transparencies for depth, dramatic shadows on floating elements, and grain overlays at low opacity (0.03-0.08) to add tactile warmth to flat surfaces.
- Patterns don't have to tile the full background — running along just one edge (top, bottom) of a section is more subtle.
- Use fewer borders: try box shadows (works best when element color differs from background), different background colors, or extra spacing instead.
- Empty states matter: use illustrations, emphasize CTAs, and **hide supporting UI** (tabs, filters, sort controls) entirely when there's no content to operate on. Don't show a fully-rendered shell around emptiness.
- Think outside the box: dropdowns can have sections, columns, icons, and supporting text. Tables can combine columns into rich cells with images and color. Radio buttons can be selectable cards.
