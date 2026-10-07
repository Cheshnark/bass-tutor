import data from 'virtual:course'
import { withBacking } from './backing'
import type { ExerciseMeta, Lesson, Module, RuntimeCourse } from './schema'
import type { TrackId } from './tracks'

/** Curso completo, validado en build por el plugin `virtual:course` (no hace falta revalidar aquí). */
export const course = data as RuntimeCourse

const lessonsById = new Map(course.lessons.map((l) => [l.id, l]))
const exercisesById = new Map(course.exercises.map((e) => [e.id, e]))

export function getLesson(id: string): Lesson | undefined {
  return lessonsById.get(id)
}

export function getExercise(id: string): ExerciseMeta | undefined {
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
 * Número de módulo que ve el alumno. En el tronco común, el de la carpeta (0–5); en un itinerario, su
 * posición dentro de él (1, 2…), porque las carpetas usan un bloque por itinerario (40-… en metal/punk).
 */
export function moduleNumber(module: Module): number {
  if (module.track === 'comun') return module.order
  return modulesOf(module.track).indexOf(module) + 1
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

// Primera lección (en el orden del curso) que usa cada ejercicio: da el contexto y los intervalos de repaso.
const lessonByExercise = new Map<string, Lesson>()
for (const lesson of course.lessons) {
  for (const exerciseId of lesson.exercises) if (!lessonByExercise.has(exerciseId)) lessonByExercise.set(exerciseId, lesson)
}

export function lessonOfExercise(exerciseId: string): Lesson | undefined {
  return lessonByExercise.get(exerciseId)
}

/** Intervalos de repaso (días) de un ejercicio: los de su lección. */
export function reviewDaysOf(exerciseId: string): number[] | undefined {
  return lessonByExercise.get(exerciseId)?.review.afterDays
}

// alphaTex que suena: el del ejercicio más batería y acordes si tiene armonía (src/content/backing.ts).
// Los textos van en un chunk aparte (`virtual:course-tex`) que se descarga al abrir la primera partitura.
const playable = new Map<string, Promise<string>>()

export function playableTex(exercise: ExerciseMeta): Promise<string> {
  let tex = playable.get(exercise.id)
  if (tex === undefined) {
    const request = import('virtual:course-tex').then(({ default: texById }) =>
      withBacking(texById[exercise.id], {
        harmony: exercise.backing?.harmony,
        timeSignature: exercise.timeSignature,
        feel: exercise.feel,
      }),
    )
    // Si la descarga falla (red caída antes de cachear), el siguiente intento vuelve a pedirlo.
    request.catch(() => playable.delete(exercise.id))
    playable.set(exercise.id, request)
    tex = request
  }
  return tex
}
