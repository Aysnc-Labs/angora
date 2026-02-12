---
name: angora-data
description: Quick database operations — schema inspection, column additions, seeding, and read-only queries.
argument-hint: [command]
---

# Data: $ARGUMENTS

Quick operations on the SQLite content layer (`data.sqlite`).

## Commands

| Command | Action |
|---------|--------|
| `schema` (or no arguments) | Show full database schema (all tables, columns, types) |
| `add column <table> <column>` | `ALTER TABLE` to add a column (ask type + default, confirm first) |
| `seed <table>` | Generate 2-5 realistic sample rows |
| `query <sql>` | Run a read-only query and display results |

## Running SQL

### Schema inspection (read-only)

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

### Schema changes (ALTER TABLE, etc.)

All DDL must go through `migrate()`:

```bash
node -e "
  import { migrate } from './src/data/db.js';
  const file = migrate('add_<column>_to_<table>', \`ALTER TABLE <table> ADD COLUMN <column> <type>;\`);
  console.log('Migration applied:', file);
"
```

## Rules

- **All schema changes require user approval** before executing.
- **Foreign keys are ON** — respect referential integrity.
- Use `TEXT` for dates (ISO 8601 format).
- Use `INTEGER` for booleans (0/1).
- `query` runs read-only — refuse writes via this command.

## For heavier work

This skill is for quick operations. For more involved work, use `/angora`:

- **Schema design** (new tables, relational modeling, SEO fields) → `/angora-schema`
- **Data import** (CSV, JSON from inbox) → `/angora-import`
- **Media processing** (images from inbox) → `/angora-media`
