/// <reference types="vitest/config" />
import { alphaTab } from '@coderline/alphatab-vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { alphaTabAssets } from './scripts/vite-plugin-alphatab-assets'
import { APP_NAME } from './src/brand'
import { coursePlugin } from './scripts/vite-plugin-course'
import remarkLessonSteps from './src/content/remarkLessonSteps'

// https://vite.dev/config/
export default defineConfig({
  // En GitHub Pages la web vive en /bass-tutor/ (lo fija el workflow de despliegue con BASE_PATH).
  base: process.env.BASE_PATH ?? '/',
  plugins: [
    // Lecciones .mdx → componentes React. remark-frontmatter evita que el YAML se pinte como texto;
    // remark-gfm añade tablas y listas de tareas; remarkLessonSteps agrupa cada `##` en un <LessonStep>.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkGfm, remarkLessonSteps] }) },
    react({ include: /\.(mdx|jsx?|tsx?)$/ }),
    // alphaTab: workers y worklets. Sus fuentes y soundfont los copia alphaTabAssets (solo si cambian).
    alphaTab({ assetOutputDir: false }),
    alphaTabAssets(),
    // `virtual:course`: contenido validado como JSON.
    coursePlugin(),
    // PWA: todo el curso (incluidos alphaTab, la fuente y el soundfont) precargado para usarlo sin conexión.
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      manifest: {
        name: APP_NAME,
        short_name: APP_NAME,
        description: 'Profesor de bajo eléctrico: lecciones paso a paso, mástil, metrónomo y tablatura.',
        lang: 'es',
        start_url: '.',
        scope: '.',
        display: 'standalone',
        background_color: '#16171a',
        theme_color: '#16171a',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,sf2,txt}'],
        // Solo el formato de fuente y el soundfont que se usan (woff2, sf2); fuera los demás formatos.
        globIgnores: ['font/Bravura.svg', '**/*.sf3', '**/*.eot', '**/*.otf', '**/*.woff'],
        // Los workers de alphaTab pesan ~2,3 MB cada uno (el límite por defecto es 2 MB).
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { port: 5180 },
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
})
