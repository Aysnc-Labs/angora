---
name: angora-component
description: Build or update a component in the design system. Use when creating a new component type (hero, nav, pricing, testimonials, etc.) or modifying an existing one.
argument-hint: <name>
---

# Component: $ARGUMENTS

## Before you start

1. **Read `src/system.md`** — check anti-patterns and decisions log. Stay consistent.
2. **Read `src/styles/global.css`** — know the available tokens. All color values must come from the **semantic tokens inside `@theme`**. The primitive palette (defined outside `@theme`) generates **no Tailwind utility classes** — only semantic tokens produce usable classes. This is structural enforcement for dark mode compatibility.
3. **Read [design-principles.md](../docs/design-principles.md)** — hierarchy, spacing, typography, color, depth, dark mode, and finishing touches guidance.
4. **Check existing components** — look in `src/components/`. If the component already exists, read it first. Understand what's there before making changes. If building a new component, read 2–3 existing project components to learn the established patterns (styling conventions, prop style, layout approach).
## Composition

**Three tiers: primitives, composites, and section-level components.**

### Primitives

Atomic, single-purpose elements. Single file. Take props directly.

Examples: Button, TextInput, Toggle, Badge, Section, FormRow, FieldGroup.

### Composites

Layout shells that arrange content through sub-components, not prop bags. Directory structure groups the shell with its sub-components.

**The rule:** the shell gets *behavior/layout* props (variant, size). Content flows through *sub-components*.

**Reference implementation: `Card/`** — the existing Card composite demonstrates this pattern:

```astro
<!-- Bad — prop bag, locked layout -->
<Card imageSrc="/img.jpg" eyebrow="Engineering" title="Hello" description="..." />

<!-- Good — composable sub-components -->
<Card padding={false}>
  <CardImage src="/img.jpg" alt="..." />
  <CardBody>
    <CardEyebrow>Engineering</CardEyebrow>
    <CardTitle>Building reliable systems</CardTitle>
    <CardDescription>How we scaled our infrastructure.</CardDescription>
  </CardBody>
</Card>
```

The shell (`Card`) owns variant/padding. Each sub-component owns its own typography and spacing. Consumers compose only the parts they need.

### Section-level components

Any component that occupies a page section (Hero, Pricing, Features, Testimonials, CTA, Stats, FAQ). These compose the `Section` component internally — the consumer never wraps in Section manually.

**Section rules:**

- Section-level components **always compose `Section` internally**. The consumer writes `<Hero>` or `<Features>`, not `<Section><Hero></Section>`.
- `Section` provides: `<section>` element, `@container`, container max-width, horizontal padding, `seamless` variant (`data-seamless` for `page-flow`). Non-seamless sections get no vertical padding — `page-flow` handles spacing. Seamless sections get standardized vertical padding tied to `--section-gap`. Headings are composed as children — Section doesn't own title markup.
- A Hero renders `<Section seamless>` under the hood. A Features block renders `<Section>` with a composed heading under the hood.
- Section-level components wire `aria-labelledby` internally since they know their own heading markup. Section accepts `aria-label` for sections without a visible heading.
- Section-level components are composites (directory structure) because they contain sub-components — but they always have Section as their outermost wrapper.

## Spacing

**Internal padding vs. outer spacing — never both on the same boundary.**

- **Non-seamless sections** — no vertical padding from Section. Content has no background to fill. `page-flow` margin provides all inter-section spacing.
- **Seamless sections** — Section adds vertical padding tied to `--section-gap`, so the breathing room inside a backgrounded section matches the gap between sections. Consistent rhythm everywhere.
- **Outer spacing** — section-level components NEVER set their own `margin-top`/`margin-bottom` on their outermost element. That's `page-flow`'s job.
- **`page-flow`** — the page-level utility (defined in `global.css`) that controls vertical rhythm between sections. Gap controlled by `--section-gap`. Adjacent `[data-seamless]` sections get 0 gap so backgrounds butt up.
- **The doubling rule** — if a non-seamless component adds `py-*` AND sits inside `page-flow`, you get padding + margin = double whitespace. Non-seamless sections avoid this by having no vertical padding. Seamless sections are safe because adjacent seamless sections get 0 margin from `page-flow`, and the standardized padding provides consistent internal rhythm.

