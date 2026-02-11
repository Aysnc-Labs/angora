# Angora

A design system and site builder. The design system — tokens, components, and rendered specimens — is the source of truth for the visual language. Engineers consume it like a Figma file and translate to their framework. Add the SQLite content layer to turn the same components into a working prototype or a full static site.

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
- `src/styles/design-system.css` — Design system chrome: sidebar nav, specimen rows, labels, demo areas. Tooling only — doesn't ship.
- `src/pages/design-system/_layout/Layout.astro` — Sidebar nav + page shell for design system pages. Accepts `fullscreenHref` prop.
- `src/pages/design-system/_layout/FullScreen.astro` — Minimal layout for full-screen views (no design system chrome).
- `src/components/*.astro` — Each component renders semantic HTML with Tailwind utility classes.
- `src/pages/design-system/*.astro` — Design system pages. One per component type.
- `src/pages/design-system/view/*.astro` — Full-screen views without design system chrome.
- `src/pages/design-system/wireframes/*.astro` — Wireframe pages. Working docs for sketching page structure before building.
- `src/pages/*.astro` — Site pages. Real routes like `/about-us`, `/pricing`, etc.
- `public/icons/*.svg` — Downloadable SVG files.
- `data.sqlite` — SQLite database. Content store, committed to git. Created on first import of `src/data/db.js`.
- `public/media/` — Static media assets. Referenced by `path` in the `media` table.
- `src/data/db.js` — Database utility. Opens/creates `data.sqlite`, ensures the media table exists, exports the `db` instance.
- `inbox/` — Passive file queue. Drop images, CSVs, JSON here for processing. Contents gitignored.
- `src/layouts/*.astro` — Site layouts (header/footer wrappers for real pages).

## Workflow

Use `/angora` to assess project state and get a recommendation for which skill to run. Or invoke a skill directly:

| Goal | Skill |
|------|-------|
| **Assess & recommend** | `/angora <what you want>` |
| Start a new design system | `/angora-design-system-init` |
| Build or update a component | `/angora-component <name>` |
| Review against the system | `/angora-design-system-audit [path]` |
| Sketch a page wireframe | `/angora-wireframe <page-name>` |
| Compose a full page | `/angora-compose-page <page-name>` |
| Design database schema | `/angora-schema <what to model>` |
| Process inbox images | `/angora-media` |
| Import data from inbox | `/angora-import <filename>` |
| Quick database operations | `/angora-data [command]` |

### Inbox

The `inbox/` directory is a passive queue. Drop images, CSVs, JSON files here and tell `/angora` about them. Files are never deleted without explicit permission.

### System Evolution

- `system.md` only grows when you discover a new anti-pattern or make a system-wide decision. Token values live in `global.css`; component patterns live in the components.
- Update `global.css` tokens only when truly necessary — resist adding values.
