import { readFileSync } from 'node:fs'
import { expect, test, type Page } from '@playwright/test'

const EXERCISE_STEP = '/#/curso/cuerdas-al-aire/4'
const LAST_STEP = '/#/curso/cuerdas-al-aire/6'

async function saveCleanPass(page: Page) {
  const card = page.getByTestId('exercise-cuerdas-al-aire-negras')
  // locator.all() no espera: primero, que la tarjeta esté pintada con sus 4 criterios.
  await expect(card.getByRole('checkbox')).toHaveCount(4)
  for (const box of await card.getByRole('checkbox').all()) await box.check()
  await card.getByRole('button', { name: 'Guardar pase limpio' }).click()
  await expect(card.getByTestId('attempt-message')).toHaveText('Pase limpio guardado a 60 BPM.')
  return card
}

test.describe('progreso', () => {
  test('un pase limpio se guarda, sobrevive a la recarga y sube el tempo sugerido', async ({ page }) => {
    await page.goto(EXERCISE_STEP)
    const card = await saveCleanPass(page)
    await expect(card.getByTestId('exercise-progress')).toHaveText(/Mejor tempo limpio: 60 BPM · 1 intento/)
    await expect(card.getByRole('button', { name: 'Metrónomo a 64 BPM' })).toBeVisible()

    await page.reload()
    await expect(card.getByTestId('exercise-progress')).toHaveText(/Mejor tempo limpio: 60 BPM · 1 intento/)
  })

  test('un intento sin todos los criterios no cuenta como pase limpio', async ({ page }) => {
    await page.goto(EXERCISE_STEP)
    const card = page.getByTestId('exercise-cuerdas-al-aire-negras')
    await card.getByRole('checkbox').first().check()
    await card.getByRole('button', { name: 'Guardar intento' }).click()
    await expect(card.getByTestId('exercise-progress')).toHaveText(/Mejor tempo limpio: — · 1 intento/)
  })

  test('la lección solo se completa tras registrar un intento, y el índice lo refleja', async ({ page }) => {
    await page.goto(LAST_STEP)
    await expect(page.getByTestId('lesson-completion')).toContainText('guarda al menos un intento')
    await expect(page.getByRole('button', { name: 'Completar lección' })).toHaveCount(0)

    await page.goto(EXERCISE_STEP)
    await saveCleanPass(page)
    await page.goto(LAST_STEP)
    await page.getByRole('button', { name: 'Completar lección' }).click()
    await expect(page.getByTestId('lesson-completion')).toContainText('Lección completada')

    await page.goto('/#/curso')
    await expect(page.getByLabel('1 de 3 lecciones completadas')).toBeVisible()
    await expect(page.getByRole('link', { name: /Cuerdas al aire con metrónomo/ })).toContainText('✓')
  })

  test('el índice ofrece retomar la lección donde se dejó', async ({ page }) => {
    await page.goto('/#/curso/postura-y-salud/3')
    await expect(page.getByText('Paso 3 de')).toBeVisible()
    await page.goto('/#/curso')
    const link = page.getByRole('link', { name: /Postura, correa/ })
    await expect(link).toContainText('Sigue en el paso 3')
    await expect(link).toHaveAttribute('href', '#/curso/postura-y-salud/3')
  })

  test('exportar e importar la copia de progreso', async ({ page }, testInfo) => {
    await page.goto(EXERCISE_STEP)
    await saveCleanPass(page)
    await page.goto('/#/curso')

    const downloadPromise = page.waitForEvent('download')
    await page.getByRole('button', { name: 'Exportar copia' }).click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/^bass-tutor-progreso-\d{4}-\d{2}-\d{2}\.json$/)
    const path = testInfo.outputPath('copia.json')
    await download.saveAs(path)
    const copy = JSON.parse(readFileSync(path, 'utf8'))
    expect(copy).toMatchObject({ app: 'bass-tutor', version: 1 })
    expect(copy.exercises[0]).toMatchObject({ exerciseId: 'cuerdas-al-aire-negras', bestCleanBpm: 60 })

    // Importar un fichero inválido no borra nada
    await page.getByTestId('import-progress').setInputFiles({
      name: 'otra.json',
      mimeType: 'application/json',
      buffer: Buffer.from('{"foo": 1}'),
    })
    await expect(page.getByTestId('progress-message')).toHaveText('El fichero no es una copia de progreso de Bass Tutor.')

    // Importar la copia (se acepta el aviso de sustitución)
    page.once('dialog', (dialog) => void dialog.accept())
    await page.getByTestId('import-progress').setInputFiles(path)
    await expect(page.getByTestId('progress-message')).toHaveText('Progreso importado (1 ejercicio, 1 lección).')
  })
})

test('los ajustes y el metrónomo se recuerdan al recargar', async ({ page }) => {
  await page.goto('/#/mastil')
  await page.getByLabel(/^Nombres/).selectOption('latina')
  await page.getByRole('link', { name: 'Metrónomo' }).click()
  await page.getByRole('button', { name: 'Subir 5 BPM' }).click()
  await expect(page.getByTestId('bpm-display')).toHaveText('85')

  await page.reload()
  await expect(page.getByTestId('bpm-display')).toHaveText('85')
  await page.getByRole('link', { name: 'Mástil' }).click()
  await expect(page.getByLabel(/^Nombres/)).toHaveValue('latina')
})
