/// <reference types="vitest/config" />
import { alphaTab } from '@coderline/alphatab-vite'
import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import remarkFrontmatter from 'remark-frontmatter'
import { defineConfig } from 'vite'
import { coursePlugin } from './scripts/vite-plugin-course'
import remarkLessonSteps from './src/content/remarkLessonSteps'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Lecciones .mdx → componentes React. remark-frontmatter evita que el YAML se pinte como texto;
    // remarkLessonSteps agrupa cada `##` en un <LessonStep> (modo "siguiendo la clase").
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkFrontmatter, remarkLessonSteps] }) },
    react({ include: /\.(mdx|jsx?|tsx?)$/ }),
    // alphaTab copia sus fuentes (Bravura) y el soundfont a public/ al arrancar.
    alphaTab(),
    // `virtual:course`: contenido validado como JSON.
    coursePlugin(),
  ],
  server: { port: 5180 },
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
})
