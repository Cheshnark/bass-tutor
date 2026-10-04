/**
 * Detección de tono para el afinador (lógica pura, sin Web Audio).
 *
 * Algoritmo YIN (de Cheveigné y Kawahara, 2002): función diferencia, diferencia normalizada por la media acumulada
 * (CMND), umbral absoluto, mínimo local e interpolación parabólica. Ver docs/research.md (afinador):
 * - E1 = 41,2 Hz (periodo ≈ 24 ms) y B0 ≈ 30,9 Hz: hacen falta ventanas largas (≥ 4096 muestras a 48 kHz).
 * - Para que sea barato, la señal se diezma (p. ej., 48 kHz → 12 kHz): el bajo no necesita más ancho de banda
 *   para encontrar la fundamental.
 * - Limitar el rango de búsqueda (p. ej., a la cuerda elegida) reduce los errores de octava.
 */

export interface PitchOptions {
  /** Frecuencia más grave que se busca (Hz). */
  minFrequency: number
  /** Frecuencia más aguda que se busca (Hz). */
  maxFrequency: number
  /** Umbral de la CMND (YIN usa 0,1–0,15). Más bajo = más exigente. */
  threshold?: number
}

export interface PitchResult {
  frequency: number
  /** 1 − CMND en el mínimo: cerca de 1 = tono claro; cerca de 0 = ruido. */
  clarity: number
}

/** Rango de búsqueda por defecto: de B0 (≈ 30,9 Hz) a unos 400 Hz. */
export const DEFAULT_RANGE = { minFrequency: 28, maxFrequency: 400 }

/**
 * Reduce la frecuencia de muestreo por `factor` promediando bloques (filtro paso bajo sencillo + diezmado).
 * Basta para quedarse con la zona grave, donde está la fundamental del bajo.
 */
export function decimate(input: Float32Array, factor: number): Float32Array {
  if (factor <= 1) return input
  const out = new Float32Array(Math.floor(input.length / factor))
  for (let i = 0; i < out.length; i++) {
    let sum = 0
    for (let k = 0; k < factor; k++) sum += input[i * factor + k]
    out[i] = sum / factor
  }
  return out
}

/** Nivel RMS de la señal (para ignorar el silencio). */
export function rms(samples: Float32Array): number {
  let sum = 0
  for (let i = 0; i < samples.length; i++) sum += samples[i] * samples[i]
  return Math.sqrt(sum / Math.max(samples.length, 1))
}

/** Ganancia lineal equivalente a unos decibelios. */
export function dbToGain(db: number): number {
  return Math.pow(10, db / 20)
}

/** Nivel RMS como fracción 0–1 de un medidor que va de −60 dBFS a 0 dBFS. */
export function levelFraction(level: number): number {
  if (level <= 0) return 0
  return Math.min(1, Math.max(0, (20 * Math.log10(level) + 60) / 60))
}

/** Frecuencia fundamental con YIN, o null si no hay un tono claro en el rango. */
export function detectPitch(samples: Float32Array, sampleRate: number, options: PitchOptions): PitchResult | null {
  const threshold = options.threshold ?? 0.15
  const tauMin = Math.max(2, Math.floor(sampleRate / options.maxFrequency))
  const tauMax = Math.ceil(sampleRate / options.minFrequency)
  const window = samples.length - tauMax - 1
  if (window < tauMax) return null // ventana demasiado corta para el periodo más largo

  // 1–2. Función diferencia y su versión normalizada (CMND).
  const cmnd = new Float32Array(tauMax + 2)
  cmnd[0] = 1
  let runningSum = 0
  for (let tau = 1; tau <= tauMax + 1; tau++) {
    let d = 0
    for (let j = 0; j < window; j++) {
      const delta = samples[j] - samples[j + tau]
      d += delta * delta
    }
    runningSum += d
    cmnd[tau] = runningSum === 0 ? 1 : (d * tau) / runningSum
  }

  // 3–4. Primer valor bajo el umbral dentro del rango y, desde ahí, el mínimo local.
  let tau = -1
  for (let t = tauMin; t <= tauMax; t++) {
    if (cmnd[t] < threshold) {
      while (t + 1 <= tauMax && cmnd[t + 1] < cmnd[t]) t++
      tau = t
      break
    }
  }
  if (tau === -1) return null

  // 5. Interpolación parabólica alrededor del mínimo.
  const a = cmnd[tau - 1]
  const b = cmnd[tau]
  const c = cmnd[tau + 1]
  const denominator = a - 2 * b + c
  const shift = denominator === 0 ? 0 : (a - c) / (2 * denominator)
  const period = tau + Math.max(-1, Math.min(1, shift))
  return { frequency: sampleRate / period, clarity: Math.max(0, 1 - b) }
}

/** Desviación en cents de `frequency` respecto a `reference`. */
export function cents(frequency: number, reference: number): number {
  return 1200 * Math.log2(frequency / reference)
}

/** Nota MIDI más cercana a una frecuencia (La4 = 440 Hz) y cuántos cents se desvía de ella. */
export function nearestMidi(frequency: number): { midi: number; cents: number } {
  const exact = 69 + 12 * Math.log2(frequency / 440)
  const midi = Math.round(exact)
  return { midi, cents: (exact - midi) * 100 }
}

/** Mediana (para suavizar lecturas sucesivas sin que un error de octava aislado mueva la aguja). */
export function median(values: readonly number[]): number {
  const sorted = [...values].sort((x, y) => x - y)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
