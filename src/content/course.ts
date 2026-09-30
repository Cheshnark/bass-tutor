import data from 'virtual:course'
import type { Course, Exercise, Lesson, Module } from './schema'
import type { TrackId } from './tracks'

/** Curso completo, validado en build por el plugin `virtual:course` (no hace falta revalidar aquí). */
export const course = data as Course

const lessonsById = new Map(course.lessons.map((l) => [l.id, l]))
const exercisesById = new Map(course.exercises.map((e) => [e.id, e]))

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id)
}

export function getExercise(id: string): Exercise | undefined {
  return exercisesById.get(id)
}

export function lessonsOf(module: Module): Lesson[] {
  return module.lessons.map((id) => lessonsById.get(id)).filter((l): l is Lesson => l !== undefined)
}

const moduleById = new Map(course.modules.map((m) => [m.id, m]))

export function trackOf(lesson: Lesson): TrackId {
  return moduleById.get(lesson.moduleId)?.track ?? 'comun'
}

export function modulesOf(track: TrackId): Module[] {
  return course.modules.filter((m) => m.track === track)
}

/**
 * Lecciones anterior y siguiente dentro del mismo itinerario (no salta del tronco común
 * a un estilo: al acabar el tronco común, el alumno elige itinerario en el índice).
 */
export function neighbours(id: string): { previous?: Lesson; next?: Lesson } {
  const lesson = lessonsById.get(id)
  if (!lesson) return {}
  const sameTrack = course.lessons.filter((l) => trackOf(l) === trackOf(lesson))
  const index = sameTrack.findIndex((l) => l.id === id)
  return { previous: sameTrack[index - 1], next: sameTrack[index + 1] }
}
