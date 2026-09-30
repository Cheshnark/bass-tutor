import { expect, test } from '@playwright/test'

test('alphaTab renderiza el ejercicio sin errores', async ({ page }) => {
  await page.goto('/')
  const tab = page.getByTestId('alphatab')
  await expect(tab).toHaveAttribute('data-status', 'listo', { timeout: 20_000 })
  await expect(tab.locator('svg').first()).toBeVisible()
  await expect(page.getByRole('alert')).toHaveCount(0)
})

test('el reproductor carga el soundfont', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeEnabled({ timeout: 30_000 })
})

test('el metrónomo arranca y enciende los pilotos de pulso', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar' }).click()
  await expect(page.getByRole('button', { name: 'Parar' }).first()).toBeVisible()
  await expect(page.locator('.beat--on')).toHaveCount(1, { timeout: 5_000 })
})
