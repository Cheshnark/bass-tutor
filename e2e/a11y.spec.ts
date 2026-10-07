import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

/**
 * Criterio de la Fase 6: WCAG 2.2 AA. axe-core comprueba las reglas automatizables (contraste, nombres
 * accesibles, estructura, tamaño mínimo de objetivos 2.5.8…). Lo que no se puede automatizar (orden lógico,
 * sentido de los textos alternativos…) queda para revisión manual (docs/accesibilidad.md).
 */
const VIEWS: { name: string; path: string; ready: (page: Page) => Promise<void> }[] = [
  { name: 'índice del curso', path: '/#/curso', ready: (p) => expect(p.getByRole('heading', { name: 'Curso', level: 1 })).toBeVisible() },
  {
    name: 'lección (paso a paso, con ejercicio)',
    path: '/#/curso/cuerdas-al-aire/4',
    ready: (p) => expect(p.getByTestId('alphatab')).toHaveAttribute('data-status', 'listo', { timeout: 20_000 }),
  },
  {
    name: 'lección completa',
    path: '/#/curso/uno-cinco-ocho',
    ready: async (p) => {
      await p.getByRole('button', { name: 'Ver la lección completa' }).click()
      await expect(p.getByRole('heading', { name: 'Autoevaluación', level: 2 })).toBeVisible()
    },
  },
  { name: 'práctica', path: '/#/practica', ready: (p) => expect(p.getByRole('heading', { name: 'Práctica', level: 1 })).toBeVisible() },
  {
    name: 'quiz de mástil',
    path: '/#/practica/quiz',
    ready: async (p) => {
      await p.getByRole('button', { name: /Empezar ronda/ }).click()
      await expect(p.getByTestId('quiz-prompt')).toBeVisible()
    },
  },
  { name: 'oído', path: '/#/practica/oido', ready: (p) => expect(p.getByRole('button', { name: /Empezar ronda/ })).toBeVisible() },
  { name: 'mástil', path: '/#/mastil', ready: (p) => expect(p.getByTestId('fretboard')).toBeVisible() },
  { name: 'diccionario', path: '/#/diccionario', ready: (p) => expect(p.getByTestId('fretboard')).toBeVisible() },
  { name: 'metrónomo', path: '/#/metronomo', ready: (p) => expect(p.getByTestId('bpm-display')).toBeVisible() },
  { name: 'afinador', path: '/#/afinador', ready: (p) => expect(p.getByRole('button', { name: 'Activar micrófono' })).toBeVisible() },
  { name: 'ajustes', path: '/#/ajustes', ready: (p) => expect(p.getByRole('heading', { name: 'Ajustes', level: 1 })).toBeVisible() },
  { name: 'créditos', path: '/#/creditos', ready: (p) => expect(p.getByRole('heading', { name: 'Créditos y avisos', level: 1 })).toBeVisible() },
  { name: 'privacidad', path: '/#/privacidad', ready: (p) => expect(p.getByRole('heading', { name: 'Privacidad', level: 1 })).toBeVisible() },
]

const THEMES = ['cabezal', 'alto-contraste'] as const

const audit = (page: Page) =>
  new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    // La partitura la dibuja alphaTab (SVG de terceros); se audita su contenedor, no su interior.
    .exclude('[data-testid="alphatab"] svg')
    .analyze()

for (const theme of THEMES) for (const view of VIEWS) {
  test(`WCAG 2.2 AA (${theme}): ${view.name}`, async ({ page }) => {
    await page.addInitScript((t) => {
      localStorage.setItem('bass-tutor:settings', JSON.stringify({ state: { theme: t }, version: 1 }))
    }, theme)
    await page.goto(view.path)
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme)
    await view.ready(page)
    const results = await audit(page)
    const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`)
    expect(summary).toEqual([])
    // Que el cero no sea un falso negativo: contraste y tamaño de objetivos se han evaluado y pasan; los nombres
    // de botón pasan o no aplican (una vista sin <button>).
    const passed = results.passes.map((r) => r.id)
    const inapplicable = results.inapplicable.map((r) => r.id)
    expect(passed).toEqual(expect.arrayContaining(['color-contrast', 'target-size']))
    expect([...passed, ...inapplicable]).toContain('button-name')
  })
}

test('WCAG 2.2 AA: lección en modo atril', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('bass-tutor:settings', JSON.stringify({ state: { standMode: true }, version: 1 }))
  })
  await page.goto('/#/curso/cuerdas-al-aire/4')
  await expect(page.locator('html')).toHaveAttribute('data-stand', 'on')
  await expect(page.getByTestId('alphatab')).toHaveAttribute('data-status', 'listo', { timeout: 20_000 })
  const results = await audit(page)
  expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`)).toEqual([])
})
