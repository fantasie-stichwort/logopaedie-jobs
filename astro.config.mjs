// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // DEINE DOMAIN HIER (Punycode für Umlaute empfohlen, oder Klartext)
  site: 'https://logopädiejobs.de', 
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});