import { describe, expect, it } from 'vitest'
import { cents, decimate, DEFAULT_RANGE, detectPitch, median, nearestMidi, rms } from './pitch'

/** Ruido pseudoaleatorio reproducible. */
function noise(seed = 7) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646 - 0.5
  }
}

/**
 * Señal sintética tipo bajo: fundamental más armónicos. Con micrófono de móvil, el 2.º armónico suele ser más
 * fuerte que la fundamental (research.md), así que el caso "bajo" lo exagera a propósito.
 */
function tone(frequency: number, sampleRate: number, length: number, harmonics = [1], noiseLevel = 0): Float32Array {
  const out = new Float32Array(length)
  const rand = noise()
  for (let i = 0; i < length; i++) {
    let v = 0
    harmonics.forEach((amp, h) => (v += amp * Math.sin((2 * Math.PI * frequency * (h + 1) * i) / sampleRate)))
    out[i] = v * 0.3 + noiseLevel * rand()
  }
  return out
}

/** Lo que hace el afinador: 8192 muestras, diezmadas a ~12 kHz. */
function measure(frequency: number, sampleRate = 48_000, harmonics = [1], noiseLevel = 0) {
  const factor = Math.round(sampleRate / 12_000)
  const signal = decimate(tone(frequency, sampleRate, 8192, harmonics, noiseLevel), factor)
  return detectPitch(signal, sampleRate / factor, DEFAULT_RANGE)
}

const OPEN_STRINGS = { B0: 30.868, E1: 41.203, A1: 55.0, D2: 73.416, G2: 97.999, C3: 130.813 }
const BASS_LIKE = [0.5, 1, 0.6, 0.4, 0.25, 0.15]

describe('detectPitch: criterio de la Fase 5 (error < ±3 cents con tono sintético)', () => {
  for (const [name, f] of Object.entries(OPEN_STRINGS)) {
    it(`${name} (${f} Hz), seno puro a 48 kHz`, () => {
      const result = measure(f)
      expect(result).not.toBeNull()
      expect(Math.abs(cents(result!.frequency, f))).toBeLessThan(3)
    })

    it(`${name} con 2.º armónico dominante y ruido (sin error de octava)`, () => {
      const result = measure(f, 48_000, BASS_LIKE, 0.05)
      expect(result).not.toBeNull()
      expect(Math.abs(cents(result!.frequency, f))).toBeLessThan(3)
    })
  }

  it('a 44,1 kHz también', () => {
    for (const f of Object.values(OPEN_STRINGS)) {
      const result = measure(f, 44_100, BASS_LIKE)
      expect(Math.abs(cents(result!.frequency, f))).toBeLessThan(3)
    }
  })

  it('distingue una cuerda desafinada ±10 cents', () => {
    const e1 = OPEN_STRINGS.E1
    for (const offset of [-10, 10]) {
      const detuned = e1 * Math.pow(2, offset / 1200)
      const result = measure(detuned, 48_000, BASS_LIKE)
      expect(cents(result!.frequency, e1)).toBeCloseTo(offset, 0)
    }
  })

  it('notas pisadas más agudas (G3, traste 12 de la G)', () => {
    const result = measure(196, 48_000, BASS_LIKE)
    expect(Math.abs(cents(result!.frequency, 196))).toBeLessThan(3)
  })

  it('el ruido sin tono no da lectura', () => {
    const rand = noise(3)
    const signal = Float32Array.from({ length: 2048 }, () => rand())
    expect(detectPitch(signal, 12_000, DEFAULT_RANGE)).toBeNull()
  })

  it('una ventana demasiado corta para el rango no da lectura', () => {
    expect(detectPitch(new Float32Array(256), 12_000, DEFAULT_RANGE)).toBeNull()
  })
})

describe('utilidades', () => {
  it('nearestMidi', () => {
    expect(nearestMidi(440)).toEqual({ midi: 69, cents: 0 })
    const e1 = nearestMidi(41.203)
    expect(e1.midi).toBe(28)
    expect(Math.abs(e1.cents)).toBeLessThan(0.1)
    expect(nearestMidi(440 * Math.pow(2, 20 / 1200)).cents).toBeCloseTo(20, 5)
  })

  it('cents', () => {
    expect(cents(880, 440)).toBeCloseTo(1200)
    expect(cents(440, 440)).toBe(0)
  })

  it('median', () => {
    expect(median([3, 1, 2])).toBe(2)
    expect(median([4, 1, 2, 3])).toBe(2.5)
    // Un error de octava aislado no mueve la mediana.
    expect(median([41.2, 41.3, 82.4, 41.1, 41.2])).toBe(41.2)
  })

  it('rms y decimate', () => {
    expect(rms(new Float32Array([1, -1, 1, -1]))).toBe(1)
    expect(Array.from(decimate(new Float32Array([1, 3, 5, 7]), 2))).toEqual([2, 6])
  })
})
