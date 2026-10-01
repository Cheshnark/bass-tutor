import 'fake-indexeddb/auto'
import { afterEach, describe, expect, it } from 'vitest'
import { completeLesson, exportProgress, importProgress, ProgressDb, recordAttempt, recordCardAnswer, saveLastStep } from './db'
import { applyAttempt, canCompleteLesson, HISTORY_LIMIT, parseProgressExport, reachedTarget, suggestTempo } from './model'

const exercise = { tempo: { start: 60, target: 80, step: 5 } }
const at = (bpm: number, passed: boolean, day = 1) => ({ date: `2026-10-0${day}T10:00:00.000Z`, bpm, passed })

describe('applyAttempt', () => {
  it('el primer pase limpio fija el mejor tempo y sube de caja', () => {
    const p = applyAttempt(undefined, 'ej', at(60, true))
    expect(p).toMatchObject({ exerciseId: 'ej', bestCleanBpm: 60, box: 1, lastPracticed: '2026-10-01T10:00:00.000Z' })
    expect(p.history).toHaveLength(1)
  })

  it('un intento no limpio no cambia el mejor tempo y vuelve a la caja 1', () => {
    let p = applyAttempt(undefined, 'ej', at(60, true))
    p = applyAttempt(p, 'ej', at(65, true))
    p = applyAttempt(p, 'ej', at(70, false))
    expect(p.bestCleanBpm).toBe(65)
    expect(p.box).toBe(1)
  })

  it('el mejor tempo no baja con un pase limpio más lento', () => {
    let p = applyAttempt(undefined, 'ej', at(70, true))
    p = applyAttempt(p, 'ej', at(60, true))
    expect(p.bestCleanBpm).toBe(70)
  })

  it('sin pases limpios el mejor tempo es null', () => {
    expect(applyAttempt(undefined, 'ej', at(60, false)).bestCleanBpm).toBeNull()
  })

  it('muchos pases el mismo día no suben de caja, y el historial se recorta', () => {
    let p = applyAttempt(undefined, 'ej', at(60, true))
    for (let i = 0; i < HISTORY_LIMIT + 10; i++) p = applyAttempt(p, 'ej', at(60, true))
    expect(p.box).toBe(1)
    expect(p.history).toHaveLength(HISTORY_LIMIT)
  })

  it('sube de caja al repasar en días distintos (Leitner)', () => {
    let p = applyAttempt(undefined, 'ej', at(60, true, 1))
    p = applyAttempt(p, 'ej', at(60, true, 2))
    p = applyAttempt(p, 'ej', at(60, true, 5))
    expect(p.box).toBe(3)
  })
})

describe('suggestTempo', () => {
  it('sin progreso, el tempo inicial', () => {
    expect(suggestTempo(exercise, undefined)).toBe(60)
  })

  it('el mejor limpio + un paso, sin pasar del objetivo', () => {
    expect(suggestTempo(exercise, applyAttempt(undefined, 'ej', at(65, true)))).toBe(70)
    expect(suggestTempo(exercise, applyAttempt(undefined, 'ej', at(78, true)))).toBe(80)
    expect(reachedTarget(exercise, applyAttempt(undefined, 'ej', at(80, true)))).toBe(true)
  })
})

describe('canCompleteLesson', () => {
  it('exige al menos un intento en cada ejercicio', () => {
    const progress = new Map([['a', applyAttempt(undefined, 'a', at(60, false))]])
    expect(canCompleteLesson(['a'], progress)).toBe(true)
    expect(canCompleteLesson(['a', 'b'], progress)).toBe(false)
    expect(canCompleteLesson([], progress)).toBe(true)
  })
})

