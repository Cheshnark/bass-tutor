/**
 * Validación del curso completo: cada fichero contra su esquema Zod y, después, las
 * referencias cruzadas (lecciones ↔ módulos, ejercicios, prerrequisitos) y la notación.
 * Es pura: recibe el contenido ya leído. La lectura de disco está en scripts/content-check.ts.
 */
import type { z } from 'zod'
import { extractSteps, parseFrontmatter } from './frontmatter'
import {
  ExerciseSchema,
  LessonMetaSchema,
  ModuleSchema,
  SLUG_PATTERN,
  type Course,
  type Exercise,
  type Lesson,
  type Module,
} from './schema'

export interface RawModule {
  /** Nombre de la carpeta: "00-arranque". */
  dir: string
  /** module.yaml ya parseado (o null si no existe). */
  data: unknown
  lessons: { file: string; source: string }[]
}

export interface RawExercise {
  /** Nombre de fichero: "cuerdas-al-aire.yaml". */
  file: string
  data: unknown
}

export interface RawCourse {
  modules: RawModule[]
  exercises: RawExercise[]
}

export interface Issue {
  level: 'error' | 'warning'
  /** Ruta relativa a src/content. */
  file: string
  message: string
}

/** Resultado de analizar un alphaTex (lo aporta quien llama; en Node, alphaTab). */
export interface AlphaTexCheck {
  error?: string
  /** Compás del primer compás, "4/4". */
  timeSignature?: string
}

export interface ValidateOptions {
  checkAlphaTex?: (tex: string) => AlphaTexCheck
}

export interface ValidationResult {
  course: Course
  issues: Issue[]
}

const MODULE_DIR = /^(\d{2})-([a-z0-9]+(?:-[a-z0-9]+)*)$/

function zodIssues(file: string, error: z.ZodError): Issue[] {
  return error.issues.map((i) => ({
    level: 'error' as const,
    file,
    message: `${i.path.length ? i.path.join('.') + ': ' : ''}${i.message}`,
  }))
}

function baseName(file: string, ext: string): string | null {
  if (!file.endsWith(ext)) return null
  const name = file.slice(0, -ext.length)
  return SLUG_PATTERN.test(name) ? name : null
}

