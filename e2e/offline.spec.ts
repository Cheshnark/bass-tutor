import { expect, test } from '@playwright/test'

// Único spec con service worker: comprueba el criterio de la Fase 3 "modo avión: todo el curso funciona".
test.use({ serviceWorkers: 'allow' })

test('tras la primera visita, el curso funciona sin conexión (incluida la partitura con sonido)', async ({ page, context }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Curso', level: 2 })).toBeVisible()
  // Esperar a que el service worker termine de precargar y controle la página.
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready
  })
  await page.reload()
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true)

  await context.setOffline(true)

  await page.goto('/#/curso/uno-cinco-ocho/4')
  await expect(page.getByRole('heading', { name: 'Fundamental, quinta y octava (1-5-8)', level: 2 })).toBeVisible()
  const tab = page.getByTestId('alphatab')
  await expect(tab).toHaveAttribute('data-status', 'listo', { timeout: 20_000 })
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeEnabled({ timeout: 30_000 })

  // Otras vistas también
  await page.getByRole('link', { name: 'Diccionario' }).click()
  await expect(page.getByRole('heading', { name: 'C · Mayor' })).toBeVisible()
})