## File organization

**Primitives → single file. Composites → directory.**

```
components/
  Button.astro              ← primitive, single file
  Section.astro             ← primitive, single file (the section wrapper)
  TextInput.astro           ← primitive, single file
  Card/                     ← composite, directory
    Card.astro              ← shell (variant/layout props)
    CardImage.astro         ← image with placeholder fallback
    CardBody.astro          ← padded content wrapper
    CardEyebrow.astro       ← uppercase category label
    CardTitle.astro         ← title (accepts `as` prop for heading level)
    CardDescription.astro   ← body text
  Hero/                     ← section-level composite, directory
    Hero.astro              ← composes Section internally
    HeroTitle.astro
    HeroDescription.astro
    HeroActions.astro
```

The directory groups the shell with its sub-components. Consumers import from the directory: `import Card from '../components/Card/Card.astro'`.

## Output files

Every component requires three files:

1. **Component** — `src/components/<Name>.astro`
2. **Design system page** — `src/pages/design-system/<name>.astro` (using `Layout` from `_layout/`, shows all variants/states)
3. **Full-screen view content** — `src/pages/design-system/view/_content/<name>.astro` (pure markup, no FullScreen wrapper). The dynamic route at `view/[theme]/[...slug].astro` wraps this in FullScreen and applies the theme. This generates `/view/light/<name>` always, plus `/view/dark/<name>` when dark mode is enabled.

The sidebar auto-discovers design system pages via `import.meta.glob` — no manual nav registration needed. Just create the file and it appears. The `fullscreenHref` prop on `Layout` should point to `/design-system/view/light/<name>` (the toggle in the sidebar handles switching to the dark route).

## Steps

### 1. Research

- Read `system.md`, `global.css`, `design-principles.md`
- Read 2–3 existing components to learn project patterns
- If the component already exists, read it first
- If this is a section-level component, read `Section.astro` to understand the Section pattern

### 2. Spec

Present a spec to the user covering:

- **Purpose & hierarchy** — what is this component, who sees it, where on the page
- **Classification** — primitive (single element), composite (layout shell + sub-components), or section-level (composes Section internally)
- **Section participation** — is this section-level? If yes: composes Section internally. Specify whether seamless. Heading is always composed as a child, not a Section prop
- **Composition** — if composite: name each sub-component, its responsibility, which are required vs optional
- **Variants** — only those that earn their place. Name each, describe the use case. Don't generate variants speculatively
- **States** — interactive states (hover/focus/active come free via pseudo-class variants), plus any `state` prop values if form-related
- **Responsive behavior** — how it adapts at narrow/medium/wide container widths
- **Prop API** — list props with types and defaults

Wait for the user to approve before building.

### 3. Build

- Build component files per the approved spec
- Semantic HTML + Tailwind utility classes. Always interactive (pseudo-class variants). Use `state` prop only for form states that can't be triggered by interaction (error, success, disabled). All color values from **semantic token utilities only** (`bg-card`, `text-foreground`, `border-border`, etc.) — never raw palette classes
- If section-level: compose Section internally, don't add outer vertical spacing
- Create design system page + full-screen view
- Wire into sidebar nav

### 4. Responsive check

Verify the component works at narrow (~320px), medium (~768px), and wide (~1280px) container widths. Typography scales automatically via `clamp()` tokens (requires a `@container` ancestor). Check: layout collapses/stacks logically, text doesn't overflow, interactive targets stay tappable (≥44px), images/media scale without breaking, spacing tightens proportionally. If layout doesn't adapt, add the missing `@sm:`/`@md:`/`@lg:` container query variants.

### 5. Accessibility test

Tell the user: "Running a11y tests next." Then run `pnpm test:a11y` immediately — this is verification, not a project change. Don't ask permission to run it (dev server must be running). Read the output and interpret every finding for the user:
- **Real issue** — explain what's wrong in plain language, propose a specific fix, explain why it matters.
- **False positive** — explain why it's safe to ignore (e.g., disabled states are intentionally dimmed, specimen context lacks form wrapping). Don't fix these.

