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
import { TUNINGS } from '../theory/tunings'
import { DEFAULT_REVIEW_DAYS } from '../practice/leitner'
import { barChords, chordsFitBar } from './backing'
import { TRACK_IDS } from './tracks'

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
  /** Itinerario al que pertenece (src/content/tracks.ts). Por defecto, el tronco común. */
  track: z.enum(TRACK_IDS).default('comun'),
  /** Ids de las lecciones, en el orden en que se estudian. Es la única fuente del orden. */
  lessons: z.array(slug).min(1, 'un módulo necesita al menos una lección'),
})

// ── Lección (frontmatter del .mdx) ──────────────────────────────────────────

export { DEFAULT_REVIEW_DAYS }

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
      /** Cifrado por compás, p. ej. ["F7", "Bb7", "F7", "Cm7 F7"] (varios acordes en un compás, con espacios). */
      harmony: z
        .array(text)
        .refine(
          (bars) => bars.every((bar) => barChords(bar).every((c) => !Chord.get(c).empty)),
          'hay un acorde que Tonal no reconoce',
        )
        .optional(),
    })
    .optional(),
  /** Criterios de autoevaluación para dar el ejercicio por superado. */
  passCriteria: z.array(text).min(1, 'indica al menos un criterio de superación'),
  /** Etiquetas para rutinas y práctica alterna ("mano-derecha", "cuerdas-al-aire"...). */
  tags: z.array(slug).default([]),
  /** Notación (tab + partitura) en alphaTex. */
  alphaTex: text,
}).superRefine((exercise, ctx) => {
  exercise.backing?.harmony?.forEach((bar, i) => {
    if (!chordsFitBar(barChords(bar).length, exercise.timeSignature)) {
      ctx.addIssue({
        code: 'custom',
        path: ['backing', 'harmony', i],
        message: `"${bar}": en ${exercise.timeSignature} los acordes no se pueden repartir a partes iguales por pulsos`,
      })
    }
  })
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
    /**
     * Afinación fija para este mástil (p. ej. "drop-d-4"), por encima de la de los ajustes.
     * Solo cuando la lección trata de esa afinación; si no, se respeta la del alumno.
     */
    tuning: z
      .string()
      .refine((id) => TUNINGS.some((t) => t.id === id), {
        error: `afinación desconocida; disponibles: ${TUNINGS.map((t) => t.id).join(', ')}`,
      })
      .optional(),
  })
  .superRefine((view, ctx) => {
    try {
      resolvePitchSet(view)
    } catch (error) {
      ctx.addIssue({ code: 'custom', message: (error as Error).message })
    }
  })

/** `<Tab exercise="id" />`: solo la notación de un ejercicio, con reproducción. */
export const TabEmbedSchema = z.strictObject({ exercise: slug })

/** `<Exercise id="id" />`: tarjeta completa del ejercicio (instrucciones, tempo, notación, criterios). */
export const ExerciseEmbedSchema = z.strictObject({ id: slug })

/** `<Metronome bpm={60} beatsPerBar={4} />`: botón que arranca el metrónomo global a ese tempo. */
export const MetronomeEmbedSchema = z.strictObject({
  bpm: bpm.optional(),
  beatsPerBar: z.number().int().min(1).max(12).optional(),
})

/**
 * `<Video url="https://…" title="…" source="…" />`: enlace a una demostración externa gratuita.
 * Se enlaza (no se incrusta): funciona offline sin romper nada y no carga rastreadores.
 */
export const VideoEmbedSchema = z.strictObject({
  url: z.url({ protocol: /^https$/, error: 'tiene que ser una URL https://' }),
  title: text,
  /** Quién lo publica ("BassBuzz", "StudyBass"…). */
  source: text,
})

/** Componentes que se pueden usar en una lección y el esquema de sus props. */
export const EMBED_SCHEMAS = {
  Fretboard: FretboardEmbedSchema,
  Tab: TabEmbedSchema,
  Exercise: ExerciseEmbedSchema,
  Metronome: MetronomeEmbedSchema,
  Video: VideoEmbedSchema,
} as const

export type EmbedName = keyof typeof EMBED_SCHEMAS

export type ModuleData = z.infer<typeof ModuleSchema>
export type LessonMeta = z.infer<typeof LessonMetaSchema>
export type ExerciseData = z.infer<typeof ExerciseSchema>
export type FretboardEmbed = z.input<typeof FretboardEmbedSchema>
export type TabEmbed = z.infer<typeof TabEmbedSchema>
export type ExerciseEmbed = z.infer<typeof ExerciseEmbedSchema>
export type MetronomeEmbed = z.infer<typeof MetronomeEmbedSchema>
export type VideoEmbed = z.infer<typeof VideoEmbedSchema>

/** Contenido ya validado y con ids resueltos. */
export interface Exercise extends ExerciseData {
  id: string
}

export interface Lesson extends LessonMeta {
  id: string
  moduleId: string
  /** Ruta del .mdx relativa a src/content ("modules/00-arranque/cuerdas-al-aire.mdx"). */
  mdxPath: string
  /** Títulos de los pasos (encabezados `##`), en orden. Cada uno es una pantalla en "siguiendo la clase". */
  steps: string[]
}

export interface Module extends ModuleData {
  id: string
  order: number
}

/** Lo pesado de un ejercicio: llega aparte, al abrirlo (`virtual:course-detail`), no en el arranque. */
export type ExerciseDetail = Pick<Exercise, 'alphaTex' | 'instructions' | 'passCriteria'>

/** Ejercicio sin su detalle: lo que el navegador carga al arrancar (título, tempo, tags, armonía…). */
export type ExerciseMeta = Omit<Exercise, keyof ExerciseDetail>

export interface Course {
  modules: Module[]
  lessons: Lesson[]
  exercises: Exercise[]
}

/** El curso tal como llega al navegador: los ejercicios, sin su detalle. */
export interface RuntimeCourse extends Omit<Course, 'exercises'> {
  exercises: ExerciseMeta[]
}
