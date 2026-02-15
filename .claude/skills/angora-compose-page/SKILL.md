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
5. **Read `src/components/Section.astro`** — understand the Section pattern before composing pages. All page sections use this component.
6. **Check for wireframe** — look for `src/pages/design-system/wireframes/<page-name>.astro`. If it exists, read it — especially the data source annotations in frontmatter.
7. **Check for layout** — look for `src/pages/design-system/layouts/<page-name>.astro`. If a layout exists, it's an approved composition showing how components assemble for this page. Use it as the reference — match its section order, component choices, and visual rhythm. The real page replaces placeholder content with real data but follows the same structure.
8. **Check for existing page** — look for `src/pages/<page-name>.astro`. If it exists, read it first. This is an evolution, not a rewrite.
9. **Check for site layout** — look in `src/layouts/` for existing site layouts (header/footer wrappers).

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
  import db from './src/data/db.ts';
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
import db from '../../data/db.ts';

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

## Form sections

When a page includes forms (contact, signup, settings), use the form layout primitives:

- **FieldGroup** — vertical stack of form rows with standard `grid-gap` spacing
- **FormRow** — horizontal row within a FieldGroup. Children grow to fill space by default. Use `grow={false}` for button rows

Every field inside a FieldGroup should be wrapped in a FormRow. Don't use raw `<div>` wrappers for form layout.

## Page-level concerns

- **Page wrapper uses `page-flow`** — `<main class="page-flow">` wraps all sections. The `page-flow` utility lives in `global.css` and controls inter-section margin (gap controlled by `--section-gap`).
- **Every section uses the Section component** — don't render raw `<section>` elements on pages. Section provides `@container`, container max-width, horizontal padding, and accessible labeling. Non-seamless sections have no vertical padding (`page-flow` handles spacing). Seamless sections get standardized vertical padding tied to `--section-gap`.
- **Section-level components compose Section internally** — if using Hero, Features, or other section-level components, they already render Section under the hood. Don't double-wrap with `<Section><Hero>`.
- **Backgrounded sections use `seamless`** — `<Section seamless>` for sections with background colors/images. Adjacent seamless sections get 0 gap so backgrounds butt up.
- **Prose utility for content sections** — sections with flowing editorial content (articles, about copy, rich text from CMS) should wrap content in the `prose` utility class from `global.css`. It handles heading sizes, vertical rhythm, list styling, blockquotes, links, `text-wrap`, and inline treatments (`mark`, `code`, `kbd`). Don't use `prose` on structured component sections (hero, pricing, features) — those own their spacing explicitly.
- Background alternation for visual rhythm (light/dark sections)
- Visual flow — the eye moves naturally through the page
- Responsive behavior via container queries
- SEO: `<title>`, `<meta name="description">`, OG tags

## Review

Present the completed page to the user and suggest they review in browser (`pnpm dev`). Offer to run `/angora-design-system-audit` for a design system check — don't run it automatically. (Accessibility is covered at the component and layout level by `pnpm test:a11y` — no need to re-test assembled pages.)
