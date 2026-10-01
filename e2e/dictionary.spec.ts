import { expect, test } from '@playwright/test'

test.describe('diccionario', () => {
  test('se llega desde la navegación y muestra C mayor por defecto', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Herramientas' }).getByRole('link', { name: 'Diccionario' }).click()
    await expect(page).toHaveURL(/#\/diccionario$/)
    await expect(page.getByRole('heading', { name: 'C · Mayor' })).toBeVisible()
    await expect(page.getByTestId('dict-degrees')).toHaveText('1234567')
    await expect(page.getByTestId('dict-steps')).toHaveText('T · T · S · T · T · T · S')
  })

  test('arpegio Am7 con fórmula, notas e intervalos', async ({ page }) => {
    await page.goto('/#/diccionario')
    await page.getByRole('button', { name: 'Arpegios' }).click()
    await page.getByRole('button', { name: 'm7', exact: true }).click()
    await page.getByLabel(/^Fundamental/).selectOption('A')
    await expect(page.getByRole('heading', { name: 'A · m7' })).toBeVisible()
    await expect(page.getByTestId('dict-degrees')).toHaveText('1♭35♭7')
    await expect(page.getByTestId('dict-notes')).toHaveText('ACEG')
    await expect(page.getByTestId('dict-steps')).toHaveText('3m · 3M · 3m')
    // El mástil resalta exactamente esas cuatro clases de altura
    const labels = await page.getByTestId('fretboard').locator('.fb-note--in .fb-label').allTextContents()
    expect(new Set(labels)).toEqual(new Set(['1', '♭3', '5', '♭7']))
  })

  test('los ajustes (nombres latinos, zurdo) se comparten entre mástil y diccionario', async ({ page }) => {
    await page.goto('/#/mastil')
    await page.getByLabel(/^Nombres/).selectOption('latina')
    await page.getByRole('button', { name: /Zurdo/ }).click()
    await page.getByRole('link', { name: 'Diccionario' }).click()
    await expect(page.getByRole('heading', { name: 'Do · Mayor' })).toBeVisible()
    await expect(page.getByTestId('dict-notes')).toHaveText('DoReMiFaSolLaSi')
    await expect(page.getByTestId('fretboard')).toHaveAttribute('data-left-handed', 'true')
  })

  test('Escuchar se desactiva mientras suena y no da errores', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    await page.goto('/#/diccionario')
    const listen = page.getByRole('button', { name: 'Escuchar', exact: true })
    await listen.click()
    await expect(page.getByRole('button', { name: 'Sonando…' })).toBeDisabled()
    await expect(listen).toBeEnabled({ timeout: 8_000 })
    expect(errors).toEqual([])
  })
})

test('el metrónomo sigue sonando al cambiar de vista', async ({ page }) => {
  await page.goto('/#/metronomo')
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click()
  await page.getByRole('link', { name: 'Mástil' }).click()
  await expect(page.getByTestId('fretboard')).toBeVisible()
  await page.waitForTimeout(500)
  await page.getByRole('link', { name: 'Metrónomo', exact: true }).click()
  await expect(page.locator('.met-start')).toHaveText('Parar')
  await expect(page.getByText(/Compás \d+/)).toBeVisible()
})
