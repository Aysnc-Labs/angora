# Angora

An AI-driven design and content deliverable. HTML + CSS is the design medium; SQLite is the content layer. The gallery is the spec; the tokens are the annotations; the rendered components are the acceptance test. `data.sqlite` + `public/media/` hold the content — committed to git as part of the deliverable.

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
- `data.sqlite` — SQLite database. Content store, committed to git. Created on first import of `src/data/db.js`.
- `public/media/` — Static media assets. Referenced by `path` in the `media` table.
- `src/data/db.js` — Database utility. Opens/creates `data.sqlite`, ensures the media table exists, exports the `db` instance.

## Workflow

| Goal | Skill |
|------|-------|
| Start a new design system | `/angora-design-system-init` |
| Build or update a component | `/angora-component <name>` |
| Review against the system | `/angora-component-audit [path]` |
| Sketch a page wireframe | `/angora-wireframe <page-name>` |
| Compose a full page | `/angora-assemble <page-name>` |
| Manage content & schema | `/angora-data [command]` |

### System Evolution

- `system.md` only grows when you discover a new anti-pattern or make a system-wide decision. Token values live in `global.css`; component patterns live in the components.
- Update `global.css` tokens only when truly necessary — resist adding values.
