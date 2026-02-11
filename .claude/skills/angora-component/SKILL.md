---
name: angora-component
description: Build or update a component in the design system. Use when creating a new component type (hero, nav, pricing, testimonials, etc.) or modifying an existing one.
argument-hint: <name>
---

# Component: $ARGUMENTS

## Before you start

1. **Read `src/system.md`** — check anti-patterns and decisions log. Stay consistent.
2. **Read `src/styles/global.css`** — know the available tokens. All values must come from theme.
3. **Read [design-principles.md](../docs/design-principles.md)** — hierarchy, spacing, typography, color, depth, and finishing touches guidance.
4. **Check if the component already exists** — look for `src/components/<Name>.astro`. If it exists, read it first. Understand what's there before making changes.

## Output files

Every component requires three files:

1. **Component** — `src/components/<Name>.astro`
2. **Design system page** — `src/pages/design-system/<name>.astro` (using `Layout` from `_layout/`, shows all variants/states)
3. **Full-screen view** — `src/pages/design-system/view/<name>.astro` (using `FullScreen` from `_layout/`, no design system chrome)

Add the design system page to the sidebar nav in `src/pages/design-system/_layout/Layout.astro`.

## Steps

1. **Declare intent** — What is this component for? What hierarchy? What states?
2. **Build** — Semantic HTML + Tailwind utility classes. Always interactive (pseudo-class variants). Use `state` prop only for form states that can't be triggered by interaction (error, success, disabled). All values from theme tokens.
3. **Create design system page** — Import the component into a design system page showing all variants and states. Create the matching full-screen view page. Wire into sidebar nav.
4. **Responsive check** — Verify the component works at narrow (~320px), medium (~768px), and wide (~1280px) container widths. Typography scales automatically via `clamp()` tokens (requires a `@container` ancestor). Check: layout collapses/stacks logically, text doesn't overflow, interactive targets stay tappable (≥44px), images/media scale without breaking, spacing tightens proportionally. If layout doesn't adapt, add the missing `@sm:`/`@md:`/`@lg:` container query variants.
5. **Self-review** — Run `/angora-design-system-audit` on the component before showing to user.
6. **Visual review** — User opens design system page in browser (`pnpm dev`). Approves or iterates.
7. **Update system.md** — Only if you made a new decision worth recording (added to anti-patterns or decisions log). Most components won't need an update.

**Suggested component order:** Typography specimens, Navigation, Hero sections, Feature grids, Pricing tables, Testimonials, Stats, Logo clouds, FAQ, CTA sections, Footer. (Buttons, icons, cards, grid, and forms are already built during init.)

## Markup Conventions

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

**Images: always use `<img>`, never CSS background images.** Use `<img>` with `object-fit: cover` (`object-cover` in Tailwind) for all imagery including hero backgrounds, card covers, and full-bleed sections. Position with Tailwind classes (`absolute inset-0`) inside a relatively-positioned container when used as a backdrop.

### Container Queries, Not Media Queries

All responsive behavior uses container queries so components adapt to their container, not the viewport. No viewport-based responsive variants (`sm:`, `md:`, `lg:`) in component markup — only container query variants.

Tailwind v4 container query support:
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

The only `@media` queries allowed are in `design-system.css` (tooling, not a deliverable).

### States

Components are interactive by default — they include pseudo-class variants (`hover:`, `active:`, `focus-visible:`) and transitions. No frozen "specimen mode" — this is the advantage of HTML over Figma.

**Form components** use a `state` prop for states that can't be triggered by design system interaction:

```astro
<!-- Error state — can't be triggered by clicking -->
<TextInput state="error" label="Username" value="ab" hint="Must be at least 3 characters" />

<!-- Renders to: -->
<input class="... border-red-500" data-state="error" />
```

Valid `state` values: `error`, `success`, `disabled`, `dragover` (file upload), `has-value` (search).

**Primitive vs composite:** Primitives (button, badge, input) show all their own variants. Composites (hero, pricing, nav) show *their own* variants but render child primitives in default state only.
