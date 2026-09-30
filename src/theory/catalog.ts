/**
 * Catálogo curado de escalas, arpegios e intervalos con nombre en español.
 * `id` es el nombre que entiende Tonal.js. Las fórmulas y notas NO se escriben aquí:
 * se calculan con Tonal (ver dictionary.ts); aquí solo va el texto para el usuario.
 */

export interface CatalogEntry {
  id: string
  label: string
  /** Qué es, en una frase. */
  summary?: string
  /** Para qué se usa en el bajo. */
  usage?: string
}

export const SCALES: CatalogEntry[] = [
  {
    id: 'major',
    label: 'Mayor',
    summary: 'La escala jónica. Es la referencia para numerar los grados de todas las demás.',
    usage: 'Líneas sobre acordes mayores y base para entender los acordes de una tonalidad.',
  },
  {
    id: 'minor',
    label: 'Menor natural',
    summary: 'La escala eólica: como la mayor, pero con tercera, sexta y séptima menores.',
    usage: 'Líneas en tonalidades menores; muy habitual en rock y pop.',
  },
  {
    id: 'major pentatonic',
    label: 'Pentatónica mayor',
    summary: 'La mayor sin el 4.º ni el 7.º grado: cinco notas y ningún semitono.',
    usage: 'Country, soul y pop. Suena bien casi sin riesgo sobre acordes mayores.',
  },
  {
    id: 'minor pentatonic',
    label: 'Pentatónica menor',
    summary: 'La menor natural sin el 2.º ni el 6.º grado: cinco notas y ningún semitono.',
    usage: 'Rock, blues y funk. Es la base de muchísimos riffs de bajo.',
  },
  {
    id: 'blues',
    label: 'Blues',
    summary: 'La pentatónica menor más la quinta disminuida (♭5), la "blue note".',
    usage: 'Blues y rock. La ♭5 funciona sobre todo como nota de paso entre el 4 y el 5.',
  },
  {
    id: 'dorian',
    label: 'Dórica',
    summary: 'Menor con la sexta mayor (6 en vez de ♭6).',
    usage: 'Grooves sobre acordes m7 en funk, soul y jazz modal.',
  },
  {
    id: 'mixolydian',
    label: 'Mixolidia',
    summary: 'Mayor con la séptima menor (♭7).',
    usage: 'Líneas sobre acordes de dominante (7): blues, rock y funk.',
  },
  {
    id: 'harmonic minor',
    label: 'Menor armónica',
    summary: 'Menor natural con la séptima mayor: deja un salto de tono y medio entre ♭6 y 7.',
    usage: 'Pasajes sobre el acorde dominante (V7) de una tonalidad menor, que resuelve en la tónica.',
  },
  {
    id: 'chromatic',
    label: 'Cromática',
    summary: 'Los doce sonidos, de semitono en semitono.',
    usage: 'Calentamiento (un dedo por traste) y notas de paso cromáticas hacia la fundamental.',
  },
]

export const ARPEGGIOS: CatalogEntry[] = [
  {
    id: 'M',
    label: 'Tríada mayor',
    summary: 'Fundamental, tercera mayor y quinta justa.',
    usage: 'Líneas 1-3-5 sobre acordes mayores.',
  },
  {
    id: 'm',
    label: 'Tríada menor',
    summary: 'Fundamental, tercera menor y quinta justa.',
    usage: 'Líneas 1-♭3-5 sobre acordes menores.',
  },
  {
    id: 'dim',
    label: 'Tríada disminuida',
    summary: 'Fundamental, tercera menor y quinta disminuida.',
    usage: 'Acordes de paso y el VII grado de la escala mayor.',
  },
  {
    id: 'aug',
    label: 'Tríada aumentada',
    summary: 'Fundamental, tercera mayor y quinta aumentada. Simétrica: se repite cada 4 semitonos.',
    usage: 'Acordes de paso con tensión hacia el siguiente acorde.',
  },
  {
    id: 'maj7',
    label: 'Maj7',
    summary: 'Tríada mayor con séptima mayor. Sonido suave y abierto.',
    usage: 'Jazz, bossa nova y soul, sobre acordes Imaj7 y IVmaj7.',
  },
  {
    id: 'm7',
    label: 'm7',
    summary: 'Tríada menor con séptima menor.',
    usage: 'Muy frecuente en funk, soul y jazz (el ii del ii–V–I).',
  },
  {
    id: '7',
    label: '7 (dominante)',
    summary: 'Tríada mayor con séptima menor. Tiene tensión y pide resolver.',
    usage: 'El V del ii–V–I y los tres acordes del blues de 12 compases.',
  },
  {
    id: 'm7b5',
    label: 'm7♭5 (semidisminuido)',
    summary: 'Tríada disminuida con séptima menor.',
    usage: 'El ii del ii–V–i en tonalidad menor.',
  },
  {
    id: 'dim7',
    label: 'Dim7',
    summary: 'Terceras menores apiladas. Simétrico: se repite cada 3 semitonos.',
    usage: 'Acordes de paso cromáticos entre dos acordes.',
  },
]

export const INTERVALS: CatalogEntry[] = [
  { id: '2m', label: 'Segunda menor' },
  { id: '2M', label: 'Segunda mayor' },
  { id: '3m', label: 'Tercera menor' },
  { id: '3M', label: 'Tercera mayor' },
  { id: '4P', label: 'Cuarta justa' },
  { id: '4A', label: 'Cuarta aumentada (tritono)' },
  { id: '5P', label: 'Quinta justa' },
  { id: '6m', label: 'Sexta menor' },
  { id: '6M', label: 'Sexta mayor' },
  { id: '7m', label: 'Séptima menor' },
  { id: '7M', label: 'Séptima mayor' },
  { id: '8P', label: 'Octava' },
]

/** Fundamentales ofrecidas en los selectores (ortografía habitual en bajo). */
export const ROOTS = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
