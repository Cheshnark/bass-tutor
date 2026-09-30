import { parse } from 'yaml'

export interface ParsedDocument {
  data: unknown
  body: string
  /** Línea del fichero (1-based) en la que empieza el cuerpo, para dar errores con la línea real. */
  bodyLine: number
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n|$)([\s\S]*)$/
const BOM = 0xfeff

/** Separa el frontmatter YAML (`---` … `---`) del cuerpo. Lanza si falta o si el YAML es inválido. */
export function parseFrontmatter(source: string): ParsedDocument {
  const text = source.charCodeAt(0) === BOM ? source.slice(1) : source
  const match = FRONTMATTER.exec(text)
  if (!match) throw new Error('falta el frontmatter (bloque entre líneas "---" al principio del fichero)')
  const bodyStart = text.length - match[2].length
  const bodyLine = text.slice(0, bodyStart).split(/\n/).length
  return { data: parse(match[1]) ?? {}, body: match[2], bodyLine }
}