Present findings and proposed fixes. Wait for approval before applying fixes only.

### 6. Audit + fix

Tell the user: "Running design system audit next." Then run `/angora-design-system-audit` immediately on the new component — same as above, verification not a change. The audit skips contrast and ARIA labeling (already covered by the a11y test) and focuses on design rules, token compliance (including semantic token enforcement — no raw palette classes), and responsive behavior. Fix any issues it finds — no confirmation needed for audit-driven fixes.

### 7. Present for review

Show the user what you've built. Reference the design system page URL (e.g., `/design-system/buttons`) so they can check it — don't tell them to start the dev server.

### 8. Visual review

User reviews in browser. Approves or iterates.

### 9. Update system.md

Only if you made a new decision worth recording (added to anti-patterns or decisions log). Most components won't need an update.

**Suggested component order:** Typography specimens, Navigation, Hero sections, Feature grids, Pricing tables, Testimonials, Stats, Logo clouds, FAQ, CTA sections, Footer. (Buttons, icons, cards, grid, Section, and forms are already built during init.)

## Markup Conventions

### Dev Tools Identification

Every component's root element gets a `data-component` attribute matching the component name (PascalCase). This makes components instantly identifiable in browser dev tools, where Tailwind class soup otherwise gives no hint which component rendered an element.

```html
<button data-component="Button" class="inline-flex items-center ...">
<div data-component="Card" class="rounded-lg overflow-hidden ...">
<section data-component="Section" class="...">
```

Sub-components get it too: `data-component="CardBody"`, `data-component="HeroTitle"`. The DOM reads like a component tree. This attribute is always first in the attribute list for consistency.

### Semantic HTML + Tailwind Classes

All components use semantic HTML elements styled with Tailwind utility classes. No custom elements, no Shadow DOM.

**Section-level component example (composes Section internally):**

```astro
---
import Section from '../Section.astro';
---
<Section seamless>
  <h1 class="text-5xl font-bold leading-tight text-foreground tracking-tight">Build faster websites</h1>
  <p class="text-xl text-muted-foreground mt-4 max-w-[65ch] mx-auto">The modern way to ship marketing sites at scale.</p>
  <div class="flex gap-4 justify-center mt-8">
    <a href="/start" class="...button classes...">Get Started</a>
    <a href="/learn" class="...button classes...">Learn More</a>
  </div>
</Section>
```

**Rules:**
- Content: semantic HTML (`h1`-`h6`, `p`, `a`, `img`, `ul`, `figure`, `blockquote`, `section`, `nav`, `footer`)
- Layout/structure: Tailwind utility classes (`flex`, `grid`, `max-w-*`, `p-*`, `gap-*`)
- Long-form content: use the `prose` utility class for sections with flowing editorial text (paragraphs, lists, blockquotes). Components like cards and heroes should NOT use `prose` — they own their spacing explicitly via `gap-*` classes
- No arbitrary values outside Tailwind's theme — all styling references theme tokens via utility classes
- Pixel translation: when a user specifies a value in pixels, map it to the nearest theme token first (e.g., "32px padding" → `p-8`). If no token fits, use `rem` for sizing and `em` for prose-relative spacing. Never hard-code arbitrary pixel values in components
- Section-level components compose `Section` — don't render raw `<section>` with manual padding

**Change the component, don't override from outside.** When a component's default appearance needs to change, update the component file itself. Never override baked-in Tailwind classes from the consumer side via the `class` prop — Tailwind resolves same-specificity utilities by CSS source order, not HTML class attribute order, so `bg-highlight` passed via `class` won't reliably beat a component's built-in `bg-muted`. The `class` prop is for **additive** styling (positioning, extra margin, layout context) — not for overriding the component's own visual treatment. If you find yourself reaching for `!important` (`!bg-*`), that's a signal you're fighting the component instead of updating it.

**Images: always use `<img>`, never CSS background images.** Use `<img>` with `object-fit: cover` (`object-cover` in Tailwind) for all imagery including hero backgrounds, card covers, and full-bleed sections. Position with Tailwind classes (`absolute inset-0`) inside a relatively-positioned container when used as a backdrop.

