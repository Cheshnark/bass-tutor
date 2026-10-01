/**
 * Lectura del contenido desde disco y comprobador de alphaTex con alphaTab (Node).
 * Lo usan `npm run content:check` y el plugin de Vite `virtual:course`.
 */
import * as alphaTab from '@coderline/alphatab'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parse } from 'yaml'
import { validateCourse, type AlphaTexCheck, type Issue, type RawCourse, type ValidationResult } from '../src/content/validate'

// import.meta.url (no import.meta.dirname): Vite reescribe import.meta.url al empaquetar vite.config.
export const CONTENT_DIR = fileURLToPath(new URL('../src/content', import.meta.url))

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
export function checkAlphaTex(tex: string): AlphaTexCheck {
  try {
    const score = alphaTab.importer.ScoreLoader.loadAlphaTex(tex)
    const first = score.masterBars[0]
    if (!first) return { error: 'no tiene ningún compás' }
    return {
      timeSignature: `${first.timeSignatureNumerator}/${first.timeSignatureDenominator}`,
      bars: score.masterBars.length,
      tracks: score.tracks.length,
    }
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

/** Lee src/content del disco. Los YAML que no se pueden parsear se devuelven como incidencias. */
export function readCourse(): { raw: RawCourse; parseIssues: Issue[] } {
  const parseIssues: Issue[] = []
  const safeYaml = (path: string): unknown => {
    try {
      return parse(readFileSync(path, 'utf8'))
    } catch (e) {
      parseIssues.push({ level: 'error', file: relative(CONTENT_DIR, path), message: `YAML inválido: ${(e as Error).message}` })
      return undefined
    }
  }

  const modulesDir = join(CONTENT_DIR, 'modules')
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

  const exercisesDir = join(CONTENT_DIR, 'exercises')
  const exercises = existsSync(exercisesDir)
    ? readdirSync(exercisesDir)
        .filter((f) => !f.startsWith('.'))
        .map((file) => ({ file, data: file.endsWith('.yaml') ? safeYaml(join(exercisesDir, file)) : undefined }))
    : []

  return { raw: { modules, exercises }, parseIssues }
}

/** Lee y valida todo el contenido. */
export function loadCourse(): ValidationResult {
  const { raw, parseIssues } = readCourse()
  const result = validateCourse(raw, { checkAlphaTex })
  return { course: result.course, issues: [...parseIssues, ...result.issues] }
}

export function formatIssue(issue: Issue): string {
  const tag = issue.level === 'error' ? '✗ error ' : '! aviso '
  return `${tag} ${issue.file}: ${issue.message}`
}
