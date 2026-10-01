import { expect, test, type Page } from '@playwright/test'

/** Siembra historial de ejercicios en IndexedDB (días hacia atrás desde hoy) y recarga. */
async function seedHistory(page: Page, rows: { id: string; daysAgo: number[]; passed?: boolean }[]) {
  await page.goto('/#/practica')
  await expect(page.getByRole('heading', { name: 'Práctica', level: 2 })).toBeVisible()
  await page.evaluate(async (data) => {
    const iso = (n: number) => {
      const d = new Date()
      d.setDate(d.getDate() - n)
      d.setHours(18, 0, 0, 0)
      return d.toISOString()
    }
    const records = data.map(({ id, daysAgo, passed = true }) => {
      const history = daysAgo.map((n) => ({ date: iso(n), bpm: 60, passed }))
      return { exerciseId: id, bestCleanBpm: passed ? 60 : null, lastPracticed: history[history.length - 1].date, box: 1, history }
    })
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.open('bass-tutor')
      req.onerror = () => reject(req.error)
      req.onsuccess = () => {
        const tx = req.result.transaction('exercises', 'readwrite')
        for (const r of records) tx.objectStore('exercises').put(r)
        tx.oncomplete = () => {
          req.result.close()
          resolve()
        }
        tx.onerror = () => reject(tx.error)
      }
    })
  }, rows)
  await page.reload()
}

test.describe('práctica', () => {
  test('sin historial, invita a empezar el curso', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Práctica' }).click()
    await expect(page).toHaveURL(/#\/practica$/)
    await expect(page.getByText('Aún no has practicado ningún ejercicio.')).toBeVisible()
    await page.getByRole('link', { name: '15 min' }).click()
    await expect(page.getByText('Para montar una rutina hace falta')).toBeVisible()
  })

  test('la cola de hoy sale del historial y permite practicar', async ({ page }) => {
    await seedHistory(page, [
      { id: 'cuerdas-al-aire-negras', daysAgo: [10, 9] }, // caja 2: tocaba hace 6 días
      { id: 'alternancia-corcheas', daysAgo: [3] }, // tocaba hace 2 días
      { id: 'cromatico-primera-posicion', daysAgo: [0] }, // practicado hoy: no toca
    ])
    const items = page.locator('.queue-item')
    await expect(items).toHaveCount(2)
    await expect(items.nth(0)).toContainText('Cuerdas al aire en negras')
    await expect(items.nth(0)).toContainText('tocaba hace 6 días')
    await expect(items.nth(1)).toContainText('Alternancia en corcheas')
    await items.nth(0).getByRole('button', { name: 'Practicar' }).click()
    await expect(page.getByTestId('exercise-cuerdas-al-aire-negras')).toBeVisible()
  })

  test('la rutina alterna bloques y usa los ejercicios practicados', async ({ page }) => {
    await seedHistory(page, [
      { id: 'cromatico-primera-posicion', daysAgo: [4] },
      { id: 'alternancia-corcheas', daysAgo: [3] },
      { id: 'fundamentales-i-iv-v', daysAgo: [2] },
    ])
    await page.getByRole('link', { name: '15 min' }).click()
    const blocks = page.getByRole('list', { name: 'Bloques de la rutina' }).getByRole('listitem')
    await expect(blocks).toHaveText(['Calentamiento · 3 min', 'Técnica · 4 min', 'Mástil · 3 min', 'Groove y líneas · 5 min'])
    await expect(page.getByTestId('routine-time')).toHaveText('3:00')
    await expect(page.getByTestId('exercise-cromatico-primera-posicion')).toBeVisible()
    await page.getByRole('button', { name: 'Siguiente bloque' }).click()
    await expect(page.getByTestId('exercise-alternancia-corcheas')).toBeVisible()
    await page.getByRole('button', { name: 'Siguiente bloque' }).click()
    await expect(page.getByRole('button', { name: 'Empezar ronda' })).toBeVisible()
  })

  test('quiz: una respuesta correcta se guarda para el repaso', async ({ page }) => {
    await page.goto('/#/practica/quiz')
    await page.getByLabel('Nombrar').check()
    await page.getByRole('button', { name: /Empezar ronda/ }).click()
    await expect(page.getByTestId('quiz-prompt')).toContainText('¿Qué nota es?')

    // La casilla marcada lleva la nota en data-note (no en su nombre accesible).
    const note = await page.locator('.fb-note--ask').getAttribute('data-note')
    const pc = (note ?? '').replace(/\d+$/, '').replace('#', '♯').replace('b', '♭')
    const name = pc.length === 1 ? new RegExp(`^${pc}$`) : new RegExp(`^${pc}/|/${pc}$`)
    await page.getByRole('button', { name }).click()
    await expect(page.getByTestId('quiz-feedback')).toContainText('¡Bien!')
    await expect(page.getByRole('button', { name: 'Siguiente' })).toBeFocused()

    const saved = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          const req = indexedDB.open('bass-tutor')
          req.onsuccess = () => {
            const count = req.result.transaction('cards').objectStore('cards').count()
            count.onsuccess = () => resolve(count.result)
          }
        }),
    )
    expect(saved).toBe(1)
  })
})

test('el índice del curso avisa de los repasos pendientes', async ({ page }) => {
  await seedHistory(page, [{ id: 'alternancia-corcheas', daysAgo: [3] }])
  await page.goto('/#/curso')
  await expect(page.getByTestId('practice-reminder')).toHaveText(/Hoy tienes 1 ejercicio para repasar/)
  await page.getByRole('link', { name: 'Ir a Práctica' }).click()
  await expect(page).toHaveURL(/#\/practica$/)
})
