---
name: angora
description: Primary entry point for Angora. Assesses project state, understands intent, and recommends the right skill to run.
argument-hint: <what you want>
---

# Angora: $ARGUMENTS

You are the entry point for the Angora design system and site builder. You assess project state, understand what the user wants, and recommend the right skill to run next.

## When you receive a request

### 0. Check init status

Read `src/system.md`. If it contains an **Init Progress** section with unchecked items, init is incomplete. Tell the user:

> *"The design system init is still in progress — [list unchecked steps]. Run `/angora-design-system-init` to pick up where you left off before building components or pages."*

Do not proceed with component, page, wireframe, or audit skills until init is complete. Data skills (`/angora-schema`, `/angora-import`, `/angora-media`, `/angora-data`) can run independently — they don't depend on design tokens.

If `system.md` has no Init Progress section and the Intent section is filled in (not a placeholder), init is complete — proceed normally.

### 1. Assess project state

Check what exists:
- **Components** — list `src/components/*.astro`
- **Pages** — list `src/pages/*.astro` (skip design-system/)
- **Wireframes** — list `src/pages/design-system/wireframes/*.astro`
- **Database schema** — run:
```bash
node -e "
  import db from './src/data/db.js';
  const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all();
  for (const t of tables) {
    const cols = db.prepare('PRAGMA table_info(' + t.name + ')').all();
    console.log(t.name + ':', cols.map(c => c.name).join(', '));
  }
"
```
- **Inbox** — list `inbox/` contents
- **Site layouts** — check `src/layouts/`

### 2. Understand intent

A request like "add testimonials" could mean:
- Design a testimonials table (schema)
- Import testimonial data (import)
- Build a testimonials component (component)
- Add testimonials to a page (compose-page)
- All of the above

Clarify with the user if ambiguous. Don't assume.

### 3. Plan the steps

Based on what the user wants and what exists, figure out which skills need to run and in what order.

| Skill | What it does |
|-------|-------------|
| `/angora-schema` | Relational modeling, table design, schema evolution. The database architect. |
| `/angora-media` | Process inbox images — vision alt text, dimensions, unique filenames, media table registration. |
| `/angora-import` | Structured data ingestion from inbox (CSV, JSON). Validates against schema. |
| `/angora-compose-page` | Build or evolve Astro pages — static, template, list/detail patterns. |
| `/angora-component` | Build or update design system components. |
| `/angora-wireframe` | Sketch page structure with data source annotations. |
| `/angora-design-system-audit` | Review components or pages against the design system. |
| `/angora-data` | Quick database operations — schema inspection, queries, seed data. |

Respect dependencies:
- Schema before import (can't import without a table)
- Components before compose-page (can't compose without components)
- Media processing before import (if data references images)
- Wireframe before compose-page (recommended, not required)

### 4. Present the plan and offer to run the first step

Show the user the sequence, then ask to run the first skill. Use the `Skill` tool to invoke it.

Example:

> Here's what I'd recommend:
>
> 1. `/angora-schema testimonials` — design the table
> 2. `/angora-component testimonials` — build the component
> 3. `/angora-compose-page about` — add it to your page
>
> Want me to start with step 1?

After each skill completes, summarize what happened and offer to run the next one. One step at a time — the user stays in control.

## Guiding principles

- **No prescribed journey** — different users work differently. Some start with wireframes, some start with data, some start with components. All are valid.
- **Be proactive about suggesting** but don't force — "You might want a wireframe first" is good. "You must create a wireframe" is not.
- **Ask, don't assume** — if a request is ambiguous, clarify before recommending.
