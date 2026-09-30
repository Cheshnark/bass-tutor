import { expect, test } from '@playwright/test'

const LESSON = '/#/curso/cuerdas-al-aire'

test('la portada es el índice del curso y enlaza a la lección', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Curso', level: 2 })).toBeVisible()
  await page.getByRole('link', { name: /Cuerdas al aire con metrónomo/ }).click()
  await expect(page).toHaveURL(/#\/curso\/cuerdas-al-aire$/)
  await expect(page.getByRole('heading', { name: 'Cuerdas al aire con metrónomo', level: 2 })).toBeVisible()
})

test('la lección renderiza sus pasos y componentes sin errores', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(LESSON)
  const body = page.getByTestId('lesson-body')
  await expect(body.getByRole('heading', { level: 2 })).toHaveText([
    'Objetivo',
    'Por qué importa',
    'Cómo se hace',
    'Ejercicio',
    'Errores comunes',
    'Autoevaluación',
  ])
  // El frontmatter no se pinta como texto
  await expect(body).not.toContainText('durationMin')
  // <Fretboard mode="notes" frets={[0, 5]} />: 4 cuerdas × 6 casillas
  await expect(body.getByTestId('fretboard').locator('.fb-note')).toHaveCount(4 * 6)
  // <Exercise />: tarjeta con criterios
  const exercise = body.getByTestId('exercise-cuerdas-al-aire-negras')
  await expect(exercise.getByRole('checkbox')).toHaveCount(4)
  expect(errors).toEqual([])
})

test('alphaTab renderiza el ejercicio y carga el soundfont', async ({ page }) => {
  await page.goto(LESSON)
  const tab = page.getByTestId('alphatab')
  await expect(tab).toHaveAttribute('data-status', 'listo', { timeout: 20_000 })
  await expect(tab.locator('svg').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeEnabled({ timeout: 30_000 })
})

test('el metrónomo de la lección es el mismo que el del panel', async ({ page }) => {
  await page.goto(LESSON)
  await page.getByRole('button', { name: 'Metrónomo a 60 BPM' }).click()
  await expect(page.getByRole('button', { name: 'Parar metrónomo (60 BPM)' })).toBeVisible()
  await page.getByRole('link', { name: 'Metrónomo' }).click()
  await expect(page.getByTestId('bpm-display')).toHaveText('60')
  await expect(page.locator('.met-start')).toHaveText('Parar')
  await expect(page.locator('.met-beat--on')).toHaveCount(1, { timeout: 5_000 })
})

test('una lección inexistente muestra un aviso', async ({ page }) => {
  await page.goto('/#/curso/no-existe')
  await expect(page.getByRole('heading', { name: 'Lección no encontrada' })).toBeVisible()
})
