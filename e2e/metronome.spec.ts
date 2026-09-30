import { expect, test, type Page } from '@playwright/test'

const panel = (page: Page) => page.getByRole('region', { name: 'Metrónomo' })
const display = (page: Page) => page.getByTestId('bpm-display')

test.describe('metrónomo', () => {
  test('±1/±5 y el deslizador cambian el tempo', async ({ page }) => {
    await page.goto('/')
    await expect(display(page)).toHaveText('80')
    await page.getByRole('button', { name: 'Subir 5 BPM' }).click()
    await page.getByRole('button', { name: 'Bajar 1 BPM' }).click()
    await expect(display(page)).toHaveText('84')
    await page.getByLabel('Tempo').fill('150')
    await expect(display(page)).toHaveText('150')
  })

  test('tap tempo calcula el BPM a partir de las pulsaciones', async ({ page }) => {
    await page.goto('/')
    const tap = page.getByRole('button', { name: 'Tap' })
    for (let i = 0; i < 5; i++) {
      await tap.dispatchEvent('pointerdown')
      if (i < 4) await page.waitForTimeout(500)
    }
    const bpm = Number(await display(page).textContent())
    expect(bpm).toBeGreaterThanOrEqual(108)
    expect(bpm).toBeLessThanOrEqual(122)
  })

  test('pulsar un piloto cambia su acento y se adapta al compás', async ({ page }) => {
    await page.goto('/')
    const beats = panel(page).getByRole('group', { name: /Pulsos del compás/ }).getByRole('button')
    await expect(beats).toHaveCount(4)
    await expect(beats.nth(0)).toHaveAccessibleName('Pulso 1: acento')
    await beats.nth(1).click()
    await expect(beats.nth(1)).toHaveAccessibleName('Pulso 2: silencio')
    await beats.nth(1).click()
    await expect(beats.nth(1)).toHaveAccessibleName('Pulso 2: acento')
    await page.getByLabel(/^Compás/).selectOption('3')
    await expect(beats).toHaveCount(3)
    await expect(beats.nth(1)).toHaveAccessibleName('Pulso 2: acento')
  })

  test('escalera manual: el pase sube el tempo hasta el objetivo', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Escalera de tempo').click()
    await page.getByLabel('Inicio (BPM)').fill('70')
    await page.getByLabel('Objetivo (BPM)').fill('78')
    await page.getByLabel('Paso (BPM)').fill('5')
    await page.getByRole('button', { name: 'Activar escalera' }).click()
    await expect(display(page)).toHaveText('70')
    await expect(page.getByRole('button', { name: 'Subir 5 BPM' })).toBeDisabled()
    const pass = page.getByRole('button', { name: /Pase limpio/ })
    await pass.click()
    await expect(display(page)).toHaveText('75')
    await pass.click()
    await expect(display(page)).toHaveText('78')
    await expect(page.getByText('¡Objetivo alcanzado: 78 BPM!')).toBeVisible()
    await expect(pass).toBeDisabled()
    await page.getByRole('button', { name: 'Quitar escalera' }).click()
    await expect(page.getByRole('button', { name: 'Subir 5 BPM' })).toBeEnabled()
  })

  test('escalera por compases: sube sola mientras suena', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Escalera de tempo').click()
    await page.getByLabel('Inicio (BPM)').fill('240')
    await page.getByLabel('Objetivo (BPM)').fill('260')
    await page.getByLabel('Paso (BPM)').fill('10')
    await page.getByRole('combobox', { name: /^Subir/ }).selectOption('bars')
    await page.getByRole('spinbutton', { name: /^N compases/ }).fill('1')
    await page.getByLabel(/^Compás/).selectOption('2')
    await page.getByRole('button', { name: 'Activar escalera' }).click()
    await page.getByRole('button', { name: 'Iniciar', exact: true }).click()
    // 2/4 a 240 bpm: un compás = 0,5 s → dos escalones en ~1 s
    await expect(display(page)).toHaveText('260', { timeout: 5_000 })
    await expect(page.getByText(/Compás \d+/)).toBeVisible()
  })

  test('configuración de escalera inválida muestra el error', async ({ page }) => {
    await page.goto('/')
    await page.getByText('Escalera de tempo').click()
    await page.getByLabel('Objetivo (BPM)').fill('40')
    await expect(page.getByRole('alert')).toHaveText('El objetivo tiene que ser mayor que el inicio')
    await expect(page.getByRole('button', { name: 'Activar escalera' })).toBeDisabled()
  })
})
