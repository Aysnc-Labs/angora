---
name: angora-compose-page
description: Build or evolve Astro pages — static content, database-driven templates, list/detail patterns, site layout integration.
argument-hint: <page-name>
---

# Compose Page: $ARGUMENTS

Build or update a full site page from approved components. Pages are living documents — this skill handles both creation and evolution.

## Before you start

1. **Read `src/system.md`** — intent, accessibility standard, anti-patterns.
2. **Read `src/styles/global.css`** — available tokens for page-level spacing and backgrounds.
3. **Read [design-principles.md](../docs/design-principles.md)** — especially Spacing & Layout and Finishing Touches sections.
4. **Inventory components** — list `src/components/*.astro` to know what's available. Only use approved, built components.
5. **Check for wireframe** — look for `src/pages/design-system/wireframes/<page-name>.astro`. If it exists, read it — especially the data source annotations in frontmatter.
6. **Check for existing page** — look for `src/pages/<page-name>.astro`. If it exists, read it first. This is an evolution, not a rewrite.
7. **Check for site layout** — look in `src/layouts/` for existing site layouts (header/footer wrappers).

## Entry points

This skill can be invoked with:
- A **wireframe reference** — "compose the pricing page" (where a wireframe exists)
- A **component list** — "build a page with hero, features, and CTA"
- A **description** — "build our about page"

If no wireframe exists, recommend one ("Want me to sketch a wireframe first with `/angora-wireframe`?") but don't force it.

## Mandatory gate: static vs template per section

Before building, determine the data source for every section on the page.

If a wireframe exists with data source annotations, read them:
```
/*
  Data sources:
  sections:
    - component: Hero
      data: static
    - component: Testimonials
      data: table:testimonials
    - component: Pricing
      data: table:pricing_tiers
*/
```

If no wireframe or annotations, ask for each section:
- "Will this content change? Is there more than one?" → **template** (table reference)
- "Is this one-off copy edited in code?" → **static**

For **template sections**, verify the table exists:
```bash
node -e "
  import db from './src/data/db.js';
  const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table'\").all();
  console.log(tables.map(t => t.name));
"
```

If a required table doesn't exist, flag it: "The `testimonials` table doesn't exist yet. This needs schema work first. Run `/angora-schema testimonials` to design it."

## List/detail pattern

Recognize when cards link to individual pages (blog posts, case studies, cities, team members). This is a first-class pattern:

### List page
`src/pages/<collection>.astro`
- Query: `SELECT * FROM <table> WHERE status = 'published'`
- Renders cards/list items linking to `/collection/[slug]`

### Detail template
`src/pages/<collection>/[slug].astro`
- Uses `getStaticPaths()` to generate pages from database
- Query: `SELECT * FROM <table> WHERE status = 'published'`
- Wire up SEO from table fields: `<title>`, `<meta name="description">`, OG tags
- Only render published records

```astro
---
import db from '../../data/db.js';

export function getStaticPaths() {
  const items = db.prepare("SELECT * FROM <table> WHERE status = 'published'").all();
  return items.map(item => ({
    params: { slug: item.slug },
    props: { item },
  }));
}

const { item } = Astro.props;
---
<html>
<head>
  <title>{item.meta_title || item.title}</title>
  <meta name="description" content={item.meta_description || ''} />
</head>
...
</html>
```

## Site layout

Ask: "Should this page have the site header/footer, or is it a standalone landing page?"

Check for `src/layouts/` — if no layout exists and user wants header/footer, flag it: "No site layout exists yet. Want me to create one, or should we build this as a standalone page for now?"

Site layouts go in `src/layouts/` (Astro convention). A site layout wraps page content with shared header/footer/nav.

## Output

- `src/pages/<page-name>.astro` — the site page
- Optional: `src/pages/<collection>/[slug].astro` — for list/detail patterns

## Teammate mode

When spawned as a teammate by `/angora`, you are a full session — the user can interact with you directly (Shift+Up/Down).

1. **Quick check only** — list components, check for wireframe, check for existing page, check for site layout. Keep it to a few file listings — do NOT deep-read every file.
2. **Ask immediately** — use `AskUserQuestion` to present: what you found, your proposed page plan (components, section order, data sources, layout decisions), and any blockers. **Stop completely until the user responds.** Do not read more files, query the database, or do any work while waiting.
3. Only create page files after the user approves.
4. If you discover blockers (missing tables, missing components, no site layout), message the lead via `SendMessage`.

## Page-level concerns

- Section spacing — consistent vertical rhythm between sections
- Background alternation for visual rhythm (light/dark sections)
- Visual flow — the eye moves naturally through the page
- Responsive behavior via container queries
- SEO: `<title>`, `<meta name="description">`, OG tags

## Review

Run `/angora-design-system-audit` on the composed page for hard rules + page coherence.

User opens page in browser (`pnpm dev`). Approves or iterates.
