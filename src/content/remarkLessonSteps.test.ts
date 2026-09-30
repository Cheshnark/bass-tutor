import remarkFrontmatter from 'remark-frontmatter'
import remarkMdx from 'remark-mdx'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { describe, expect, it } from 'vitest'
import { analyzeMdx } from './mdx'
import { groupSteps } from './remarkLessonSteps'

interface N {
  type: string
  name?: string
  depth?: number
  attributes?: { name: string; value: string }[]
  children?: N[]
}

function group(source: string): N {
  const tree = unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).parse(source) as unknown as N
  groupSteps(tree as never)
  return tree
}

const summary = (tree: N) =>
  (tree.children ?? []).map((n) =>
    n.type === 'mdxJsxFlowElement'
      ? `step ${n.attributes?.[0].value}: ${(n.children ?? []).map((c) => c.type + (c.depth ? c.depth : '')).join(',')}`
      : n.type,
  )

describe('remarkLessonSteps', () => {
  it('cada ## abre un paso con su contenido', () => {
    expect(summary(group('## Uno\n\nTexto\n\n## Dos\n\n- a\n- b\n\n<Exercise id="x" />\n'))).toEqual([
      'step 0: heading2,paragraph',
      'step 1: heading2,list,mdxJsxFlowElement',
    ])
  })

  it('el frontmatter queda fuera y la introducción va con el primer paso', () => {
    expect(summary(group('---\ntitle: x\n---\n\nIntro\n\n## Uno\n\nA\n\n### Sub\n\nB\n\n## Dos\n'))).toEqual([
      'yaml',
      'step 0: paragraph,heading2,paragraph,heading3,paragraph',
      'step 1: heading2',
    ])
  })

  it('cuenta los mismos pasos que analyzeMdx', () => {
    const body = 'Intro\n\n## A\n\ntexto\n\n## B\n\n```\n## no es paso\n```\n\n## C\n'
    const steps = (group(body).children ?? []).filter((n) => n.name === 'LessonStep')
    expect(steps).toHaveLength(analyzeMdx(body).steps.length)
    expect(analyzeMdx(body).steps).toEqual(['A', 'B', 'C'])
  })

  it('un ## anidado en un componente es un error del analizador', () => {
    const { problems, steps } = analyzeMdx('## A\n\n<Exercise id="x">\n\n## Dentro\n\n</Exercise>\n')
    expect(steps).toEqual(['A'])
    expect(problems).toEqual(['línea 5: los encabezados ## tienen que ir al nivel principal, no dentro de un componente'])
  })
})
