import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from './frontmatter'
import { FretboardEmbedSchema, LessonMetaSchema } from './schema'
import { validateCourse, type RawCourse } from './validate'

const exercise = (overrides: Record<string, unknown> = {}) => ({
  title: 'Cuerdas al aire',
  status: 'revisada',
  instructions: 'Toca las cuerdas al aire.',
  tempo: { start: 60, target: 80, step: 4 },
  timeSignature: '4/4',
  passCriteria: ['A tiempo'],
  alphaTex: '\\ts (4 4)\n:4 0.4 0.4 0.4 0.4',
  ...overrides,
})

const lesson = (front: Record<string, unknown> = {}, body = '## Paso 1\n\nTexto\n\n<Exercise id="ej-a" />') => {
  const meta = {
    title: 'Lección',
    level: 'principiante',
    status: 'revisada',
    durationMin: 10,
    objectives: ['Algo'],
    exercises: ['ej-a'],
    ...front,
  }
  const yaml = Object.entries(meta)
    .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
    .join('\n')
  return `---\n${yaml}\n---\n\n${body}\n`
}

const course = (overrides: Partial<RawCourse> = {}): RawCourse => ({
  modules: [
    {
      dir: '00-arranque',
      data: { title: 'Arranque', summary: 'Inicio', lessons: ['uno', 'dos'] },
      lessons: [
        { file: 'uno.mdx', source: lesson() },
        { file: 'dos.mdx', source: lesson({ prerequisites: ['uno'] }) },
      ],
    },
  ],
  exercises: [{ file: 'ej-a.yaml', data: exercise() }],
  ...overrides,
})

const errors = (raw: RawCourse, options = {}) =>
  validateCourse(raw, options)
    .issues.filter((i) => i.level === 'error')
    .map((i) => `${i.file}: ${i.message}`)

