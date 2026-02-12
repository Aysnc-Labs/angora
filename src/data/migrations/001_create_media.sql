CREATE TABLE IF NOT EXISTS media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL UNIQUE,
  alt TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'image',
  width INTEGER,
  height INTEGER,
  source_name TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
