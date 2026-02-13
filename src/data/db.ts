import Database from 'better-sqlite3';
import { join, resolve } from 'path';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';

const dbPath = resolve(import.meta.dirname, 'data.sqlite');
const migrationsDir = resolve(import.meta.dirname, 'migrations');

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// --- Migration ledger ---

db.exec(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    filename TEXT NOT NULL UNIQUE,
    sql TEXT NOT NULL,
    applied_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

if (!existsSync(migrationsDir)) {
  mkdirSync(migrationsDir);
}

// Apply any pending migration files
const applied = new Set(
  db.prepare('SELECT filename FROM schema_migrations').all().map((r: { filename: string }) => r.filename)
);

const pending = readdirSync(migrationsDir)
  .filter(f => f.endsWith('.sql'))
  .sort()
  .filter(f => !applied.has(f));

for (const file of pending) {
  const sql = readFileSync(join(migrationsDir, file), 'utf-8');
  const run = db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (filename, sql) VALUES (?, ?)').run(file, sql);
  });
  run();
}

// Create and apply a new migration
function migrate(name: string, sql: string): string {
  const last = db.prepare('SELECT filename FROM schema_migrations ORDER BY id DESC LIMIT 1').get() as { filename: string } | undefined;
  const lastNum = last ? parseInt(last.filename.split('_')[0]) : 0;
  const num = String(lastNum + 1).padStart(3, '0');
  const filename = `${num}_${name}.sql`;

  const run = db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (filename, sql) VALUES (?, ?)').run(filename, sql);
  });
  run();

  writeFileSync(join(migrationsDir, filename), sql);
  return filename;
}

export { migrate };
export default db;
