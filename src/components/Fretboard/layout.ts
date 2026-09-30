/**
 * Geometría pura del mástil (unidades del viewBox = px CSS a escala 1).
 * El modo zurdo es un espejo horizontal exacto: x' = width - x.
 * No se usa `transform: scale(-1)` en el SVG para no invertir el texto.
 */

export interface LayoutOptions {
  stringCount: number
  frets: [number, number]
  leftHanded: boolean
}

export interface FretboardLayout {
  width: number
  height: number
  /** Posición vertical de la cuerda (0 = la más grave, dibujada abajo como en la tablatura). */
  stringY: (string: number) => number
  /** Centro horizontal de la casilla de un traste (el 0 es la columna de cuerdas al aire). */
  noteX: (fret: number) => number
  /** Ancho de la casilla de un traste (para la zona pulsable). */
  cellWidth: (fret: number) => number
  /** Posición de la barra que cierra el traste `fret` (la cejuela si fret = 0). */
  wireX: (fret: number) => number
  /** Hay cejuela si el rango empieza en el traste 0. */
  hasNut: boolean
  boardTop: number
  boardBottom: number
  boardLeft: number
  boardRight: number
  /** Posición vertical de los números de traste. */
  fretNumberY: number
}

export const STRING_SPACING = 44
export const OPEN_COLUMN = 52
/** Ancho del traste 1. */
export const FIRST_FRET = 76
/**
 * Estrechamiento por traste: la mitad del real (2^(-1/12)). Con el real, el traste 24
 * quedaría a la mitad del 1 y sería difícil de pulsar en un móvil.
 */
export const TAPER = Math.pow(2, -1 / 24)
const PAD_X = 8
const PAD_TOP = 14
const PAD_BOTTOM = 34
const NUT = 8

/** Ancho de la casilla del traste f (f ≥ 1). */
export function fretWidth(fret: number): number {
  return FIRST_FRET * Math.pow(TAPER, fret - 1)
}

export function computeLayout({ stringCount, frets, leftHanded }: LayoutOptions): FretboardLayout {
  const [from, to] = frets
  const hasNut = from === 0

  // Geometría para diestro; al final se refleja si es zurdo.
  const edges = new Map<number, number>() // traste → x de su barra derecha
  let x = PAD_X
  const openCenter = x + OPEN_COLUMN / 2
  if (hasNut) {
    x += OPEN_COLUMN
    edges.set(0, x + NUT / 2)
    x += NUT
  } else {
    edges.set(from - 1, x)
  }
  const boardLeftRH = hasNut ? x - NUT : x
  for (let f = Math.max(1, from); f <= to; f++) {
    x += fretWidth(f)
    edges.set(f, x)
  }
  const boardRightRH = x
  const width = x + PAD_X

  const boardTop = PAD_TOP
  const boardBottom = PAD_TOP + (stringCount - 1) * STRING_SPACING + STRING_SPACING
  const height = boardBottom + PAD_BOTTOM

  const mirror = (value: number) => (leftHanded ? width - value : value)

  const noteXRH = (fret: number) => {
    if (fret === 0 && hasNut) return openCenter
    const right = edges.get(fret)
    const left = edges.get(fret - 1)
    if (right === undefined || left === undefined) throw new Error(`Traste fuera de rango: ${fret}`)
    return (left + right) / 2
  }

  return {
    width,
    height,
    stringY: (string) => boardTop + STRING_SPACING / 2 + (stringCount - 1 - string) * STRING_SPACING,
    noteX: (fret) => mirror(noteXRH(fret)),
    cellWidth: (fret) => (fret === 0 && hasNut ? OPEN_COLUMN : fretWidth(fret)),
    wireX: (fret) => {
      const edge = edges.get(fret)
      if (edge === undefined) throw new Error(`Traste fuera de rango: ${fret}`)
      return mirror(edge)
    },
    hasNut,
    boardTop,
    boardBottom,
    boardLeft: leftHanded ? width - boardRightRH : boardLeftRH,
    boardRight: leftHanded ? width - boardLeftRH : boardRightRH,
    fretNumberY: boardBottom + 22,
  }
}

/** Trastes con marcador (punto); los de valor 2 llevan doble punto. */
export const INLAYS: Record<number, 1 | 2> = { 3: 1, 5: 1, 7: 1, 9: 1, 12: 2, 15: 1, 17: 1, 19: 1, 21: 1, 24: 2 }
