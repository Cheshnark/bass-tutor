import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Genera favicon, iconos PWA (64/192/512, maskable) y apple-touch-icon a partir de public/icon.svg.
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#16171a' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#16171a' } },
  },
  images: ['public/icon.svg'],
})
