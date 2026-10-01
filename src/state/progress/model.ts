/**
 * Modelo del progreso del alumno (docs/research.md §7): lógica pura, sin IndexedDB.
 * La persistencia está en db.ts.
 */
import { MAX_BOX, schedule } from '../../practice/leitner'

export interface Attempt {
  /** ISO 8601. */
  date: string
  bpm: number
  /** true si cumplió todos los criterios de autoevaluación ("pase limpio"). */
  passed: boolean
}

export interface ExerciseProgress {
  exerciseId: string
  /** Mejor tempo con pase limpio, o null si aún no hay ninguno. */
  bestCleanBpm: number | null
  lastPracticed: string
  /**
   * Caja de Leitner (1–5) con los intervalos por defecto. Es una copia informativa: el repaso
   * la recalcula siempre del historial con los intervalos de la lección (src/practice/leitner.ts).
   */
  box: number
  history: Attempt[]
}

export interface LessonProgress {
  lessonId: string
  completedAt: string | null
  /** Último paso visto (0-based), para retomar la lección. */
  lastStep: number
  updatedAt: string
}

/** Respuesta a una tarjeta del quiz de mástil. */
export interface CardAnswer {
  /** ISO 8601. */
  date: string
  ok: boolean
  /** Tiempo de respuesta. */
  ms: number
}

/** Historial de una tarjeta del quiz de mástil (src/practice/quiz.ts). */
export interface CardProgress {
  cardId: string
  history: CardAnswer[]
}

export const CARD_HISTORY_LIMIT = 50

export function applyCardAnswer(prev: CardProgress | undefined, cardId: string, answer: CardAnswer): CardProgress {
  return { cardId, history: [...(prev?.history ?? []), answer].slice(-CARD_HISTORY_LIMIT) }
}

/** Lo mínimo de un ejercicio que necesita esta lógica (evita depender del esquema de contenido). */
export interface ExerciseTempo {
  tempo: { start: number; target: number; step: number }
}

export const HISTORY_LIMIT = 200
export { MAX_BOX }

/** Aplica un intento al progreso previo (o crea el primero). */
export function applyAttempt(prev: ExerciseProgress | undefined, exerciseId: string, attempt: Attempt): ExerciseProgress {
  const previousBest = prev?.bestCleanBpm ?? null
  const bestCleanBpm = attempt.passed ? Math.max(previousBest ?? 0, attempt.bpm) : previousBest
  const history = [...(prev?.history ?? []), attempt].slice(-HISTORY_LIMIT)
  const box = schedule(attemptOutcomes(history))?.box ?? 1
  return { exerciseId, bestCleanBpm, lastPracticed: attempt.date, box, history }
}

/** Intentos como resultados para el repaso espaciado: un pase limpio es un acierto. */
export function attemptOutcomes(history: readonly Attempt[]): { date: string; ok: boolean }[] {
  return history.map((a) => ({ date: a.date, ok: a.passed }))
}

/** Tempo recomendado para el próximo intento: el mejor limpio + un paso, sin pasar del objetivo. */
export function suggestTempo(exercise: ExerciseTempo, progress: ExerciseProgress | undefined): number {
  const { start, target, step } = exercise.tempo
  const best = progress?.bestCleanBpm
  if (best === null || best === undefined) return start
  return Math.min(Math.max(best + step, start), target)
}

export function reachedTarget(exercise: ExerciseTempo, progress: ExerciseProgress | undefined): boolean {
  return (progress?.bestCleanBpm ?? 0) >= exercise.tempo.target
}

/** Una lección se puede completar cuando cada uno de sus ejercicios tiene al menos un intento registrado. */
export function canCompleteLesson(exerciseIds: string[], progress: ReadonlyMap<string, ExerciseProgress>): boolean {
  return exerciseIds.every((id) => (progress.get(id)?.history.length ?? 0) > 0)
}

// ── Exportar / importar ─────────────────────────────────────────────────────

/** v2 añade las tarjetas del quiz; se siguen aceptando copias v1 (sin tarjetas). */
export const EXPORT_VERSION = 2

export interface ProgressExport {
  app: 'bass-tutor'
  version: typeof EXPORT_VERSION
  exportedAt: string
  exercises: ExerciseProgress[]
  lessons: LessonProgress[]
  cards: CardProgress[]
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isString = (v: unknown): v is string => typeof v === 'string' && v.length > 0
const isNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

function isAttempt(v: unknown): v is Attempt {
  return isObject(v) && isString(v.date) && isNumber(v.bpm) && typeof v.passed === 'boolean'
}

function isExerciseProgress(v: unknown): v is ExerciseProgress {
  return (
    isObject(v) &&
    isString(v.exerciseId) &&
    (v.bestCleanBpm === null || isNumber(v.bestCleanBpm)) &&
    isString(v.lastPracticed) &&
    isNumber(v.box) &&
    Array.isArray(v.history) &&
    v.history.every(isAttempt)
  )
}

function isCardProgress(v: unknown): v is CardProgress {
  return (
    isObject(v) &&
    isString(v.cardId) &&
    Array.isArray(v.history) &&
    v.history.every((a) => isObject(a) && isString(a.date) && typeof a.ok === 'boolean' && isNumber(a.ms))
  )
}

function isLessonProgress(v: unknown): v is LessonProgress {
  return (
    isObject(v) &&
    isString(v.lessonId) &&
    (v.completedAt === null || isString(v.completedAt)) &&
    isNumber(v.lastStep) &&
    isString(v.updatedAt)
  )
}

/** Valida un JSON importado. Lanza un Error con un mensaje legible si no es válido. */
export function parseProgressExport(data: unknown): ProgressExport {
  if (!isObject(data) || data.app !== 'bass-tutor') throw new Error('El fichero no es una copia de progreso de Bass Tutor.')
  if (data.version !== 1 && data.version !== EXPORT_VERSION) {
    throw new Error(`Versión de copia no compatible: ${String(data.version)}.`)
  }
  if (!Array.isArray(data.exercises) || !data.exercises.every(isExerciseProgress)) {
    throw new Error('La copia tiene datos de ejercicios dañados.')
  }
  if (!Array.isArray(data.lessons) || !data.lessons.every(isLessonProgress)) {
    throw new Error('La copia tiene datos de lecciones dañados.')
  }
  const cards = data.version === 1 ? [] : data.cards
  if (!Array.isArray(cards) || !cards.every(isCardProgress)) throw new Error('La copia tiene datos del quiz dañados.')
  return {
    app: 'bass-tutor',
    version: EXPORT_VERSION,
    exportedAt: isString(data.exportedAt) ? data.exportedAt : new Date().toISOString(),
    exercises: data.exercises,
    lessons: data.lessons,
    cards,
  }
}