export function validateCourse(raw: RawCourse, options: ValidateOptions = {}): ValidationResult {
  const issues: Issue[] = []
  const error = (file: string, message: string) => issues.push({ level: 'error', file, message })
  const warn = (file: string, message: string) => issues.push({ level: 'warning', file, message })

  // ── Ejercicios ──
  const exercises: Exercise[] = []
  for (const { file, data } of raw.exercises) {
    const path = `exercises/${file}`
    const id = baseName(file, '.yaml')
    if (!id) {
      error(path, 'el nombre del fichero debe ser <id-en-kebab-case>.yaml')
      continue
    }
    const parsed = ExerciseSchema.safeParse(data)
    if (!parsed.success) {
      issues.push(...zodIssues(path, parsed.error))
      continue
    }
    const exercise: Exercise = { id, ...parsed.data }
    if (exercise.status === 'borrador') warn(path, 'ejercicio en borrador: tócalo y márcalo como "revisada"')
    if (options.checkAlphaTex) {
      const check = options.checkAlphaTex(exercise.alphaTex)
      if (check.error) error(path, `alphaTex: ${check.error}`)
      else if (check.timeSignature && check.timeSignature !== exercise.timeSignature) {
        error(path, `timeSignature es "${exercise.timeSignature}" pero el alphaTex empieza en ${check.timeSignature}`)
      }
    }
    exercises.push(exercise)
  }
  const exerciseIds = new Set(exercises.map((e) => e.id))

  // ── Módulos y lecciones ──
  const modules: Module[] = []
  const lessons: Lesson[] = []
  const lessonFile = new Map<string, string>()
  const orders = new Map<number, string>()

  for (const rawModule of raw.modules) {
    const dir = `modules/${rawModule.dir}`
    const dirMatch = MODULE_DIR.exec(rawModule.dir)
    if (!dirMatch) {
      error(dir, 'la carpeta debe llamarse NN-<id>, p. ej. "00-arranque"')
      continue
    }
    const order = Number(dirMatch[1])
    const moduleId = dirMatch[2]
    if (orders.has(order)) error(dir, `número de módulo repetido (${dirMatch[1]}) con ${orders.get(order)}`)
    orders.set(order, rawModule.dir)

    if (rawModule.data === null || rawModule.data === undefined) {
      error(`${dir}/module.yaml`, 'falta module.yaml')
      continue
    }
    const parsedModule = ModuleSchema.safeParse(rawModule.data)
    if (!parsedModule.success) {
      issues.push(...zodIssues(`${dir}/module.yaml`, parsedModule.error))
      continue
    }
    const moduleData = parsedModule.data
    modules.push({ id: moduleId, order, ...moduleData })

    const filesById = new Map<string, { file: string; source: string }>()
    for (const lesson of rawModule.lessons) {
      const id = baseName(lesson.file, '.mdx')
      if (!id) {
        error(`${dir}/${lesson.file}`, 'el nombre del fichero debe ser <id-en-kebab-case>.mdx')
        continue
      }
      filesById.set(id, lesson)
    }

    const listed = new Set<string>()
    for (const id of moduleData.lessons) {
      if (listed.has(id)) error(`${dir}/module.yaml`, `la lección "${id}" aparece dos veces`)
      listed.add(id)
      if (!filesById.has(id)) error(`${dir}/module.yaml`, `lista la lección "${id}" pero no existe ${id}.mdx`)
    }
    for (const id of filesById.keys()) {
      if (!listed.has(id)) error(`${dir}/${id}.mdx`, 'la lección no aparece en "lessons" de module.yaml')
    }

    for (const id of moduleData.lessons) {
      const lesson = filesById.get(id)
      if (!lesson) continue
      const path = `${dir}/${lesson.file}`
      if (lessonFile.has(id)) {
        error(path, `id de lección repetido: también existe ${lessonFile.get(id)}`)
        continue
      }
      lessonFile.set(id, path)

      let document
      try {
        document = parseFrontmatter(lesson.source)
      } catch (e) {
        error(path, (e as Error).message)
        continue
      }
      const parsed = LessonMetaSchema.safeParse(document.data)
      if (!parsed.success) {
        issues.push(...zodIssues(path, parsed.error))
        continue
      }
      const steps = extractSteps(document.body)
      if (steps.length === 0) error(path, 'el cuerpo no tiene pasos: cada paso empieza con un encabezado "## Título"')
      if (parsed.data.status === 'borrador') warn(path, 'lección en borrador: revísala y márcala como "revisada"')
      for (const exerciseId of parsed.data.exercises) {
        if (!exerciseIds.has(exerciseId)) error(path, `el ejercicio "${exerciseId}" no existe en exercises/`)
      }
      lessons.push({ id, moduleId, ...parsed.data, body: document.body, steps })
    }
  }

  // ── Prerrequisitos: deben existir y estar antes en el curso ──
  modules.sort((a, b) => a.order - b.order)
  // Posición de cada lección en el curso; si un id está repetido, vale su primera aparición.
  const position = new Map<string, number>()
  for (const id of modules.flatMap((m) => m.lessons)) {
    if (lessonFile.has(id) && !position.has(id)) position.set(id, position.size)
  }
  for (const lesson of lessons) {
    const path = lessonFile.get(lesson.id) ?? lesson.id
    for (const prerequisite of lesson.prerequisites) {
      const at = position.get(prerequisite)
      if (at === undefined) error(path, `prerrequisito "${prerequisite}" no existe`)
      else if (at >= (position.get(lesson.id) ?? 0)) {
        error(path, `prerrequisito "${prerequisite}" va después (o es la misma lección) en el orden del curso`)
      }
    }
  }
  lessons.sort((a, b) => (position.get(a.id) ?? 0) - (position.get(b.id) ?? 0))

  // ── Ejercicios que ninguna lección usa ──
  const used = new Set(lessons.flatMap((l) => l.exercises))
  for (const exercise of exercises) {
    if (!used.has(exercise.id)) warn(`exercises/${exercise.id}.yaml`, 'ninguna lección usa este ejercicio')
  }

  return { course: { modules, lessons, exercises }, issues }
}
