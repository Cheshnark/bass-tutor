/**
 * Progreso del alumno en IndexedDB (Dexie). Se guarda solo en este dispositivo:
 * para llevarlo a otro, exportar/importar (ver exportProgress/importProgress).
 */
import Dexie, { type Table } from 'dexie'
import {
  applyAttempt,
  applyCardAnswer,
  EXPORT_VERSION,
  parseProgressExport,
  type Attempt,
  type CardAnswer,
  type CardProgress,
  type ExerciseProgress,
  type LessonProgress,
  type ProgressExport,
} from './model'

export class ProgressDb extends Dexie {
  exercises!: Table<ExerciseProgress, string>
  lessons!: Table<LessonProgress, string>
  cards!: Table<CardProgress, string>

  constructor(name = 'bass-tutor') {
    super(name)
    this.version(1).stores({ exercises: 'exerciseId', lessons: 'lessonId' })
    // v2: tarjetas del quiz de mástil (Fase 4). Dexie migra solo: las tablas anteriores no cambian.
    this.version(2).stores({ exercises: 'exerciseId', lessons: 'lessonId', cards: 'cardId' })
  }
}

export const db = new ProgressDb()

export async function recordAttempt(exerciseId: string, attempt: Attempt, database: ProgressDb = db): Promise<ExerciseProgress> {
  return database.transaction('rw', database.exercises, async () => {
    const next = applyAttempt(await database.exercises.get(exerciseId), exerciseId, attempt)
    await database.exercises.put(next)
    return next
  })
}

export async function recordCardAnswer(cardId: string, answer: CardAnswer, database: ProgressDb = db): Promise<CardProgress> {
  return database.transaction('rw', database.cards, async () => {
    const next = applyCardAnswer(await database.cards.get(cardId), cardId, answer)
    await database.cards.put(next)
    return next
  })
}

async function upsertLesson(
  lessonId: string,
  change: (prev: LessonProgress) => LessonProgress,
  database: ProgressDb,
): Promise<LessonProgress> {
  return database.transaction('rw', database.lessons, async () => {
    const prev = (await database.lessons.get(lessonId)) ?? { lessonId, completedAt: null, lastStep: 0, updatedAt: '' }
    const next = { ...change(prev), updatedAt: new Date().toISOString() }
    await database.lessons.put(next)
    return next
  })
}

export function completeLesson(lessonId: string, database: ProgressDb = db): Promise<LessonProgress> {
  return upsertLesson(lessonId, (prev) => ({ ...prev, completedAt: prev.completedAt ?? new Date().toISOString() }), database)
}

export function saveLastStep(lessonId: string, step: number, database: ProgressDb = db): Promise<LessonProgress> {
  return upsertLesson(lessonId, (prev) => ({ ...prev, lastStep: step }), database)
}

export async function exportProgress(database: ProgressDb = db): Promise<ProgressExport> {
  return {
    app: 'bass-tutor',
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    exercises: await database.exercises.toArray(),
    lessons: await database.lessons.toArray(),
    cards: await database.cards.toArray(),
  }
}

/** Sustituye todo el progreso por el de la copia (validada antes de tocar nada). */
export async function importProgress(data: unknown, database: ProgressDb = db): Promise<ProgressExport> {
  const parsed = parseProgressExport(data)
  await database.transaction('rw', database.exercises, database.lessons, database.cards, async () => {
    await database.exercises.clear()
    await database.lessons.clear()
    await database.cards.clear()
    await database.exercises.bulkPut(parsed.exercises)
    await database.lessons.bulkPut(parsed.lessons)
    await database.cards.bulkPut(parsed.cards)
  })
  return parsed
}

export type PersistenceStatus = 'persistente' | 'puede-borrarse' | 'no-disponible'

/**
 * Pide al navegador que no borre los datos si falta espacio (Storage API).
 * En iOS se concede según heurísticas (p. ej., app instalada en la pantalla de inicio).
 */
export async function requestPersistence(): Promise<PersistenceStatus> {
  if (typeof navigator === 'undefined' || !navigator.storage?.persist) return 'no-disponible'
  try {
    if (await navigator.storage.persisted()) return 'persistente'
    return (await navigator.storage.persist()) ? 'persistente' : 'puede-borrarse'
  } catch {
    return 'no-disponible'
  }
}
