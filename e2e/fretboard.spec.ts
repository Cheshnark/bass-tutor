import { expect, test } from '@playwright/test'

test.describe('mástil', () => {
  test('por defecto: 4 cuerdas, trastes 0–12, pentatónica menor de A', async ({ page }) => {
    await page.goto('/#/mastil')
    const board = page.getByTestId('fretboard')
    await expect(board).toHaveAttribute('aria-label', /4 cuerdas.*A · Pentatónica menor/)
    await expect(board.locator('.fb-note')).toHaveCount(4 * 13)
    // Fundamental A en la cuerda E (índice 0), traste 5.
    await expect(board.locator('[data-string="0"][data-fret="5"]')).toHaveClass(/fb-note--root/)
  })

  test('6 cuerdas', async ({ page }) => {
    await page.goto('/#/mastil')
    await page.getByLabel('Afinación').selectOption('standard-6')
    const board = page.getByTestId('fretboard')
    await expect(board.locator('.fb-note')).toHaveCount(6 * 13)
    await expect(board.locator('[data-string="0"][data-fret="0"]')).toHaveAttribute('data-note', 'B0')
  })

  test('zurdo: la cejuela pasa a la derecha', async ({ page }) => {
    await page.goto('/#/mastil')
    const nut = page.getByTestId('fretboard').locator('.fb-nut')
    const width = Number(await page.getByTestId('fretboard').getAttribute('width'))
    const before = Number(await nut.getAttribute('x1'))
    await page.getByRole('button', { name: /Zurdo/ }).click()
    await expect(page.getByTestId('fretboard')).toHaveAttribute('data-left-handed', 'true')
    const after = Number(await nut.getAttribute('x1'))
    expect(after).toBeCloseTo(width - before, 6)
  })

  test('grados y nomenclatura latina', async ({ page }) => {
    await page.goto('/#/mastil')
    await page.getByLabel('Ver').selectOption('arpeggio')
    await page.getByLabel('Etiquetas').selectOption('degree')
    await page.getByLabel('Nombres').selectOption('latina')
    const board = page.getByTestId('fretboard')
    const labels = await board.locator('.fb-note--in .fb-label').allTextContents()
    expect(new Set(labels)).toEqual(new Set(['1', '♭3', '5', '♭7']))
    await expect(board.locator('[data-string="0"][data-fret="5"]')).toHaveAttribute('aria-label', /^La1/)
  })

  test('pulsar una nota la marca (y no rompe nada)', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/#/mastil')
    const note = page.getByTestId('fretboard').locator('[data-string="0"][data-fret="5"]')
    await note.click()
    await expect(note).toHaveClass(/fb-note--played/)
    expect(errors).toEqual([])
  })

  test('en móvil el mástil se desplaza dentro de su caja, no la página', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/#/mastil')
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBe(0)
  })
})
