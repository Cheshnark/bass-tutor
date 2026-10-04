import { expect, test, type Page } from '@playwright/test'

/** Posición del cursor del pulso respecto a la ventana, y cuánto ha bajado la página. */
const cursor = (page: Page) =>
  page.evaluate(() => {
    const c = document.querySelector('.at-cursor-beat')!.getBoundingClientRect()
    return { top: c.top, bottom: c.bottom, scrollY: window.scrollY, viewport: window.innerHeight }
  })

async function play(page: Page) {
  const button = page.getByRole('button', { name: 'Reproducir' })
  await expect(button).toBeEnabled({ timeout: 30_000 })
  await button.scrollIntoViewIfNeeded()
  await button.click()
  await expect(page.getByRole('button', { name: 'Pausa' })).toBeVisible()
}

// Canción de 31 compases: no cabe en una pantalla, así que la vista tiene que seguir al cursor.
test('la vista sigue al cursor en una partitura larga y lo deja con margen por arriba', async ({ page }) => {
  await page.goto('/#/curso/cancion-completa/4')
  await play(page)
  const start = await cursor(page)

  // Pasados unos segundos la página ha bajado y el cursor está dentro de la ventana, con margen sobre el borde.
  await expect.poll(async () => (await cursor(page)).scrollY, { timeout: 15_000 }).toBeGreaterThan(start.scrollY)
  await expect
    .poll(async () => {
      const { top } = await cursor(page)
      return top >= 40 && top <= 200
    }, { timeout: 15_000 })
    .toBe(true)
  await page.getByRole('button', { name: 'Parar', exact: true }).click()
})

test('en modo atril también se ve el cursor', async ({ page }) => {
  await page.goto('/#/curso/cancion-completa/4')
  await page.getByRole('button', { name: 'Modo atril' }).click()
  await play(page)
  const beat = page.locator('.at-cursor-beat')
  await expect(beat).toBeVisible()
  await expect(beat).toHaveCSS('background-color', 'rgb(154, 74, 0)')
  await page.getByRole('button', { name: 'Parar', exact: true }).click()
})