describe('validateCourse', () => {
  it('un curso correcto no tiene errores y resuelve ids y orden', () => {
    const { course: result, issues } = validateCourse(course())
    expect(issues).toEqual([])
    expect(result.modules).toEqual([expect.objectContaining({ id: 'arranque', order: 0, title: 'Arranque' })])
    expect(result.lessons.map((l) => l.id)).toEqual(['uno', 'dos'])
    expect(result.lessons[0]).toMatchObject({
      moduleId: 'arranque',
      mdxPath: 'modules/00-arranque/uno.mdx',
      steps: ['Paso 1'],
      prerequisites: [],
    })
    expect(result.lessons[0].review.afterDays).toEqual([1, 3, 7, 21])
    expect(result.exercises[0]).toMatchObject({ id: 'ej-a', feel: 'straight', tags: [] })
  })

  it('ejercicio: nombre de fichero, tempo, criterios, claves desconocidas y acordes', () => {
    const errs = errors(
      course({
        exercises: [
          { file: 'ej-a.yaml', data: exercise() },
          { file: 'Mal Nombre.yaml', data: exercise() },
          {
            file: 'ej-b.yaml',
            data: exercise({ tempo: { start: 90, target: 60, step: 4 }, passCriteria: [], sobra: 1, backing: { harmony: ['F7', 'Xq9'] } }),
          },
        ],
      }),
    )
    expect(errs).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Mal Nombre.yaml: el nombre del fichero'),
        expect.stringContaining('ej-b.yaml: tempo: el tempo inicial no puede ser mayor'),
        expect.stringContaining('ej-b.yaml: passCriteria: indica al menos un criterio'),
        expect.stringContaining('ej-b.yaml: backing.harmony: hay un acorde que Tonal no reconoce'),
        expect.stringMatching(/ej-b\.yaml: .*sobra/),
      ]),
    )
  })

  it('usa el comprobador de alphaTex: errores y compás distinto', () => {
    const raw = course({
      exercises: [
        { file: 'ej-a.yaml', data: exercise() },
        { file: 'ej-b.yaml', data: exercise({ alphaTex: 'roto' }) },
        { file: 'ej-c.yaml', data: exercise({ alphaTex: 'tres' }) },
      ],
    })
    const checkAlphaTex = (tex: string) =>
      tex === 'roto' ? { error: 'línea 1: mal' } : { timeSignature: tex === 'tres' ? '3/4' : '4/4' }
    expect(errors(raw, { checkAlphaTex })).toEqual([
      'exercises/ej-b.yaml: alphaTex: línea 1: mal',
      'exercises/ej-c.yaml: timeSignature es "4/4" pero el alphaTex empieza en 3/4',
    ])
  })

  it('lección: ejercicio inexistente, sin pasos, sin frontmatter y sin ejercicios', () => {
    const raw = course()
    raw.modules[0].lessons = [
      { file: 'uno.mdx', source: lesson({ exercises: ['no-existe'] }, 'Sin encabezados') },
      { file: 'dos.mdx', source: '# Sin frontmatter' },
    ]
    raw.modules[0].data = { title: 'A', summary: 'B', lessons: ['uno', 'dos', 'tres'] }
    raw.modules[0].lessons.push({ file: 'tres.mdx', source: lesson({ exercises: [] }) })
    expect(errors(raw)).toEqual([
      'modules/00-arranque/uno.mdx: el cuerpo no tiene pasos: cada paso empieza con un encabezado "## Título"',
      'modules/00-arranque/uno.mdx: el ejercicio "no-existe" no existe en exercises/',
      'modules/00-arranque/dos.mdx: falta el frontmatter (bloque entre líneas "---" al principio del fichero)',
      'modules/00-arranque/tres.mdx: exercises: toda lección tiene que terminar en al menos un ejercicio',
    ])
  })

  it('módulo: lecciones listadas que no existen y ficheros no listados', () => {
    const raw = course()
    raw.modules[0].data = { title: 'A', summary: 'B', lessons: ['uno', 'fantasma', 'uno'] }
    expect(errors(raw)).toEqual(
      expect.arrayContaining([
        'modules/00-arranque/module.yaml: lista la lección "fantasma" pero no existe fantasma.mdx',
        'modules/00-arranque/module.yaml: la lección "uno" aparece dos veces',
        'modules/00-arranque/dos.mdx: la lección no aparece en "lessons" de module.yaml',
      ]),
    )
  })

  it('carpetas de módulo: formato NN-id, número repetido y module.yaml ausente', () => {
    const base = course().modules[0]
    const raw = course({
      modules: [
        base,
        { dir: '00-otro', data: { title: 'X', summary: 'Y', lessons: ['z'] }, lessons: [{ file: 'z.mdx', source: lesson() }] },
        { dir: 'sin-numero', data: {}, lessons: [] },
        { dir: '02-vacio', data: null, lessons: [] },
      ],
    })
    expect(errors(raw)).toEqual(
      expect.arrayContaining([
        'modules/00-otro: número de módulo repetido (00) con 00-arranque',
        'modules/sin-numero: la carpeta debe llamarse NN-<id>, p. ej. "00-arranque"',
        'modules/02-vacio/module.yaml: falta module.yaml',
      ]),
    )
  })

  it('prerrequisitos: inexistentes, posteriores o la propia lección', () => {
    const raw = course()
    raw.modules[0].lessons = [
      { file: 'uno.mdx', source: lesson({ prerequisites: ['dos', 'uno', 'nada'] }) },
      { file: 'dos.mdx', source: lesson() },
    ]
    expect(errors(raw)).toEqual([
      'modules/00-arranque/uno.mdx: prerrequisito "dos" va después (o es la misma lección) en el orden del curso',
      'modules/00-arranque/uno.mdx: prerrequisito "uno" va después (o es la misma lección) en el orden del curso',
      'modules/00-arranque/uno.mdx: prerrequisito "nada" no existe',
    ])
  })

  it('ids de lección repetidos entre módulos', () => {
    const raw = course({
      modules: [
        course().modules[0],
        { dir: '01-otro', data: { title: 'X', summary: 'Y', lessons: ['uno'] }, lessons: [{ file: 'uno.mdx', source: lesson() }] },
      ],
    })
    expect(errors(raw)).toEqual([
      'modules/01-otro/uno.mdx: id de lección repetido: también existe modules/00-arranque/uno.mdx',
    ])
  })

  it('componentes incrustados: nombre, props y referencias', () => {
    const raw = course({
      exercises: [
        { file: 'ej-a.yaml', data: exercise() },
        { file: 'ej-b.yaml', data: exercise() },
      ],
    })
    raw.modules[0].lessons[0].source = lesson(
      {},
      [
        '## Paso',
        '<Exercise id="ej-a" />',
        '<Exercise id="ej-b" />',
        '<Tab exercise="fantasma" />',
        '<Fretboard mode="scale" root="A" type="inventada" />',
        '<Metronome bpm={500} />',
        '<Piano />',
        '<Fretboard mode="notes" frets={[0, 5]} extra="x" />',
      ].join('\n\n'),
    )
    // Líneas del fichero completo: frontmatter (8 líneas) + línea en blanco + cuerpo.
    expect(errors(raw)).toEqual([
      'modules/00-arranque/uno.mdx: línea 14: <Exercise> el ejercicio "ej-b" no está en "exercises" del frontmatter',
      'modules/00-arranque/uno.mdx: línea 16: <Tab> el ejercicio "fantasma" no existe en exercises/',
      'modules/00-arranque/uno.mdx: línea 18: <Fretboard> Escala desconocida: inventada',
      expect.stringMatching(/^modules\/00-arranque\/uno\.mdx: línea 20: <Metronome> bpm: /),
      'modules/00-arranque/uno.mdx: línea 22: <Piano> no existe; disponibles: <Fretboard>, <Tab>, <Exercise>, <Metronome>, <Video>',
      expect.stringMatching(/^modules\/00-arranque\/uno\.mdx: línea 24: <Fretboard> .*extra/),
    ])
  })

  it('<Video>: URL https, título y fuente obligatorios', () => {
    const raw = course()
    raw.modules[0].lessons[0].source = lesson(
      {},
      [
        '## Paso',
        '<Exercise id="ej-a" />',
        '<Video url="https://www.youtube.com/watch?v=abc" title="Demo" source="BassBuzz" />',
        '<Video url="http://inseguro.com" title="Demo" source="X" />',
        '<Video url="https://ok.com" title="Demo" />',
      ].join('\n\n'),
    )
    expect(errors(raw)).toEqual([
      'modules/00-arranque/uno.mdx: línea 16: <Video> url: tiene que ser una URL https://',
      expect.stringMatching(/^modules\/00-arranque\/uno\.mdx: línea 18: <Video> source: /),
    ])
  })

  it('itinerarios: el tronco común va primero y los prerrequisitos no cruzan itinerarios', () => {
    const module = (dir: string, track: string, lessons: string[]) => ({
      dir,
      data: { title: dir, summary: 'x', track, lessons },
      lessons: lessons.map((id) => ({ file: `${id}.mdx`, source: lesson() })),
    })
    const raw = course({
      modules: [
        module('10-funk-1', 'funk-soul', ['funk-a']),
        module('11-rock-1', 'rock-pop', ['rock-a']),
        module('00-base', 'comun', ['base-a']),
      ],
    })
    raw.modules[0].lessons[0].source = lesson({ prerequisites: ['base-a', 'rock-a'] })
    const result = validateCourse(raw)
    expect(result.course.modules.map((m) => m.id)).toEqual(['base', 'rock-1', 'funk-1'])
    expect(result.course.lessons.map((l) => l.id)).toEqual(['base-a', 'rock-a', 'funk-a'])
    expect(errors(raw)).toEqual([
      'modules/10-funk-1/funk-a.mdx: prerrequisito "rock-a" es del itinerario "rock-pop": solo vale el tronco común o "funk-soul"',
    ])
  })

  it('avisa si un ejercicio del frontmatter no se incrusta con <Exercise>', () => {
    const raw = course()
    raw.modules[0].lessons[0].source = lesson({}, '## Paso\n\nSin ejercicio')
    const warnings = validateCourse(raw).issues.filter((i) => i.level === 'warning')
    expect(warnings.map((w) => w.message)).toEqual(['el ejercicio "ej-a" no aparece en el cuerpo con <Exercise id="ej-a" />'])
  })

  it('avisa (sin error) de borradores y ejercicios sin usar', () => {
    const raw = course({
      exercises: [
        { file: 'ej-a.yaml', data: exercise({ status: 'borrador' }) },
        { file: 'suelto.yaml', data: exercise() },
      ],
    })
    const { issues } = validateCourse(raw)
    expect(issues.every((i) => i.level === 'warning')).toBe(true)
    expect(issues.map((i) => i.file)).toEqual(['exercises/ej-a.yaml', 'exercises/suelto.yaml'])
  })
})

