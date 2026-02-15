import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/data/schema/tables',
  out: './src/data/migrations',
  dbCredentials: {
    url: './src/data/data.sqlite',
  },
});
