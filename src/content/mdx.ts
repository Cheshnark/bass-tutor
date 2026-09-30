/**
 * Análisis estático del cuerpo MDX de una lección (sin ejecutarlo):
 * - pasos = encabezados de nivel 2,
 * - componentes incrustados (`<Fretboard … />`) con sus props evaluadas, solo si son literales,
 * - construcciones no permitidas (import/export, expresiones con código).
 */
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'

export interface Embed {
  name: string
  props: Record<string, unknown>
  line?: number
}

export interface MdxAnalysis {
  steps: string[]
  embeds: Embed[]
  /** Problemas del propio MDX (sintaxis, construcciones prohibidas, props no literales). */
  problems: string[]
}

interface Position {
  start?: { line?: number; column?: number }
}

interface Node {
  type: string
  children?: Node[]
  value?: unknown
  depth?: number
  name?: string | null
  attributes?: Attribute[]
  data?: { estree?: Program }
  position?: Position
}

interface Attribute {
  type: string
  name?: string
  value?: string | null | { type: string; value: string; data?: { estree?: Program } }
}

interface Program {
  body: { type: string; expression?: EsNode }[]
}

interface EsNode {
  type: string
  value?: unknown
  operator?: string
  argument?: EsNode
  elements?: (EsNode | null)[]
  quasis?: { value: { cooked?: string } }[]
  expressions?: EsNode[]
}

class NotLiteral extends Error {}

/** Evalúa solo literales: números, textos, booleanos, null, arrays y el signo menos. */
function evaluate(node: EsNode | undefined): unknown {
  if (!node) throw new NotLiteral()
  switch (node.type) {
    case 'Literal':
      return node.value
    case 'UnaryExpression':
      if (node.operator === '-') {
        const value = evaluate(node.argument)
        if (typeof value === 'number') return -value
      }
      throw new NotLiteral()
    case 'ArrayExpression':
      return (node.elements ?? []).map((e) => evaluate(e ?? undefined))
    case 'TemplateLiteral':
      if ((node.expressions ?? []).length === 0) return node.quasis?.[0]?.value.cooked ?? ''
      throw new NotLiteral()
    default:
      throw new NotLiteral()
  }
}

function textOf(node: Node): string {
  if (typeof node.value === 'string' && node.type !== 'mdxFlowExpression') return node.value
  return (node.children ?? []).map(textOf).join('')
}

/**
 * @param firstLine línea del fichero en la que empieza `body` (tras el frontmatter), para
 *   que los errores den la línea real del fichero.
 */
export function analyzeMdx(body: string, firstLine = 1): MdxAnalysis {
  const fileLine = (line: number | undefined) => (line === undefined ? undefined : line + firstLine - 1)
  const lineOf = (node: Node): string => {
    const line = fileLine(node.position?.start?.line)
    return line ? `línea ${line}: ` : ''
  }

  const steps: string[] = []
  const embeds: Embed[] = []
  const problems: string[] = []

  let tree: Node
  try {
    tree = unified().use(remarkParse).use(remarkMdx).parse(body) as Node
  } catch (e) {
    const err = e as { message: string; line?: number; column?: number }
    problems.push(`MDX inválido${err.line ? ` (línea ${fileLine(err.line)}, col. ${err.column})` : ''}: ${err.message}`)
    return { steps, embeds, problems }
  }

  const walk = (node: Node) => {
    switch (node.type) {
      case 'heading':
        // Los pasos son los ## de primer nivel (igual que remarkLessonSteps). Uno anidado no abriría paso.
        if (node.depth === 2) {
          if (tree.children?.includes(node)) steps.push(textOf(node).trim())
          else problems.push(`${lineOf(node)}los encabezados ## tienen que ir al nivel principal, no dentro de un componente`)
        }
        break
      case 'mdxjsEsm':
        problems.push(`${lineOf(node)}no se permiten import/export en las lecciones`)
        return
      case 'mdxFlowExpression':
      case 'mdxTextExpression':
        // Solo se admiten comentarios: {/* … */}
        if ((node.data?.estree?.body.length ?? 0) > 0) {
          problems.push(`${lineOf(node)}no se permiten expresiones {…} en el texto (solo comentarios {/* … */})`)
        }
        return
      case 'mdxJsxFlowElement':
      case 'mdxJsxTextElement': {
        const name = node.name ?? ''
        // Los elementos en minúscula son HTML normal; los componentes empiezan por mayúscula.
        if (/^[A-Z]/.test(name)) {
          const props: Record<string, unknown> = {}
          for (const attribute of node.attributes ?? []) {
            if (attribute.type !== 'mdxJsxAttribute' || !attribute.name) {
              problems.push(`${lineOf(node)}<${name}>: no se admiten props con {...spread}`)
              continue
            }
            const value = attribute.value
            if (value === null || value === undefined) props[attribute.name] = true
            else if (typeof value === 'string') props[attribute.name] = value
            else {
              try {
                const statement = value.data?.estree?.body[0]
                props[attribute.name] = evaluate(statement?.expression)
              } catch {
                problems.push(`${lineOf(node)}<${name} ${attribute.name}={…}>: solo se admiten valores literales (números, textos, listas)`)
              }
            }
          }
          embeds.push({ name, props, line: fileLine(node.position?.start?.line) })
        }
        break
      }
    }
    node.children?.forEach(walk)
  }
  walk(tree)
  return { steps, embeds, problems }
}
