---
name: designing-with-markup
description: >
  Use when building or iterating on a marketing site design system using HTML
  and CSS as the design medium — initializing design tokens, building component
  galleries, reviewing components, or assembling pages. Also use when working
  in a .design-system/ directory or when the user asks about design tokens,
  component galleries, or static visual contracts for engineering handoff.
---

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
.design-system/
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

- `system.md` — Design decisions, constraints, patterns. Under 200 lines. See [templates-reference.md](templates-reference.md) for template.
- `tokens.css` — CSS custom properties. No raw values in components. See [templates-reference.md](templates-reference.md) for template.
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
See [templates-reference.md](templates-reference.md) for starter templates.

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

For the full set of design principles informing the review, see [design-principles-reference.md](design-principles-reference.md).

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

## What This Skill Is NOT

- **Not a component framework.** No JavaScript, no reactivity. Static visual contract.
- **Not framework-specific.** Pure HTML + CSS. Engineers port to their framework.
- **Not a Figma replacement.** Design in code, not a visual tool.
- **Not for app UI.** Marketing sites only.