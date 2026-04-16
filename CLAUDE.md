# Angora

A design system and site builder. Tokens, components, and rendered specimens — the visual language as code. Add the SQLite content layer to turn the same components into a working prototype or a full static site.

**Scope:** Marketing sites — heroes, pricing, features, testimonials, CTAs, navigation, footers. Not app UI, not dashboards.

## Build Layer

- **Astro** — build tool. Semantic HTML + Tailwind utility classes. No custom elements, no `@scope` CSS.
- **Tailwind CSS v4** — styling layer via `@tailwindcss/vite`. Tokens in `src/styles/global.css` using `@theme`.
- **Preact** — interactive islands via `@astrojs/preact`. Design system components are Astro (static HTML, zero JS) by default. Preact for client-side state (modals, accordions, dynamic forms) with `client:load` or `client:visible`.
- **Drizzle ORM** — database layer wrapping `better-sqlite3`. Tables in `src/data/schema/tables/`.
- **SQLite** — content store at `src/data/data.sqlite`, committed to git.

## Key Files

| File | Purpose |
|------|---------|
| `src/system.md` | Intent, accessibility standard, anti-patterns, decisions log |
| `src/styles/global.css` | `@theme` block with all design tokens — single source of truth |
| `src/styles/design-system.css` | Design system chrome (tooling, doesn't ship) |
| `src/components/*.astro` | Components — semantic HTML + Tailwind |
| `src/icons/` | Icon components (no `Icon` prefix — directory provides context) |
| `src/pages/design-system/` | Specimen pages, wireframes, layouts, full-screen views |
| `src/pages/*.astro` | Production site pages |
| `src/layouts/*.astro` | Site layouts (header/footer wrappers) |
| `src/data/schema/tables/` | Drizzle table definitions (one file per table) |
| `src/data/schema/index.ts` | Barrel re-export of all tables |
| `src/data/db.ts` | Drizzle client (`db`) and raw driver (`sqlite`) |
| `src/data/migrations/` | SQL migrations (generated, committed, never hand-edit) |
| `inbox/` | Passive file queue for images, CSVs, JSON (gitignored) |

## Commands

| Command | What it does |
|---------|-------------|
| `pnpm dev` | Start Astro dev server |
| `pnpm build` | Production build |
| `pnpm test:a11y` | Playwright + Axe accessibility tests |
| `pnpm db:generate` | Generate Drizzle migration from schema changes |
| `pnpm db:migrate` | Apply pending migrations |
| `pnpm db:studio` | Browser UI for database |

## Skills

| Skill | What it does |
|-------|-------------|
| `/angora` | Assess project state, route to the right skill |
| `/angora-design-system-init` | Define brand identity, tokens, style guide |
| `/angora-component <name>` | Build or update a component |
| `/angora-compose-page <page-name>` | Build pages or layout specimens |
| `/angora-wireframe <page-name>` | Sketch page structure |
| `/angora-design-system-audit [path]` | Review against the design system |
| `/angora-schema <what to model>` | Design database schema |
| `/angora-media` | Process inbox images |
| `/angora-import <filename>` | Import data from inbox |
| `/angora-data [command]` | Quick database operations |

## Data Layer

- **Schema changes:** edit table file → re-export in `index.ts` → `pnpm db:generate` → `pnpm db:migrate`
- **Queries:** Drizzle typed API only — never raw SQL in components or pages
- **Browse:** `pnpm db:studio`
