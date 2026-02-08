# Designing With Markup

A **design deliverable** — not a code deliverable. This replaces Figma + design tokens as the source of truth for engineering teams. HTML + CSS is the design medium. The gallery is the spec; the tokens are the annotations; the rendered components are the acceptance test.

Engineering teams consume this the way they'd consume a Figma file: open the gallery, inspect the component, translate it into their framework (React + Tailwind, Vue + UnoCSS, Svelte, whatever). Nobody ships this HTML to production — they ship their framework's version, validated against this gallery.

**Scope:** Marketing sites — heroes, pricing, features, testimonials, CTAs, navigation, footers. Not app UI, not dashboards.

## Build Layer

**Astro** is the build tool. It produces static HTML+CSS — no client-side JavaScript. **Tailwind CSS v4** is the styling layer, integrated via `@tailwindcss/vite`. Design tokens are defined in `src/styles/global.css` using Tailwind's `@theme` directive — this is the single source of truth for all design values.

- Astro components render semantic HTML with Tailwind utility classes. No custom elements, no `@scope` CSS.
- Component props (`variant`, `size`, `disabled`) resolve to Tailwind class strings at build time. No client-side JavaScript.
- Astro component names don't need a prefix (just `Button.astro`, not `SiteButton.astro`).
- Icon components live in `src/components/icons/` and drop the `Icon` prefix — the directory provides context (e.g., `icons/ArrowRight.astro`).

## Key Files

- `src/system.md` — The "why" file. Intent, accessibility standard, anti-patterns, and decisions log. No token values (that's `global.css`) and no component patterns (that's the components). **Read before building or reviewing a component.**
- `src/styles/global.css` — `@import "tailwindcss"` + `@theme` block with all design tokens. Single source of truth. **Read before building a component to know available tokens.**
- `src/styles/gallery.css` — Gallery chrome: sidebar nav, specimen rows, labels, demo areas. Tooling only — doesn't ship.
- `src/layouts/GalleryLayout.astro` — Sidebar nav + page shell. Accepts `fullscreenHref` prop.
- `src/layouts/FullScreenLayout.astro` — Minimal layout for `/view/*` pages (no gallery chrome).
- `src/components/*.astro` — Each component renders semantic HTML with Tailwind utility classes.
- `src/pages/*.astro` — Gallery pages. One per component type.
- `src/pages/view/*.astro` — Full-screen views without gallery chrome.
- `src/pages/wireframes/*.astro` — Wireframe pages. Working docs for sketching page structure before building.
- `public/icons/*.svg` — Downloadable SVG files.

## Workflow

| Goal | Skill |
|------|-------|
| Start a new design system | `/design-system-init` |
| Build or update a component | `/design-system-component <name>` |
| Review against the system | `/design-system-audit [path]` |
| Sketch a page wireframe | `/design-system-wireframe <page-name>` |
| Compose a full page | `/design-system-assemble <page-name>` |

### System Evolution

- `system.md` only grows when you discover a new anti-pattern or make a system-wide decision. Token values live in `global.css`; component patterns live in the components.
- Update `global.css` tokens only when truly necessary — resist adding values.
