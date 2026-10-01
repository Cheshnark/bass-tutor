import { expect, test } from '@playwright/test'

const LESSON = '/#/curso/cuerdas-al-aire'

test('la portada es el índice del curso y enlaza a la lección', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Curso', level: 2 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tronco común' })).toBeVisible()
  // Los cuatro itinerarios aparecen aunque aún no tengan lecciones
  for (const style of ['Rock / pop', 'Funk / soul / Motown', 'Blues / jazz', 'Metal / punk']) {
    await expect(page.getByRole('heading', { name: new RegExp(`^${style.replace('/', '\\/')}`) })).toBeVisible()
  }
  await page.getByRole('link', { name: /Cuerdas al aire con metrónomo/ }).click()
  await expect(page).toHaveURL(/#\/curso\/cuerdas-al-aire$/)
  await expect(page.getByRole('heading', { name: 'Cuerdas al aire con metrónomo', level: 2 })).toBeVisible()
})

test('la lección renderiza sus pasos y componentes sin errores', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(LESSON)
  await page.getByRole('button', { name: 'Ver la lección completa' }).click()
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
  // <Video />: enlace externo que se abre en otra pestaña
  const video = body.getByRole('link', { name: /Míralo en vídeo/ })
  await expect(video).toHaveCount(1)
  await expect(video).toHaveAttribute('target', '_blank')
  await expect(video).toHaveAttribute('href', /^https:\/\/www\.youtube\.com\//)
  // <Exercise />: tarjeta con criterios
  const exercise = body.getByTestId('exercise-cuerdas-al-aire-negras')
  await expect(exercise.getByRole('checkbox')).toHaveCount(4)
  expect(errors).toEqual([])
})

test('alphaTab renderiza el ejercicio y carga el soundfont', async ({ page }) => {
  await page.goto(`${LESSON}/4`)
  const tab = page.getByTestId('alphatab')
  await expect(tab).toHaveAttribute('data-status', 'listo', { timeout: 20_000 })
  await expect(tab.locator('svg').first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeEnabled({ timeout: 30_000 })
})

test('el metrónomo de la lección es el mismo que el del panel', async ({ page }) => {
  await page.goto(`${LESSON}/4`)
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

test('el itinerario metal/punk numera sus módulos desde 1 y enlaza a sus lecciones', async ({ page }) => {
  await page.goto('/')
  const metal = page.getByRole('region', { name: /^Metal \/ punk/ })
  await expect(metal.getByRole('heading', { name: /^1 Púa/, level: 5 })).toBeVisible()
  await metal.getByRole('link', { name: /Coger la púa y tocar hacia abajo/ }).click()
  await expect(page).toHaveURL(/#\/curso\/coger-la-pua$/)
  await expect(page.getByText('Metal / punk · Módulo 1 · Púa')).toBeVisible()
})
