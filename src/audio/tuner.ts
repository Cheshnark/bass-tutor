/**
 * Capa Web Audio del afinador: micrófono → AnalyserNode → detección YIN (pitch.ts) unas 15 veces por segundo.
 * También el tono de referencia para afinar de oído.
 */
import { getAudioContext } from './context'
import { midiToFrequency } from './notePlayer'
import { decimate, detectPitch, rms, type PitchOptions } from './pitch'

export interface TunerReading {
  frequency: number
  clarity: number
}

/** Frecuencia de trabajo tras diezmar: suficiente para la fundamental del bajo. */
const TARGET_RATE = 12_000
/** Ventana: 8192 muestras a 48 kHz ≈ 170 ms (más de 5 periodos de B0). */
const FFT_SIZE = 8192
/** Por debajo de este nivel se considera silencio. */
const MIN_LEVEL = 0.005
const MIN_CLARITY = 0.8
const ANALYSIS_INTERVAL_MS = 66

export type TunerError = 'sin-permiso' | 'sin-microfono' | 'no-soportado' | 'otro'

export function tunerErrorOf(error: unknown): TunerError {
  const name = (error as { name?: string })?.name
  if (name === 'NotAllowedError' || name === 'SecurityError') return 'sin-permiso'
  if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'sin-microfono'
  return 'otro'
}

/**
 * Abre el micrófono y llama a `onReading` con cada lectura (o null si hay silencio o ruido).
 * `getRange` se consulta en cada análisis para poder cambiar de cuerda sin reabrir el micrófono.
 * Devuelve una función para parar y liberar todo.
 */
export async function startTuner(
  onReading: (reading: TunerReading | null) => void,
  getRange: () => PitchOptions,
): Promise<() => void> {
  if (!navigator.mediaDevices?.getUserMedia) throw Object.assign(new Error('getUserMedia no disponible'), { name: 'NotSupported' })
  // Sin cancelación de eco ni supresión de ruido: estropean los graves. En iOS, quitar la cancelación de eco
  // quita también el control automático de ganancia (WebKit bug 179411).
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
  })
  const ctx = await getAudioContext()
  const source = ctx.createMediaStreamSource(stream)
  const analyser = ctx.createAnalyser()
  analyser.fftSize = FFT_SIZE
  source.connect(analyser) // no se conecta a la salida: no hay realimentación

  const buffer = new Float32Array(analyser.fftSize)
  const factor = Math.max(1, Math.round(ctx.sampleRate / TARGET_RATE))
  let frame = 0
  let last = 0

  const tick = (now: number) => {
    frame = requestAnimationFrame(tick)
    if (now - last < ANALYSIS_INTERVAL_MS) return
    last = now
    analyser.getFloatTimeDomainData(buffer)
    if (rms(buffer) < MIN_LEVEL) {
      onReading(null)
      return
    }
    const result = detectPitch(decimate(buffer, factor), ctx.sampleRate / factor, getRange())
    onReading(result && result.clarity >= MIN_CLARITY ? result : null)
  }
  frame = requestAnimationFrame(tick)

  return () => {
    cancelAnimationFrame(frame)
    source.disconnect()
    stream.getTracks().forEach((t) => t.stop())
  }
}

/**
 * Tono de referencia sostenido (para afinar de oído) hasta que se pare. Diente de sierra suave filtrado,
 * con rampas de entrada y salida para que no haga clic.
 */
export async function startReferenceTone(midi: number): Promise<() => void> {
  const ctx = await getAudioContext()
  const freq = midiToFrequency(midi)
  const osc = ctx.createOscillator()
  osc.type = 'sawtooth'
  osc.frequency.value = freq
  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = Math.min(freq * 6, 1500)
  const gain = ctx.createGain()
  const t = ctx.currentTime
  gain.gain.setValueAtTime(0, t)
  gain.gain.linearRampToValueAtTime(0.25, t + 0.05)
  osc.connect(filter).connect(gain).connect(ctx.destination)
  osc.start(t)

  return () => {
    const end = ctx.currentTime
    gain.gain.cancelScheduledValues(end)
    gain.gain.setValueAtTime(gain.gain.value, end)
    gain.gain.linearRampToValueAtTime(0, end + 0.05)
    osc.stop(end + 0.06)
  }
}
