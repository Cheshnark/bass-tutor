import { expect, test } from '@playwright/test'

test.describe('índice del curso: acordeón', () => {
  test('por defecto solo está abierto el tronco común; los itinerarios se abren y se recuerdan', async ({ page }) => {
    await page.goto('/#/curso')
    const common = page.getByRole('button', { name: /Tronco común/ })
    const rock = page.getByRole('button', { name: /Rock \/ pop/ })
    await expect(common).toHaveAttribute('aria-expanded', 'true')
    await expect(rock).toHaveAttribute('aria-expanded', 'false')

    // Cerrado: el contenido del itinerario no se ve ni está en el árbol de accesibilidad.
    const rockModule = page.getByRole('heading', { name: /El pulso del rock/ })
    await expect(rockModule).toBeHidden()

    await rock.click()
    await expect(rock).toHaveAttribute('aria-expanded', 'true')
    await expect(rockModule).toBeVisible()

    // Se recuerda al volver y se puede cerrar el tronco común.
    await common.click()
    await expect(common).toHaveAttribute('aria-expanded', 'false')
    await page.reload()
    await expect(page.getByRole('button', { name: /Tronco común/ })).toHaveAttribute('aria-expanded', 'false')
    await expect(page.getByRole('button', { name: /Rock \/ pop/ })).toHaveAttribute('aria-expanded', 'true')
  })

  test('se maneja con el teclado y cada bloque indica cuántas lecciones llevas', async ({ page }) => {
    await page.goto('/#/curso')
    const rock = page.getByRole('button', { name: /Rock \/ pop/ })
    await rock.focus()
    await page.keyboard.press('Enter')
    await expect(rock).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Space')
    await expect(rock).toHaveAttribute('aria-expanded', 'false')
    await expect(rock.getByLabel(/0 de \d+ lecciones completadas/)).toBeVisible()
  })

  test('el botón del acordeón cumple los 48 px de los controles principales', async ({ page }) => {
    await page.goto('/#/curso')
    const box = await page.getByRole('button', { name: /Rock \/ pop/ }).boundingBox()
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(48)
  })
})
