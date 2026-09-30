import { expect, test, type Page } from '@playwright/test'

const LESSON = '/#/curso/cuerdas-al-aire'
const STEPS = ['Objetivo', 'Por qué importa', 'Cómo se hace', 'Ejercicio', 'Errores comunes', 'Autoevaluación']

const stepHeadings = (page: Page) => page.getByTestId('lesson-body').getByRole('heading', { level: 2 })

test.describe('siguiendo la clase', () => {
  test('empieza en el paso 1 y muestra un solo paso', async ({ page }) => {
    await page.goto(LESSON)
    await expect(page.getByText('Paso 1 de 6')).toBeVisible()
    await expect(stepHeadings(page)).toHaveText(['Objetivo'])
    await expect(page.getByRole('link', { name: 'Anterior' })).toHaveCount(0)
  })

  test('Siguiente y Anterior cambian de paso y la URL', async ({ page }) => {
    await page.goto(LESSON)
    await page.getByRole('link', { name: 'Siguiente →' }).click()
    await expect(page).toHaveURL(/cuerdas-al-aire\/2$/)
    await expect(stepHeadings(page)).toHaveText(['Por qué importa'])
    await expect(page.getByText('Paso 2 de 6')).toBeVisible()
    await page.getByRole('link', { name: '← Anterior' }).click()
    await expect(stepHeadings(page)).toHaveText(['Objetivo'])
    // El botón "atrás" del navegador vuelve al paso anterior
    await page.getByRole('link', { name: 'Siguiente →' }).click()
    await page.getByRole('link', { name: 'Siguiente →' }).click()
    await page.goBack()
    await expect(stepHeadings(page)).toHaveText(['Por qué importa'])
  })

  test('teclado y pedal: flechas y AvPág/RePág', async ({ page }) => {
    await page.goto(LESSON)
    await expect(stepHeadings(page)).toHaveText(['Objetivo'])
    await page.keyboard.press('ArrowRight')
    await expect(stepHeadings(page)).toHaveText(['Por qué importa'])
    await page.keyboard.press('PageDown')
    await expect(stepHeadings(page)).toHaveText(['Cómo se hace'])
    // Dos pulsaciones seguidas (como un pedal) sin esperar entre ellas
    await page.keyboard.press('PageUp')
    await page.keyboard.press('ArrowLeft')
    await expect(stepHeadings(page)).toHaveText(['Objetivo'])
    // En el primer paso, "anterior" no hace nada
    await page.keyboard.press('ArrowLeft')
    await expect(page).toHaveURL(/cuerdas-al-aire(\/1)?$/)
  })

  test('el título del paso recibe el foco al cambiar (lectores de pantalla)', async ({ page }) => {
    await page.goto(`${LESSON}/2`)
    await expect(stepHeadings(page)).toHaveText(['Por qué importa'])
    await page.keyboard.press('ArrowRight')
    await expect(stepHeadings(page)).toBeFocused()
    await expect(stepHeadings(page)).toHaveText(['Cómo se hace'])
  })

  test('la barra de progreso lleva a cualquier paso', async ({ page }) => {
    await page.goto(LESSON)
    await page.getByRole('link', { name: 'Paso 5: Errores comunes' }).click()
    await expect(stepHeadings(page)).toHaveText(['Errores comunes'])
    await expect(page.getByRole('link', { name: 'Paso 5: Errores comunes' })).toHaveAttribute('aria-current', 'step')
  })

  test('los componentes del paso se montan al llegar a él', async ({ page }) => {
    // Lección "equipo-y-afinacion": paso 5 con <Fretboard/>, paso 6 con <Exercise/>
    await page.goto('/#/curso/equipo-y-afinacion/5')
    await expect(stepHeadings(page)).toHaveText(['Comprobar con el traste 5'])
    await expect(page.getByTestId('lesson-body').getByTestId('fretboard')).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(page.getByTestId('exercise-afinar-y-escuchar')).toBeVisible()
    await expect(page.getByTestId('lesson-body').getByTestId('fretboard')).toHaveCount(0)
  })

  test('último paso: lleva a la lección siguiente del mismo itinerario', async ({ page }) => {
    await page.goto(`${LESSON}/99`)
    await expect(page.getByText('Paso 6 de 6')).toBeVisible()
    await expect(stepHeadings(page)).toHaveText(['Autoevaluación'])
    await page.getByRole('link', { name: 'Siguiente lección →' }).click()
    await expect(page).toHaveURL(/#\/curso\/pulsacion-alterna$/)
  })

  test('al acabar el tronco común invita a elegir itinerario', async ({ page }) => {
    await page.goto('/#/curso/apagado-mano-derecha/99')
    await expect(stepHeadings(page)).toHaveText(['Autoevaluación'])
    await page.getByRole('link', { name: 'Elige tu itinerario →' }).click()
    await expect(page.getByRole('heading', { name: 'Itinerarios por estilo' })).toBeVisible()
  })

  test('se puede pasar a la lección completa y volver', async ({ page }) => {
    await page.goto(`${LESSON}/2`)
    await page.getByRole('button', { name: 'Ver la lección completa' }).click()
    await expect(stepHeadings(page)).toHaveText(STEPS)
    await expect(page.getByText(/Paso \d de 6/)).toHaveCount(0)
    await page.getByRole('button', { name: 'Seguir la clase paso a paso' }).click()
    await expect(stepHeadings(page)).toHaveText(['Por qué importa'])
  })

  test('el metrónomo sigue sonando al cambiar de paso', async ({ page }) => {
    await page.goto(`${LESSON}/4`)
    await page.getByRole('button', { name: 'Metrónomo a 60 BPM' }).click()
    await expect(page.getByRole('button', { name: 'Parar metrónomo (60 BPM)' })).toBeVisible()
    await page.keyboard.press('ArrowRight')
    await expect(stepHeadings(page)).toHaveText(['Errores comunes'])
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByRole('button', { name: 'Parar metrónomo (60 BPM)' })).toBeVisible()
  })
})
