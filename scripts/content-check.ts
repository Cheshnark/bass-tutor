/**
 * npm run content:check — valida todo src/content contra el esquema (src/content/schema.ts).
 * Sale con código 1 si hay errores; los avisos (borradores, ejercicios sin usar) no bloquean.
 * Se ejecuta antes de cada build.
 */
import * as alphaTab from '@coderline/alphatab'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { parse } from 'yaml'
import { validateCourse, type AlphaTexCheck, type Issue, type RawCourse } from '../src/content/validate'

const CONTENT = join(import.meta.dirname, '..', 'src', 'content')

alphaTab.Logger.logLevel = alphaTab.LogLevel.None

interface Diagnostic {
  message: string
  start?: { line: number; col: number }
}

interface DiagnosticsError {
  lexerDiagnostics?: { items: Diagnostic[] }
  parserDiagnostics?: { items: Diagnostic[] }
  semanticDiagnostics?: { items: Diagnostic[] }
}

/** Parsea el alphaTex con alphaTab y devuelve el primer compás o los diagnósticos legibles. */
function checkAlphaTex(tex: string): AlphaTexCheck {
  try {
    const score = alphaTab.importer.ScoreLoader.loadAlphaTex(tex)
    const first = score.masterBars[0]
    if (!first) return { error: 'no tiene ningún compás' }
    return { timeSignature: `${first.timeSignatureNumerator}/${first.timeSignatureDenominator}` }
  } catch (e) {
    // alphaTab lanza el error con diagnósticos a veces directamente y a veces envuelto en `cause`.
    const direct = e as DiagnosticsError & { cause?: DiagnosticsError }
    const source = direct.parserDiagnostics ? direct : direct.cause
    const items = [
      ...(source?.lexerDiagnostics?.items ?? []),
      ...(source?.parserDiagnostics?.items ?? []),
      ...(source?.semanticDiagnostics?.items ?? []),
    ]
    if (items.length === 0) return { error: (e as Error).message }
    return {
      error: items
        .map((d) => (d.start ? `línea ${d.start.line}, col. ${d.start.col}: ${d.message}` : d.message))
        .join(' · '),
    }
  }
}

function readYaml(path: string): unknown {
  return parse(readFileSync(path, 'utf8'))
}

function readCourse(): { raw: RawCourse; parseIssues: Issue[] } {
  const parseIssues: Issue[] = []
  const safeYaml = (path: string): unknown => {
    try {
      return readYaml(path)
    } catch (e) {
      parseIssues.push({ level: 'error', file: relative(CONTENT, path), message: `YAML inválido: ${(e as Error).message}` })
      return undefined
    }
  }

  const modulesDir = join(CONTENT, 'modules')
  const modules = existsSync(modulesDir)
    ? readdirSync(modulesDir)
        .filter((dir) => statSync(join(modulesDir, dir)).isDirectory())
        .sort()
        .map((dir) => {
          const moduleYaml = join(modulesDir, dir, 'module.yaml')
          return {
            dir,
            data: existsSync(moduleYaml) ? (safeYaml(moduleYaml) ?? {}) : null,
            lessons: readdirSync(join(modulesDir, dir))
              .filter((f) => f.endsWith('.mdx'))
              .map((file) => ({ file, source: readFileSync(join(modulesDir, dir, file), 'utf8') })),
          }
        })
    : []

  const exercisesDir = join(CONTENT, 'exercises')
  const exercises = existsSync(exercisesDir)
    ? readdirSync(exercisesDir)
        .filter((f) => !f.startsWith('.'))
        .map((file) => ({ file, data: file.endsWith('.yaml') ? safeYaml(join(exercisesDir, file)) : undefined }))
    : []

  return { raw: { modules, exercises }, parseIssues }
}

const { raw, parseIssues } = readCourse()
const { course, issues } = validateCourse(raw, { checkAlphaTex })
const all = [...parseIssues, ...issues]
const errors = all.filter((i) => i.level === 'error')
const warnings = all.filter((i) => i.level === 'warning')

for (const issue of [...errors, ...warnings]) {
  const tag = issue.level === 'error' ? '✗ error ' : '! aviso '
  console.log(`${tag} ${issue.file}: ${issue.message}`)
}

console.log(
  `\nContenido: ${course.modules.length} módulos, ${course.lessons.length} lecciones, ${course.exercises.length} ejercicios` +
    ` · ${errors.length} errores, ${warnings.length} avisos`,
)
process.exit(errors.length > 0 ? 1 : 0)
