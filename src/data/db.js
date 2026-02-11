import Database from 'better-sqlite3';
import { resolve } from 'path';

const dbPath = resolve(import.meta.dirname, '../../data.sqlite');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL UNIQUE,
    alt TEXT NOT NULL DEFAULT '',
    type TEXT NOT NULL DEFAULT 'image',
    width INTEGER,
    height INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
