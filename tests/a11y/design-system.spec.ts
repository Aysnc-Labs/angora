import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync } from 'fs';

// Load accessibility standard from config
const config = JSON.parse(readFileSync('tests/a11y/config.json', 'utf-8'));

function discoverPages(dir: string) {
  return readdirSync(dir)
    .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
    .map((f) => f.replace('.astro', ''));
}

// Components (full-screen views)
const viewPages = discoverPages('src/pages/design-system/view');

for (const page of viewPages) {
  test(`components / ${page}`, async ({ page: p }) => {
    await p.goto(`/design-system/view/${page}`);
    const results = await new AxeBuilder({ page: p })
      .withTags(config.tags)
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

// Layouts (full-page compositions)
const layoutPages = discoverPages('src/pages/design-system/layouts');

for (const page of layoutPages) {
  test(`layouts / ${page}`, async ({ page: p }) => {
    await p.goto(`/design-system/layouts/${page}`);
    const results = await new AxeBuilder({ page: p })
      .withTags(config.tags)
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
