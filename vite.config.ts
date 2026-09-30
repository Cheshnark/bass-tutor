/// <reference types="vitest/config" />
import { alphaTab } from '@coderline/alphatab-vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // alphaTab copia sus fuentes (Bravura) y el soundfont a public/ al arrancar.
  plugins: [react(), alphaTab()],
  server: { port: 5180 },
  test: {
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts'],
    environment: 'node',
  },
})
