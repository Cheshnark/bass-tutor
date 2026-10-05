/**
 * Matemáticas del pote (sin React): ángulo de la aguja, redondeo al paso, teclado y arrastre.
 * El recorrido es de 270° (de −135° a +135°, 0° arriba), como en un potenciómetro de ampli.
 */

export const SWEEP_DEG = 270
export const START_DEG = -SWEEP_DEG / 2

export interface KnobRange {
  min: number
  max: number
  step: number
}

/** Decimales del paso (0,05 → 2), para no arrastrar errores de coma flotante. */
function decimalsOf(step: number): number {
  const text = String(step)
  const dot = text.indexOf('.')
  return dot === -1 ? 0 : text.length - dot - 1
}

/** Ajusta al paso más cercano y al rango. */
export function snap(value: number, { min, max, step }: KnobRange): number {
  const stepped = min + Math.round((value - min) / step) * step
  const clamped = Math.min(max, Math.max(min, stepped))
  return Number(clamped.toFixed(decimalsOf(step)))
}

/** Ángulo de la aguja para un valor (−135° en el mínimo, +135° en el máximo). */
export function angleOf(value: number, { min, max }: Pick<KnobRange, 'min' | 'max'>): number {
  const t = max === min ? 0 : (Math.min(max, Math.max(min, value)) - min) / (max - min)
  return START_DEG + t * SWEEP_DEG
}

/** Punto a una distancia `r` del centro (cx, cy) en el ángulo dado (0° arriba, sentido horario). */
export function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180
  return { x: cx + r * Math.sin(rad), y: cy - r * Math.cos(rad) }
}

/**
 * Valor tras pulsar una tecla, o `null` si la tecla no es del pote. Flechas: ±1 paso; RePág/AvPág: ±10 pasos;
 * Inicio/Fin: mínimo/máximo (patrón "slider" de WAI-ARIA).
 */
export function keyValue(key: string, value: number, range: KnobRange): number | null {
  const { min, max, step } = range
  switch (key) {
    case 'ArrowUp':
    case 'ArrowRight':
      return snap(value + step, range)
    case 'ArrowDown':
    case 'ArrowLeft':
      return snap(value - step, range)
    case 'PageUp':
      return snap(value + step * 10, range)
    case 'PageDown':
      return snap(value - step * 10, range)
    case 'Home':
      return min
    case 'End':
      return max
    default:
      return null
  }
}

/**
 * Valor al arrastrar en vertical: hacia arriba sube. `travelPx` es lo que hay que arrastrar para recorrer el rango
 * entero (más píxeles = control más fino).
 */
export function dragValue(startValue: number, deltaUpPx: number, range: KnobRange, travelPx: number): number {
  return snap(startValue + (deltaUpPx / travelPx) * (range.max - range.min), range)
}
