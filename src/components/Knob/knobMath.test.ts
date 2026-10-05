import { describe, expect, it } from 'vitest'
import { angleOf, dragValue, keyValue, polar, snap } from './knobMath'

const bpm = { min: 20, max: 300, step: 1 }
const volume = { min: 0, max: 1, step: 0.05 }

describe('pote', () => {
  it('ajusta al paso y al rango sin errores de coma flotante', () => {
    expect(snap(80.4, bpm)).toBe(80)
    expect(snap(5, bpm)).toBe(20)
    expect(snap(999, bpm)).toBe(300)
    expect(snap(0.1 + 0.2, volume)).toBe(0.3)
    expect(snap(0.62, volume)).toBe(0.6)
  })

  it('recorre 270°: −135° en el mínimo, 0° en el centro y +135° en el máximo', () => {
    expect(angleOf(20, bpm)).toBe(-135)
    expect(angleOf(160, bpm)).toBe(0)
    expect(angleOf(300, bpm)).toBe(135)
    expect(angleOf(0.5, volume)).toBe(0)
  })

  it('coloca los puntos con 0° arriba y en sentido horario', () => {
    const top = polar(100, 100, 50, 0)
    expect(top.x).toBeCloseTo(100)
    expect(top.y).toBeCloseTo(50)
    const right = polar(100, 100, 50, 90)
    expect(right.x).toBeCloseTo(150)
    expect(right.y).toBeCloseTo(100)
  })

  it('responde al teclado como un slider de WAI-ARIA', () => {
    expect(keyValue('ArrowUp', 80, bpm)).toBe(81)
    expect(keyValue('ArrowLeft', 80, bpm)).toBe(79)
    expect(keyValue('PageUp', 80, bpm)).toBe(90)
    expect(keyValue('PageDown', 25, bpm)).toBe(20)
    expect(keyValue('Home', 80, bpm)).toBe(20)
    expect(keyValue('End', 80, bpm)).toBe(300)
    expect(keyValue('ArrowUp', 0.95, volume)).toBe(1)
    expect(keyValue('a', 80, bpm)).toBeNull()
  })

  it('arrastrar hacia arriba sube y hacia abajo baja, en proporción al recorrido', () => {
    expect(dragValue(80, 28, bpm, 280)).toBe(108)
    expect(dragValue(80, -100, bpm, 280)).toBe(20)
    expect(dragValue(0.5, 50, volume, 200)).toBe(0.75)
  })
})