describe('parseProgressExport', () => {
  const valid = {
    app: 'bass-tutor',
    version: 1,
    exportedAt: '2026-10-01T00:00:00.000Z',
    exercises: [applyAttempt(undefined, 'a', at(60, true))],
    lessons: [{ lessonId: 'x', completedAt: null, lastStep: 2, updatedAt: '2026-10-01T00:00:00.000Z' }],
  }

  it('acepta una copia válida', () => {
    expect(parseProgressExport(valid).exercises).toHaveLength(1)
  })

  it('acepta copias v1 (sin tarjetas del quiz) y v2 con tarjetas', () => {
    expect(parseProgressExport(valid).cards).toEqual([])
    const cards = [{ cardId: 'nombrar:E1:5', history: [{ date: '2026-10-01T00:00:00.000Z', ok: true, ms: 1200 }] }]
    expect(parseProgressExport({ ...valid, version: 2, cards }).cards).toEqual(cards)
    expect(() => parseProgressExport({ ...valid, version: 2 })).toThrow('quiz dañados')
    expect(() => parseProgressExport({ ...valid, version: 2, cards: [{ cardId: 'x', history: [{ ok: 1 }] }] })).toThrow(
      'quiz dañados',
    )
  })

  it('rechaza otros ficheros, versiones o datos dañados con mensajes claros', () => {
    expect(() => parseProgressExport({ foo: 1 })).toThrow('no es una copia de progreso')
    expect(() => parseProgressExport({ ...valid, version: 99 })).toThrow('Versión de copia no compatible')
    expect(() => parseProgressExport({ ...valid, exercises: [{ exerciseId: 'a' }] })).toThrow('ejercicios dañados')
    expect(() => parseProgressExport({ ...valid, lessons: [{ lessonId: 'x' }] })).toThrow('lecciones dañados')
  })
})

describe('ProgressDb (IndexedDB simulado)', () => {
  let database = new ProgressDb(`test-${Math.random()}`)

  afterEach(async () => {
    await database.delete()
    database = new ProgressDb(`test-${Math.random()}`)
  })

  it('registra intentos y guarda el mejor tempo limpio', async () => {
    await recordAttempt('ej', at(60, true), database)
    const p = await recordAttempt('ej', at(65, false), database)
    expect(p.bestCleanBpm).toBe(60)
    expect((await database.exercises.get('ej'))?.history).toHaveLength(2)
  })

  it('guarda las respuestas del quiz por tarjeta', async () => {
    await recordCardAnswer('nombrar:E1:5', { date: '2026-10-01T10:00:00.000Z', ok: false, ms: 3000 }, database)
    const card = await recordCardAnswer('nombrar:E1:5', { date: '2026-10-01T10:01:00.000Z', ok: true, ms: 1500 }, database)
    expect(card.history.map((a) => a.ok)).toEqual([false, true])
  })

  it('completar una lección conserva la primera fecha y el último paso', async () => {
    await saveLastStep('lec', 3, database)
    const first = await completeLesson('lec', database)
    const again = await completeLesson('lec', database)
    expect(again.completedAt).toBe(first.completedAt)
    expect(again.lastStep).toBe(3)
  })

  it('exportar e importar reproduce el progreso y valida antes de borrar', async () => {
    await recordAttempt('ej', at(70, true), database)
    await completeLesson('lec', database)
    await recordCardAnswer('nombrar:E1:5', { date: '2026-10-01T10:00:00.000Z', ok: true, ms: 900 }, database)
    const copy = await exportProgress(database)

    const other = new ProgressDb(`test-${Math.random()}`)
    await recordAttempt('otro', at(50, true), other)
    await expect(importProgress({ app: 'nada' }, other)).rejects.toThrow()
    expect(await other.exercises.count()).toBe(1) // la importación fallida no borra nada
    await importProgress(JSON.parse(JSON.stringify(copy)), other)
    expect((await other.exercises.toArray()).map((e) => e.exerciseId)).toEqual(['ej'])
    expect((await other.lessons.get('lec'))?.completedAt).toBeTruthy()
    expect(await other.cards.count()).toBe(1)
    await other.delete()
  })
})
