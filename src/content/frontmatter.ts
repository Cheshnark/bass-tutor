import { parse } from 'yaml'

export interface ParsedDocument {
  data: unknown
  body: string
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/

/** Separa el frontmatter YAML (`---` … `---`) del cuerpo. Lanza si falta o si el YAML es inválido. */
export function parseFrontmatter(source: string): ParsedDocument {
  const match = FRONTMATTER.exec(source.replace(/^﻿/, ''))
  if (!match) throw new Error('falta el frontmatter (bloque entre líneas "---" al principio del fichero)')
  return { data: parse(match[1]) ?? {}, body: match[2] }
}

/** Títulos de los pasos: encabezados de nivel 2 (`## …`) fuera de bloques de código. */
export function extractSteps(body: string): string[] {
  const steps: string[] = []
  let inFence = false
  for (const line of body.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence
    if (inFence) continue
    const match = /^##\s+(.+?)\s*#*\s*$/.exec(line)
    if (match) steps.push(match[1])
  }
  return steps
}
