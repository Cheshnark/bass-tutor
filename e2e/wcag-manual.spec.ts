import { expect, test, type Page } from '@playwright/test'

/**
 * Criterios WCAG 2.2 que axe no decide, comprobados con medidas objetivas (docs/accesibilidad.md):
 * 1.4.10 Reflow (320 px), 1.4.12 Espaciado de texto y 2.4.11 Foco no oculto.
 * Siguen sin sustituir la pasada a mano con lector de pantalla, pero atrapan regresiones.
 */
const VIEWS = [
  { name: 'índice del curso', path: '/#/curso' },
  { name: 'lección', path: '/#/curso/cuerdas-al-aire/4' },
  { name: 'práctica', path: '/#/practica' },
  { name: 'mástil', path: '/#/mastil' },
  { name: 'diccionario', path: '/#/diccionario' },
  { name: 'metrónomo', path: '/#/metronomo' },
  { name: 'afinador', path: '/#/afinador' },
  { name: 'ajustes', path: '/#/ajustes' },
]

/** Espera a que la vista pinte su h1 (rótulo de panel) antes de medir. */
const ready = (page: Page) => expect(page.locator('h1').first()).toBeVisible()

test.describe('1.4.10 Reflow a 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } })
  for (const view of VIEWS) {
    test(`sin scroll horizontal de página: ${view.name}`, async ({ page }) => {
      await page.goto(view.path)
      await ready(page)
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }))
      expect(scrollWidth, 'el documento no debe ser más ancho que la ventana').toBeLessThanOrEqual(clientWidth)
    })
  }
})

test.describe('1.4.12 Espaciado de texto', () => {
  // Valores del criterio: interlineado 1,5, párrafos 2 em, letras 0,12 em y palabras 0,16 em.
  const SPACING = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; }
    p { margin-bottom: 2em !important; }`
  for (const view of VIEWS) {
    test(`no se corta texto: ${view.name}`, async ({ page }) => {
      await page.goto(view.path)
      await ready(page)
      await page.addStyleTag({ content: SPACING })
      // Elementos que recortan su contenido (overflow hidden/clip) con texto que ya no cabe.
      const clipped = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('body *')]
          .filter((el) => {
            const style = getComputedStyle(el)
            const clips = /hidden|clip/.test(style.overflowX + style.overflowY)
            const hasText = [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim())
            const visible = el.offsetParent !== null && style.visibility !== 'hidden'
            return visible && clips && hasText && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1)
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}: "${el.textContent?.trim().slice(0, 30)}"`),
      )
      expect(clipped).toEqual([])
    })
  }
})

test.describe('2.4.11 Foco no oculto', () => {
  for (const view of VIEWS) {
    test(`ningún control enfocado queda tapado: ${view.name}`, async ({ page }) => {
      await page.goto(view.path)
      await ready(page)
      const hidden: string[] = []
      for (let i = 0; i < 60; i++) {
        await page.keyboard.press('Tab')
        const result = await page.evaluate(() => {
          const el = document.activeElement as HTMLElement | null
          if (!el || el === document.body) return null
          el.scrollIntoView({ block: 'nearest' })
          const r = el.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) return null
          // Sin scroll de por medio: el centro y las cuatro esquinas (algo dentro) deben pertenecer al elemento.
          const points = [
            [r.left + r.width / 2, r.top + r.height / 2],
            [r.left + 2, r.top + 2],
            [r.right - 2, r.bottom - 2],
          ]
          const covered = points.some(([x, y]) => {
            if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return false
            const top = document.elementFromPoint(x, y)
            return top !== null && !el.contains(top) && !top.contains(el)
          })
          return covered ? `${el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 30)}"` : null
        })
        if (result) hidden.push(result)
      }
      expect(hidden).toEqual([])
    })
  }
})
