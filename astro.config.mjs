import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import angoraEdit from './src/toolbar/integration';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [preact(), angoraEdit()],
});