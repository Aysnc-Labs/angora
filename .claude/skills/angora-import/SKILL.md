---
name: angora-import
description: Import structured data from inbox files (CSV, JSON) into the database. Validates against schema, maps fields, imports with transactions.
argument-hint: <filename>
---

# Import: $ARGUMENTS

Import structured data from `inbox/` into the SQLite database.

## Before you start

1. **Check inbox** — verify the target file exists in `inbox/`.
2. **Check current schema** — run:
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

## Workflow

### 1. Read and detect format

Read the inbox file. Detect format:
- **JSON array** — `[{...}, {...}]`
- **Nested JSON** — `{ "testimonials": [...], "authors": [...] }`
- **CSV** — comma-separated with header row

### 2. Analysis phase

Map data fields to schema columns. Flag:
- Fields in data without matching columns
- Required columns (NOT NULL, no default) without data
- Type mismatches (string in INTEGER column, etc.)
- Missing foreign key targets (e.g., `media_id` referencing non-existent media)
- Duplicate slugs
- Which table(s) the data maps to

### 3. Flag schema gaps

If the data has fields that don't match the schema, **do NOT modify the schema**. Report clearly:

> "The data has a `company` field but the testimonials table doesn't have a `company` column. This needs schema work first. Run `/angora-schema` to update the schema."

### 4. Present mapping for approval

Show the user:
- Source field → Target column mapping
- Sample of first 2-3 rows as they would be inserted
- Any transformations needed (date format, slug generation, etc.)
- Row count

**Wait for user approval before inserting.**

### 5. Import with transactions

All rows insert or none do:

```bash
node -e "
  import db from './src/data/db.js';
  const insert = db.prepare('INSERT INTO <table> (<columns>) VALUES (<placeholders>)');
  const insertMany = db.transaction((rows) => {
    for (const row of rows) insert.run(...Object.values(row));
  });
  insertMany(<data>);
  console.log('Inserted <count> rows.');
"
```

### 6. Verify

Query and show a sample of inserted data:

```bash
node -e "
  import db from './src/data/db.js';
  const rows = db.prepare('SELECT * FROM <table> ORDER BY id DESC LIMIT 5').all();
  console.table(rows);
"
```

## Rules

- **Never delete inbox files without explicit permission** — ask after processing
- **Never modify schema** — that's the schema specialist's job. Report gaps and recommend `/angora-schema`.
- **All imports require user approval** before executing
- Report validation errors with row numbers and field names
- Supports JSON and CSV (more formats can be added)
- Use transactions — all rows succeed or none do
