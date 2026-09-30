/**
 * Esquema del contenido del curso (docs/research.md §7, adaptado; ver docs/content-guide.md).
 *
 * Organización en disco:
 *   src/content/modules/NN-<id>/module.yaml      → ModuleSchema     (id y orden salen del nombre de carpeta)
 *   src/content/modules/NN-<id>/<lesson>.mdx     → LessonMetaSchema en el frontmatter; cuerpo = pasos (## …)
 *   src/content/exercises/<id>.yaml              → ExerciseSchema   (id = nombre de fichero)
 *
 * Los ids NO se escriben dentro de los ficheros: salen del nombre, para que no puedan desincronizarse.
 */
import { Chord } from 'tonal'
import { z } from 'zod'
import { MAX_BPM, MIN_BPM } from '../audio/beatClock'
import { MAX_FRET, resolvePitchSet } from '../theory/fretboard'

// Mensajes de error de Zod en español (los propios de este esquema ya lo están).
z.config(z.locales.es())

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
export const slug = z.string().regex(SLUG_PATTERN, 'usa minúsculas sin tildes, números y guiones (kebab-case)')

const text = z.string().trim().min(1, 'no puede estar vacío')
const bpm = z.number().int().min(MIN_BPM).max(MAX_BPM)

export const LevelSchema = z.enum(['principiante', 'intermedio'])

/** "borrador" = sin revisar por el autor (todo lo que genera Claude empieza así). */
export const StatusSchema = z.enum(['borrador', 'revisada'])

// ── Módulo ──────────────────────────────────────────────────────────────────

export const ModuleSchema = z.strictObject({
  title: text,
  summary: text,
  /** Ids de las lecciones, en el orden en que se estudian. Es la única fuente del orden. */
  lessons: z.array(slug).min(1, 'un módulo necesita al menos una lección'),
})

// ── Lección (frontmatter del .mdx) ──────────────────────────────────────────

export const DEFAULT_REVIEW_DAYS = [1, 3, 7, 21]

export const LessonMetaSchema = z.strictObject({
  title: text,
  level: LevelSchema,
  status: StatusSchema,
  durationMin: z.number().int().min(1).max(120),
  /** Qué sabrás hacer al terminar. */
  objectives: z.array(text).min(1, 'indica al menos un objetivo'),
  /** Ids de lecciones que deben estudiarse antes. */
  prerequisites: z.array(slug).default([]),
  /** Conceptos que introduce ("fundamental", "corchea"...), para el repaso y la búsqueda. */
  concepts: z.array(text).default([]),
  /** Ids de ejercicios. Toda lección termina tocando: mínimo uno. */
  exercises: z.array(slug).min(1, 'toda lección tiene que terminar en al menos un ejercicio'),
  review: z
    .strictObject({
      afterDays: z
        .array(z.number().int().positive())
        .min(1)
        .refine((days) => days.every((d, i) => i === 0 || d > days[i - 1]), 'los días de repaso deben ir en orden creciente'),
    })
    .default({ afterDays: DEFAULT_REVIEW_DAYS }),
})

// ── Ejercicio ──────────────────────────────────────────────────────────────

export const TIME_SIGNATURE_PATTERN = /^([1-9]|1[0-6])\/(1|2|4|8|16)$/

export const ExerciseSchema = z.strictObject({
  title: text,
  status: StatusSchema,
  instructions: text,
  tempo: z
    .strictObject({ start: bpm, target: bpm, step: z.number().int().min(1).max(20) })
    .refine((t) => t.start <= t.target, 'el tempo inicial no puede ser mayor que el objetivo'),
  timeSignature: z.string().regex(TIME_SIGNATURE_PATTERN, 'formato "4/4", "3/4", "12/8"…'),
  feel: z.enum(['straight', 'swing', 'shuffle']).default('straight'),
  backing: z
    .strictObject({
      drums: text.optional(),
      /** Cifrado por compás, p. ej. ["F7", "Bb7", "F7", "F7"]. */
      harmony: z
        .array(text)
        .refine((chords) => chords.every((c) => !Chord.get(c).empty), 'hay un acorde que Tonal no reconoce')
        .optional(),
    })
    .optional(),
  /** Criterios de autoevaluación para dar el ejercicio por superado. */
  passCriteria: z.array(text).min(1, 'indica al menos un criterio de superación'),
  /** Etiquetas para rutinas y práctica alterna ("mano-derecha", "cuerdas-al-aire"...). */
  tags: z.array(slug).default([]),
  /** Notación (tab + partitura) en alphaTex. */
  alphaTex: text,
})

// ── Componentes incrustados en el MDX ───────────────────────────────────────

/** Props de `<Fretboard />` dentro de una lección (mismo modelo que `FretboardView`). */
export const FretboardEmbedSchema = z
  .strictObject({
    mode: z.enum(['notes', 'scale', 'arpeggio', 'interval']),
    root: z.string().optional(),
    type: z.string().optional(),
    frets: z
      .tuple([z.number().int().min(0).max(MAX_FRET), z.number().int().min(0).max(MAX_FRET)])
      .refine(([a, b]) => a <= b, 'el primer traste no puede ser mayor que el último')
      .default([0, 12]),
    labels: z.enum(['note', 'degree', 'interval']).default('note'),
  })
  .superRefine((view, ctx) => {
    try {
      resolvePitchSet(view)
    } catch (error) {
      ctx.addIssue({ code: 'custom', message: (error as Error).message })
    }
  })

export type ModuleData = z.infer<typeof ModuleSchema>
export type LessonMeta = z.infer<typeof LessonMetaSchema>
export type ExerciseData = z.infer<typeof ExerciseSchema>
export type FretboardEmbed = z.infer<typeof FretboardEmbedSchema>

/** Contenido ya validado y con ids resueltos. */
export interface Exercise extends ExerciseData {
  id: string
}

export interface Lesson extends LessonMeta {
  id: string
  moduleId: string
  /** Cuerpo MDX (sin frontmatter). Cada `## título` es un paso del modo "siguiendo la clase". */
  body: string
  /** Títulos de los pasos (encabezados `##`), en orden. */
  steps: string[]
}

export interface Module extends ModuleData {
  id: string
  order: number
}

export interface Course {
  modules: Module[]
  lessons: Lesson[]
  exercises: Exercise[]
}
