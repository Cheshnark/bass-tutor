import { expect, test, type Locator, type Page } from '@playwright/test'

/** Objetivo táctil de los controles principales (roadmap, Fase 6): al menos 48 × 48 px. */
async function expectBig(locator: Locator) {
  // Algunos controles llegan después (p. ej., el visor de partituras se carga en diferido).
  await expect(locator.first()).toBeVisible({ timeout: 20_000 })
  const count = await locator.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const box = await locator.nth(i).boundingBox()
    const label = (await locator.nth(i).textContent()) ?? ''
    expect(box, label).not.toBeNull()
    expect(box!.height, label).toBeGreaterThanOrEqual(48)
    expect(box!.width, label).toBeGreaterThanOrEqual(48)
  }
}

const nav = (page: Page) => page.getByRole('navigation', { name: 'Herramientas' }).getByRole('link')

test.describe('controles principales ≥ 48 px', () => {
  test('cabecera y lección', async ({ page }) => {
    await page.goto('/#/curso/cuerdas-al-aire/4')
    await expectBig(nav(page))
    await expectBig(page.getByRole('link', { name: 'Ajustes' }))
    await expectBig(page.getByRole('button', { name: 'Ver la lección completa' }))
    await expectBig(page.getByRole('button', { name: 'Modo atril' }))
    await expectBig(page.getByRole('link', { name: /Siguiente/ }).or(page.getByRole('button', { name: /Siguiente/ })))
    await expectBig(page.getByRole('button', { name: /Metrónomo a \d+ BPM/ }))
    await expectBig(page.getByRole('button', { name: 'Guardar intento' }))
    await expectBig(page.getByRole('button', { name: /Reproducir|Cargando sonido/ }))
  })

  test('metrónomo, afinador, quiz y ajustes', async ({ page }) => {
    await page.goto('/#/metronomo')
    await expectBig(page.getByRole('button', { name: 'Iniciar' }))
    await page.goto('/#/afinador')
    await expectBig(page.getByRole('button', { name: 'Activar micrófono' }))
    await expectBig(page.getByRole('group', { name: 'Cuerda' }).getByRole('button'))
    await page.goto('/#/practica/quiz')
    await page.getByLabel('Nombrar').check()
    await page.getByRole('button', { name: /Empezar ronda/ }).click()
    await expectBig(page.getByRole('group', { name: 'Respuestas' }).getByRole('button'))
    await page.goto('/#/ajustes')
    await expectBig(page.getByRole('button', { name: /Modo atril/ }))
  })
})

test('tema: alto contraste desde Ajustes, y se recuerda', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'cabezal')
  await page.getByRole('link', { name: 'Ajustes' }).click()
  await page.getByRole('radio', { name: /^Alto contraste/ }).check()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'alto-contraste')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'alto-contraste')
})

test('tema automático: sigue prefers-contrast del sistema', async ({ page }) => {
  await page.emulateMedia({ contrast: 'more' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'alto-contraste')
})

test('modo atril: sin cabecera, letra más grande, y se sale', async ({ page }) => {
  await page.goto('/#/curso/cuerdas-al-aire/2')
  const before = await page.getByTestId('lesson-body').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  await page.getByRole('button', { name: 'Modo atril' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-stand', 'on')
  await expect(page.getByRole('navigation', { name: 'Herramientas' })).toHaveCount(0)
  const after = await page.getByTestId('lesson-body').evaluate((el) => parseFloat(getComputedStyle(el).fontSize))
  expect(after).toBeGreaterThan(before)
  await expect(page.getByRole('button', { name: 'Ver la lección completa' })).toBeHidden()
  await page.getByRole('button', { name: 'Salir del atril' }).click()
  await expect(page.getByRole('navigation', { name: 'Herramientas' })).toBeVisible()
})

test('el piloto de la cabecera luce mientras suena el metrónomo', async ({ page }) => {
  await page.goto('/#/metronomo')
  await expect(page.getByRole('link', { name: /Metrónomo sonando/ })).toHaveCount(0)
  await page.getByRole('button', { name: 'Iniciar' }).click()
  const pilot = page.getByRole('link', { name: /Metrónomo sonando a \d+ BPM/ })
  await expect(pilot).toBeVisible()
  await page.getByRole('link', { name: 'Curso' }).click()
  await expect(pilot).toBeVisible()
})

test('cada vista tiene su h1 en el rótulo y su título de pestaña; el nombre de la app es un enlace', async ({ page }) => {
  await page.goto('/#/metronomo')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Metrónomo')
  await expect(page).toHaveTitle(/^Metrónomo · /)
  await page.goto('/#/curso/cuerdas-al-aire')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cuerdas al aire con metrónomo')
  await expect(page).toHaveTitle(/^Cuerdas al aire con metrónomo · /)
  // El logotipo lleva al índice del curso.
  await page.locator('.app-header .brand').click()
  await expect(page).toHaveURL(/#\/curso$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Curso')
  await expect(page).toHaveTitle(/^Curso · /)
})