describe('frontmatter', () => {
  it('separa YAML y cuerpo (también con BOM y CRLF)', () => {
    const { data, body, bodyLine } = parseFrontmatter('﻿---\r\ntitle: Hola\r\n---\r\n## Uno\r\n')
    expect(data).toEqual({ title: 'Hola' })
    expect(body).toBe('## Uno\r\n')
    expect(bodyLine).toBe(4)
  })
})

describe('esquema de lección', () => {
  it('los días de repaso tienen que ir en orden creciente', () => {
    const base = { title: 'a', level: 'principiante', status: 'revisada', durationMin: 5, objectives: ['x'], exercises: ['e'] }
    expect(LessonMetaSchema.safeParse({ ...base, review: { afterDays: [1, 7, 3] } }).success).toBe(false)
    expect(LessonMetaSchema.safeParse({ ...base, review: { afterDays: [2, 5] } }).success).toBe(true)
  })
})

describe('FretboardEmbedSchema', () => {
  it('acepta una vista válida y rellena valores por defecto', () => {
    expect(FretboardEmbedSchema.parse({ mode: 'scale', root: 'A', type: 'minor pentatonic' })).toEqual({
      mode: 'scale',
      root: 'A',
      type: 'minor pentatonic',
      frets: [0, 12],
      labels: 'note',
    })
  })

  it('rechaza escalas desconocidas y rangos al revés', () => {
    expect(FretboardEmbedSchema.safeParse({ mode: 'scale', root: 'A', type: 'inventada' }).success).toBe(false)
    expect(FretboardEmbedSchema.safeParse({ mode: 'notes', frets: [7, 5] }).success).toBe(false)
  })

  it('acepta una afinación conocida y rechaza las inventadas', () => {
    expect(FretboardEmbedSchema.safeParse({ mode: 'notes', tuning: 'drop-d-4' }).success).toBe(true)
    const wrong = FretboardEmbedSchema.safeParse({ mode: 'notes', tuning: 'drop-c' })
    expect(wrong.success).toBe(false)
    expect(wrong.error?.issues[0].message).toMatch(/afinación desconocida.*drop-d-4/)
  })
})
