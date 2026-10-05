import { expect, test } from '@playwright/test'

const LESSON = '/#/curso/cuerdas-al-aire'

test('la portada es el índice del curso y enlaza a la lección', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Curso', level: 1 })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Tronco común' })).toBeVisible()
  // Los cuatro itinerarios aparecen aunque aún no tengan lecciones
  for (const style of ['Rock / pop', 'Funk / soul / Motown', 'Blues / jazz', 'Metal / punk']) {
    await expect(page.getByRole('heading', { name: new RegExp(`^${style.replace('/', '\\/')}`) })).toBeVisible()
  }
  await page.getByRole('link', { name: /Cuerdas al aire con metrónomo/ }).click()
  await expect(page).toHaveURL(/#\/curso\/cuerdas-al-aire$/)
  await expect(page.getByRole('heading', { name: 'Cuerdas al aire con metrónomo', level: 1 })).toBeVisible()
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

test('al reproducir la partitura se ve por dónde va (cursor del compás y del pulso, y la nota marcada)', async ({ page }) => {
  await page.goto(`${LESSON}/4`)
  const tab = page.getByTestId('alphatab')
  await expect(page.getByRole('button', { name: 'Reproducir' })).toBeEnabled({ timeout: 30_000 })
  await page.getByRole('button', { name: 'Reproducir' }).click()
  await expect(page.getByRole('button', { name: 'Pausa' })).toBeVisible()

  // alphaTab crea los cursores pero no los pinta: los colores son de la aplicación (src/index.css).
  const beat = tab.locator('.at-cursor-beat')
  await expect(beat).toBeVisible()
  await expect(beat).toHaveCSS('background-color', 'rgb(154, 74, 0)')
  await expect(tab.locator('.at-cursor-bar')).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(tab.locator('.at-highlight').first()).toBeAttached()
  // La regla pinta los elementos dentro del grupo marcado, no el grupo.
  await expect(tab.locator('.at-highlight *').first()).toHaveCSS('fill', 'rgb(154, 74, 0)')

  // El cursor del pulso avanza con la reproducción.
  const x = async () => (await beat.boundingBox())?.x ?? 0
  const first = await x()
  await expect.poll(x, { timeout: 5_000 }).not.toBe(first)
  await page.getByRole('button', { name: 'Parar', exact: true }).click()
})

test('el metrónomo de la lección es el mismo que el del panel', async ({ page }) => {
  await page.goto(`${LESSON}/4`)
  await page.getByRole('button', { name: 'Metrónomo a 60 BPM' }).click()
  await expect(page.getByRole('button', { name: 'Parar metrónomo (60 BPM)' })).toBeVisible()
  await page.getByRole('link', { name: 'Metrónomo', exact: true }).click()
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
  // Los itinerarios están plegados hasta que se abren.
  await expect(metal.getByRole('heading', { name: /^1 Púa/, level: 4 })).toBeHidden()
  await metal.getByRole('button', { name: /^Metal \/ punk/ }).click()
  await expect(metal.getByRole('heading', { name: /^1 Púa/, level: 4 })).toBeVisible()
  await metal.getByRole('link', { name: /Coger la púa y tocar hacia abajo/ }).click()
  await expect(page).toHaveURL(/#\/curso\/coger-la-pua$/)
  await expect(page.getByText('Metal / punk · Módulo 1 · Púa')).toBeVisible()
})

test('un mástil de lección puede fijar la afinación (drop D) sin tocar los ajustes', async ({ page }) => {
  await page.goto('/#/curso/drop-d/3')
  await expect(page.getByText('Afinación: 4 cuerdas · drop D (D A D G)')).toBeVisible()
})

test('la reproducción de la partitura sigue el tempo de práctica', async ({ page }) => {
  await page.goto('/#/curso/punk-rapido-y-cortes/4')
  const card = page.getByTestId('exercise-punk-rapido')
  const playback = card.locator('label:has(select)', { hasText: /^Tempo/ }).locator('select')
  await expect(playback).toHaveValue('120')
  await card.getByRole('spinbutton', { name: /Tempo al que lo has tocado/ }).fill('170')
  await expect(playback).toHaveValue('170')
  await expect(playback.locator('option:checked')).toHaveText('170 BPM (tu tempo)')
})

test('los ejercicios con armonía suenan con batería y acordes, y se puede silenciar el bajo', async ({ page }) => {
  await page.goto('/#/curso/uno-cinco-ocho/4')
  const card = page.getByTestId('exercise-uno-cinco-ocho-i-iv-v')
  const bass = card.getByRole('button', { name: /^Bajo:/ })
  await expect(bass).toHaveText('Bajo: suena', { timeout: 20_000 })
  await bass.click()
  await expect(bass).toHaveText('Bajo: silenciado')
  await expect(bass).toHaveAttribute('aria-pressed', 'false')
  await expect(card.getByRole('button', { name: /^Acompañamiento:/ })).toHaveText('Acompañamiento: suena')
  // Un ejercicio sin armonía no tiene acompañamiento.
  await expect(page.getByTestId('exercise-fundamental-quinta').getByRole('button', { name: /^Bajo:/ })).toHaveCount(0)
})

test('el índice muestra la ampliación común tras el tronco común', async ({ page }) => {
  await page.goto('/')
  const extra = page.getByRole('region', { name: /^Ampliación común/ })
  await extra.getByRole('button', { name: /^Ampliación común/ }).click()
  await expect(extra.getByRole('heading', { name: /^1 Arpegios/, level: 3 })).toBeVisible()
  await extra.getByRole('link', { name: /Tríadas: mayor y menor/ }).click()
  await expect(page.getByText('Ampliación común · Módulo 1 · Arpegios')).toBeVisible()
})
