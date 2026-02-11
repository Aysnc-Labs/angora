---
name: angora-data
description: Manage the SQLite content layer — schema discovery, table creation, seeding, and queries.
argument-hint: [command]
---

# Data: $ARGUMENTS

Manage the SQLite content layer (`data.sqlite` + `public/media/`).

## Two modes

### Mode A: No arguments (or `init`) — Schema discovery conversation

1. **Ensure database exists** — import `src/data/db.js` (creates `data.sqlite` with `media` table if missing).
2. **Show current schema** — list all tables and their columns. If only `media` exists, say so.
3. **Ask what content the site needs** — testimonials, features, pricing tiers, team members, blog posts, etc. Use `AskUserQuestion`.
4. **For each content type, ask what fields matter** — keep it conversational. Suggest sensible defaults.
5. **Generate `CREATE TABLE IF NOT EXISTS` statements** — every table gets:
   - `id INTEGER PRIMARY KEY AUTOINCREMENT`
   - `created_at TEXT NOT NULL DEFAULT (datetime('now'))`
   - `media_id INTEGER REFERENCES media(id)` (nullable) — for a primary image/asset
   - Plus the user's chosen fields
6. **Present schema for approval** before executing. Show the SQL.
7. **Seed 2–3 example rows per table** with realistic placeholder content.

### Mode B: With arguments — Direct operations

| Command | Action |
|---------|--------|
| `schema` | Show full database schema (all tables, columns, types) |
| `new table <name>` | Conversational table creation (ask fields, generate SQL, confirm, execute) |
| `add column <table> <column>` | `ALTER TABLE` to add a column (ask type + default) |
| `seed <table>` | Generate realistic sample data (2–5 rows) |
| `register media` | Scan `public/media/`, insert/update `media` table rows for all files found |
| `query <sql>` | Run a read-only query and display results |

## Rules

- **All schema changes require user approval** before executing.
- **Foreign keys are ON** — respect referential integrity.
- Use `TEXT` for dates (ISO 8601 format via `datetime('now')`).
- Use `INTEGER` for booleans (0/1).
- Media paths are relative to `public/media/` (e.g., `heroes/product.jpg`).
- The `media` table is the base — other tables reference it via `media_id`.

## Running SQL

Use the Bash tool to run queries via `better-sqlite3` through Node:

```bash
node -e "
  import db from './src/data/db.js';
  const rows = db.prepare('SELECT * FROM media').all();
  console.table(rows);
"
```

Or for schema inspection:

```bash
node -e "
  import db from './src/data/db.js';
  const tables = db.prepare(\"SELECT name FROM sqlite_master WHERE type='table' ORDER BY name\").all();
  for (const t of tables) {
    const cols = db.prepare('PRAGMA table_info(' + t.name + ')').all();
    console.log('\n' + t.name + ':');
    console.table(cols.map(c => ({ name: c.name, type: c.type, notnull: c.notnull, dflt: c.dflt_value })));
  }
"
```