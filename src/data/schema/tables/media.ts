import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const media = sqliteTable('media', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  alt: text('alt').notNull().default(''),
  type: text('type').notNull().default('image'),
  width: integer('width'),
  height: integer('height'),
  sourceName: text('source_name'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
});
