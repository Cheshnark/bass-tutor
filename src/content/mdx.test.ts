import { describe, expect, it } from 'vitest'
import { analyzeMdx } from './mdx'

describe('analyzeMdx', () => {
  it('los pasos son los ## (también con énfasis), fuera de bloques de código', () => {
    const { steps, problems } = analyzeMdx('# Título\n\n## Uno\n\ntexto\n\n```\n## no\n```\n\n### sub\n\n## Dos *con énfasis*\n')
    expect(problems).toEqual([])
    expect(steps).toEqual(['Uno', 'Dos con énfasis'])
  })

  it('extrae componentes con props literales y su línea', () => {
    const { embeds } = analyzeMdx(
      '## Paso\n\n<Fretboard mode="scale" root="A" type="minor pentatonic" frets={[0, 5]} labels="degree" />\n\nTexto con <Metronome bpm={60} /> en línea.\n',
    )
    expect(embeds).toEqual([
      {
        name: 'Fretboard',
        props: { mode: 'scale', root: 'A', type: 'minor pentatonic', frets: [0, 5], labels: 'degree' },
        line: 3,
      },
      { name: 'Metronome', props: { bpm: 60 }, line: 5 },
    ])
  })

  it('props booleanas, negativas y plantillas sin expresiones', () => {
    const { embeds, problems } = analyzeMdx('<Metronome flag n={-3} s={`hola`} />')
    expect(problems).toEqual([])
    expect(embeds[0].props).toEqual({ flag: true, n: -3, s: 'hola' })
  })

  it('ignora HTML en minúscula y admite comentarios', () => {
    const { embeds, problems } = analyzeMdx('## Paso\n\n{/* nota para mí */}\n\n<br />\n')
    expect(problems).toEqual([])
    expect(embeds).toEqual([])
  })

  it('rechaza import/export, expresiones con código y props no literales', () => {
    const { problems } = analyzeMdx(
      "import X from './x'\n\n## Paso\n\n{1 + 1}\n\n<Metronome bpm={60 * 2} />\n\n<Fretboard {...props} />\n",
    )
    expect(problems).toEqual([
      'línea 1: no se permiten import/export en las lecciones',
      'línea 5: no se permiten expresiones {…} en el texto (solo comentarios {/* … */})',
      'línea 7: <Metronome bpm={…}>: solo se admiten valores literales (números, textos, listas)',
      'línea 9: <Fretboard>: no se admiten props con {...spread}',
    ])
  })

  it('informa de errores de sintaxis con su posición', () => {
    const { problems } = analyzeMdx('## Paso\n\n<Fretboard mode="notes"\n')
    expect(problems).toHaveLength(1)
    expect(problems[0]).toMatch(/^MDX inválido \(línea \d+, col\. \d+\)/)
  })
})