### ARIA Regions and Groups

Composites that render as page sections need accessible labels so screen readers can identify them. Primitives generally don't — native semantics are enough.

- **`<section>`** — always pair with `aria-labelledby` pointing to the section's heading, or `aria-label` if there's no visible heading. Section-level components wire `aria-labelledby` internally since they control their own heading markup. Pass `aria-label` on Section for sections without a visible heading.
- **`<nav>`** — always add `aria-label` (e.g., `aria-label="Main"`, `aria-label="Footer"`). Critical when multiple navs exist on a page
- **`role="group"`** — use on related control clusters (e.g., a button group, a set of radio cards) with `aria-label` describing the group

```astro
<!-- Section-level component handles its own aria-labelledby -->
<Section aria-labelledby="pricing-heading">
  <h2 id="pricing-heading">Pricing</h2>
  ...
</Section>

<!-- Section without visible heading -->
<Section aria-label="Call to action" seamless>
  ...
</Section>

<!-- Nav with label -->
<nav aria-label="Main">...</nav>

<!-- Control group -->
<div role="group" aria-label="Plan selection">
  <Card>...</Card>
  <Card>...</Card>
</div>
```

Accept `aria-label` as a prop on composites so consumers can override the default label in context.

### Container Queries, Not Media Queries

All responsive behavior uses container queries so components adapt to their container, not the viewport. No viewport-based responsive variants (`sm:`, `md:`, `lg:`) in component markup — only container query variants.

Tailwind v4 container query support:
- `@container` utility sets `container-type: inline-size` on the parent
- `@sm:`, `@md:`, `@lg:`, `@xl:` variants trigger at container breakpoints (640/768/1024/1280px)
- Named containers: `@container/card` → `@sm/card:` for targeted queries

```html
<!-- Section component already provides @container — no need to add it -->
<Section>
  <h2>Features</h2>
  <div class="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 grid-gap">
    <!-- cards -->
  </div>
</Section>
```

The only `@media` queries allowed are in `design-system.css` (tooling, not a deliverable).

### States

Components are interactive by default — they include pseudo-class variants (`hover:`, `active:`, `focus-visible:`) and transitions. No frozen "specimen mode" — this is the advantage of HTML over Figma.

**Form controls with native inputs** (Checkbox, Radio, Toggle) use hidden `<input>` elements with `sr-only peer` and Tailwind's `peer-checked:` variants. Interactivity, keyboard support, and accessibility come from the native element — no `state` prop needed. Use boolean props: `checked`, `disabled`. Add `name`/`value` for form submission and radio grouping.

**Form controls without native checked state** (TextInput, Textarea, Select) use a `state` prop for states that can't be triggered by design system interaction:

```astro
<!-- Error state — can't be triggered by clicking -->
<TextInput state="error" label="Username" value="ab" hint="Must be at least 3 characters" />

<!-- Renders to: -->
<input class="... border-destructive" data-state="error" />
```

Valid `state` values: `error`, `success`, `disabled`, `dragover` (file upload), `has-value` (search).

### Form Layout

Two primitives handle form layout spacing, both using `grid-gap` (`var(--grid-gap)`):

- **FormRow** — horizontal row (`flex flex-wrap`). Children grow to fill space by default (`grow` prop, defaults `true`). Set `grow={false}` for rows where children should stay at natural width (e.g., buttons). `align` prop controls vertical alignment (`start` | `center` | `end`).
- **FieldGroup** — vertical stack (`flex flex-col`). Wraps multiple FormRows or fields with standard vertical spacing.

```astro
<FieldGroup>
  <FormRow>
    <TextInput label="First name" />
    <TextInput label="Last name" />
  </FormRow>
  <FormRow>
    <TextInput label="Email" />
  </FormRow>
  <FormRow grow={false}>
    <Button>Submit</Button>
  </FormRow>
</FieldGroup>
```

**Primitive vs composite:** Primitives (button, badge, input) show all their own variants. Composites (hero, pricing, nav) show *their own* variants but render child primitives in default state only.
