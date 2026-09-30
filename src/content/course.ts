import data from 'virtual:course'
import type { Course, Exercise, Lesson, Module } from './schema'

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

/** Lecciones anterior y siguiente en el orden del curso. */
export function neighbours(id: string): { previous?: Lesson; next?: Lesson } {
  const index = course.lessons.findIndex((l) => l.id === id)
  return { previous: course.lessons[index - 1], next: index >= 0 ? course.lessons[index + 1] : undefined }
}
