# Tailwind CSS v4 Conventions

Syntax-level rules for writing consistent Tailwind classes across Angora. These complement the design principles — design-principles.md covers *what* to do, this covers *how to type it*.

**Angora's constraint: no arbitrary values in components.** All styling references theme tokens via utility classes. The rules below assume you are working within the token scale. Where a rule mentions arbitrary syntax (`[…]`), it applies only to `global.css` token definitions or the rare escape hatch — never in component markup.

## Utility syntax

- Prefer `size-{n}` over `h-{n} w-{n}` when both values are the same
- Prefer shorthand classes over split axis classes — `p-8` not `px-8 py-8`, `inset-0` not `inset-x-0 inset-y-0`. Keep them split when a variant overrides one axis: `p-8 @md:px-10`
- Use `shrink-*` not `flex-shrink-*`, `grow-*` not `flex-grow-*` (deprecated)
- Use `bg-linear-*` for gradients, never `bg-gradient-*` (deprecated)
- Use `min-h-dvh` / `min-h-svh` / `min-h-lvh`, never `min-h-screen` (deprecated)

## Values and units

- Pixels are fine for properties that use pixels natively in Tailwind — `border-*`, `outline-*`
- Use theme variable references for radii in `global.css` — `--radius: var(--radius-xl)` not `--radius: 16px`
- Prefer bare values over arbitrary values for integers and multiples of 0.25 — `z-10` not `z-[10]`
- Prefer bare opacity modifiers on semantic color utilities — `bg-foreground/2` not `bg-foreground/[0.02]`. Use `[…]` only for non-0.25-increment values
- In `global.css` token definitions: use `rem` for font sizes, whole-number ratios for grid tracks

## Spacing tokens

- Use `--spacing(…)` for spacing values in `global.css` — `--padding: --spacing(2)` not `--padding: 8px`
- Never use `calc(var(--spacing)*…)` — use `--spacing(…)` instead
- Never use `theme(spacing.…)` — use `--spacing(…)` instead
- Never use `theme()` for colors or other tokens — use CSS variables instead

## Line height

- Never use named line-height values like `tight`, `snug`, `relaxed` — not in `leading-tight`, not in `text-6xl/tight`
- Only use spacing scale values (`leading-6`, `text-sm/5`), and only when a custom line height is specifically required

## Spacing between children

- Never use `mt-*` / `mb-*` / `ml-*` / `mr-*` / `mx-*` / `my-*` between flex/grid children — use `gap-*` on the parent

## CSS variables

- Set CSS variables using arbitrary property syntax, not inline styles — `class="[--padding:--spacing(3)]"` not `style="--padding: --spacing(3)"` (unless the value is dynamic)
- For dynamic values bound to data, prefer CSS variables over setting CSS properties directly in `style` — `class="w-(--progress)" style="--progress: 72%"` not `style="width: 72%"`. Name the variable descriptively. This is a legitimate escape hatch for data-driven values

## Variants

- Negate `hidden` with a single conditional variant instead of setting `hidden` and conditionally re-applying the display class — `flex items-center gap-x-6 max-lg:hidden` not `hidden lg:flex lg:items-center lg:gap-x-6`
- Prefer `not-*` variants over setting a base value and conditionally overriding it — `group-not-has-checked:opacity-0` not `group-has-checked:opacity-100 opacity-0`. Place `not-` directly before the state being negated
- Use bare values in variants over arbitrary values — `data-closed:…` not `data-[closed]:…`, `group-data-open:…` not `group-data-[open]:…`

## Markup

- Never apply `text-*` (font size) or `leading-*` (line height) to inline elements (`<span>`, `<a>`, `<strong>`, `<em>`, `<code>`) — always apply to containing block-level elements
- Never add redundant display classes that match an element's default — no `block` on `<div>`, no `inline` on `<span>`. `flex`, `grid`, `inline-flex`, `inline-grid` are never redundant
- Never apply conflicting classes for the same property without a distinguishing variant — no `outline-1 outline-2` on the same element
- Always add `role="list"` to `<ul>` and `<ol>` elements unless a `list-style-*` class is applied
- Always apply `antialiased` to the root element
- Always apply `isolate` to the main app container
- Add `tabular-nums` to elements that display numbers, especially values that change over time

## @import order

- Place `@import` statements with remote URLs at the very top of the CSS file, before `@import "tailwindcss"` — but after `@charset` if present

## Custom utilities and variants

- Prefer `@utility my-utility { … }` over plain class selectors (`.my-utility { … }`) — utilities work with all Tailwind variants (`hover:my-utility`, `lg:my-utility`)
- Use `@utility my-utility-* { … }` with `--value()` and `--modifier()` for parameterized utilities
- Use `@variant the-variant { … }` inside `@utility` definitions to apply an existing variant — don't manually write the media query or selector
- Use `@custom-variant` to define new custom variants when the built-in set doesn't cover the case
- Never nest `@utility` inside another at-rule like `@media` or `@supports` — move the at-rule inside the `@utility` block

## Flexbox

- Always add `min-w-0` to flex children that need to shrink below their content size — flex items default to `min-width: auto` and won't shrink past their content without it
- Always add `shrink-0` to flex children that should never shrink — icons, SVGs, images, logos, avatars

## Shadows and borders

- Never pair `shadow-*` with solid gray borders — use `ring-1 ring-border` or semantic border tokens
- Never use solid colors for dividers — use opacity-based semantic tokens (`divide-border`, `border-border`)

## Images

- Never use borders on photos — use `outline-1 -outline-offset-1 outline-border` if the image needs a visible edge

## SVG

- Omit `xmlns` on inline `<svg>` elements — only needed for standalone `.svg` files
- Use `fill-*` / `stroke-*` classes with semantic tokens, not `text-*` with `currentColor`
- Never combine `fill="currentColor"` attributes with `fill-*` classes on the same element

## Interactivity

- Never add `hover:*` states to non-interactive elements
- Never add `transition-*` for hover color/background changes — reserve transitions for elements that move or transform
