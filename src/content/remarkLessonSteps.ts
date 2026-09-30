/**
 * Plugin de remark: agrupa el cuerpo de una lección en pasos. Cada encabezado `##` de primer nivel
 * abre un `<LessonStep index="n">` que contiene el encabezado y todo lo que le sigue hasta el siguiente `##`.
 * Lo que haya antes del primer `##` va en el paso 0. El frontmatter y los nodos ESM quedan fuera.
 *
 * Debe coincidir con `analyzeMdx` (src/content/mdx.ts), que cuenta los mismos pasos para el JSON del curso.
 */

interface MdastNode {
  type: string
  depth?: number
  children?: MdastNode[]
  [key: string]: unknown
}

const OUTSIDE_STEPS = new Set(['yaml', 'toml', 'mdxjsEsm'])

function stepNode(index: number, children: MdastNode[]): MdastNode {
  return {
    type: 'mdxJsxFlowElement',
    name: 'LessonStep',
    attributes: [{ type: 'mdxJsxAttribute', name: 'index', value: String(index) }],
    children,
  }
}

export function groupSteps(root: MdastNode): void {
  const outside: MdastNode[] = []
  const steps: MdastNode[][] = []
  let current: MdastNode[] | null = null
  let sawHeading = false

  for (const node of root.children ?? []) {
    if (OUTSIDE_STEPS.has(node.type)) {
      outside.push(node)
      continue
    }
    const isStepHeading = node.type === 'heading' && node.depth === 2
    // Nuevo paso: al empezar, o en cada `##` salvo el primero (que se une a la introducción, si la hay).
    if (current === null || (isStepHeading && sawHeading)) {
      current = []
      steps.push(current)
    }
    if (isStepHeading) sawHeading = true
    current.push(node)
  }

  root.children = [...outside, ...steps.map((children, i) => stepNode(i, children))]
}

/** Uso: `remarkPlugins: [remarkFrontmatter, remarkLessonSteps]`. */
export default function remarkLessonSteps() {
  return (tree: MdastNode) => groupSteps(tree)
}
