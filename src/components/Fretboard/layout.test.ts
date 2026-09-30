import { describe, expect, it } from 'vitest'
import { computeLayout, fretWidth } from './layout'

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

describe('computeLayout', () => {
  it('la cuerda más grave se dibuja abajo', () => {
    const l = computeLayout({ stringCount: 4, frets: [0, 12], leftHanded: false })
    expect(l.stringY(0)).toBeGreaterThan(l.stringY(3))
  })

  it('las casillas avanzan hacia la derecha y se estrechan', () => {
    const l = computeLayout({ stringCount: 4, frets: [0, 24], leftHanded: false })
    const xs = range(0, 24).map(l.noteX)
    xs.slice(1).forEach((x, i) => expect(x).toBeGreaterThan(xs[i]))
    expect(fretWidth(24)).toBeLessThan(fretWidth(1))
    // Estrechamiento moderado: el traste 24 conserva ~la mitad de ancho del real... o más.
    expect(fretWidth(24) / fretWidth(1)).toBeGreaterThan(0.5)
  })

  it.each([
    [4, [0, 12]],
    [5, [0, 24]],
    [6, [3, 9]],
  ] as const)('zurdo = espejo exacto (%i cuerdas, trastes %j)', (stringCount, frets) => {
    const rh = computeLayout({ stringCount, frets: [...frets], leftHanded: false })
    const lh = computeLayout({ stringCount, frets: [...frets], leftHanded: true })
    expect(lh.width).toBe(rh.width)
    expect(lh.height).toBe(rh.height)
    for (const f of range(frets[0], frets[1])) {
      expect(lh.noteX(f)).toBeCloseTo(rh.width - rh.noteX(f), 9)
      expect(lh.wireX(f)).toBeCloseTo(rh.width - rh.wireX(f), 9)
    }
    for (let s = 0; s < stringCount; s++) expect(lh.stringY(s)).toBe(rh.stringY(s))
    expect(lh.boardLeft).toBeCloseTo(rh.width - rh.boardRight, 9)
    expect(lh.boardRight).toBeCloseTo(rh.width - rh.boardLeft, 9)
  })

  it('sin cejuela si el rango no empieza en 0', () => {
    const l = computeLayout({ stringCount: 4, frets: [5, 9], leftHanded: false })
    expect(l.hasNut).toBe(false)
    expect(() => l.noteX(4)).toThrow()
    expect(() => l.noteX(10)).toThrow()
  })

  it('más cuerdas = más alto', () => {
    const four = computeLayout({ stringCount: 4, frets: [0, 12], leftHanded: false })
    const six = computeLayout({ stringCount: 6, frets: [0, 12], leftHanded: false })
    expect(six.height).toBeGreaterThan(four.height)
  })
})
