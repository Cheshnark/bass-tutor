/// <reference types="vitest/config" />
import { alphaTab } from '@coderline/alphatab-vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import remarkGfm from 'remark-gfm'
import { defineConfig } from 'vite'
import { alphaTabAssets } from './scripts/vite-plugin-alphatab-assets'
import { coursePlugin } from './scripts/vite-plugin-course'
import remarkLessonSteps from './src/content/remarkLessonSteps'

// https://vite.dev/config/
export default defineConfig({
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
  ],
  server: { port: 5180 },
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
})
