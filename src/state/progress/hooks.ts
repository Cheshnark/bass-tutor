import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { CardProgress, ExerciseProgress, LessonProgress } from './model'

const EMPTY_EXERCISES: ReadonlyMap<string, ExerciseProgress> = new Map()
const EMPTY_LESSONS: ReadonlyMap<string, LessonProgress> = new Map()
const EMPTY_CARDS: readonly CardProgress[] = []

/** Progreso de todos los ejercicios (para la cola de repaso y las rutinas). `undefined` mientras carga. */
export function useAllExercisesProgress(): readonly ExerciseProgress[] | undefined {
  return useLiveQuery(() => db.exercises.toArray(), [])
}

/** Historial de todas las tarjetas del quiz. */
export function useCardsProgress(): readonly CardProgress[] {
  return useLiveQuery(() => db.cards.toArray(), []) ?? EMPTY_CARDS
}

/** Progreso de un ejercicio (se actualiza solo al guardar intentos). */
export function useExerciseProgress(exerciseId: string): ExerciseProgress | undefined {
  return useLiveQuery(() => db.exercises.get(exerciseId), [exerciseId])
}

/** Progreso de varios ejercicios, por id. */
export function useExercisesProgress(exerciseIds: string[]): ReadonlyMap<string, ExerciseProgress> {
  const key = exerciseIds.join('|')
  const rows = useLiveQuery(() => db.exercises.bulkGet(exerciseIds), [key])
  if (!rows) return EMPTY_EXERCISES
  return new Map(rows.filter((r): r is ExerciseProgress => r !== undefined).map((r) => [r.exerciseId, r]))
}

/** Progreso de todas las lecciones, por id. */
export function useLessonsProgress(): ReadonlyMap<string, LessonProgress> {
  const rows = useLiveQuery(() => db.lessons.toArray(), [])
  if (!rows) return EMPTY_LESSONS
  return new Map(rows.map((r) => [r.lessonId, r]))
}

export function useLessonProgress(lessonId: string): LessonProgress | undefined {
  return useLiveQuery(() => db.lessons.get(lessonId), [lessonId])
}
