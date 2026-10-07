import { useEffect, useMemo, useRef, useState } from 'react'
import { midiToFrequency } from '../../audio/notePlayer'
import { cents as centsOff, dbToGain, DEFAULT_RANGE, median, nearestMidi, type PitchOptions } from '../../audio/pitch'
import {
  listAudioInputs,
  startReferenceTone,
  startTuner,
  tunerErrorOf,
  type AudioInput,
  type TunerError,
  type TunerHandle,
} from '../../audio/tuner'
import { readStored, writeStored } from '../../storage'
import { fretPitch } from '../../theory/fretboard'
import { getTuning } from '../../theory/tunings'
import { useWakeLock } from '../../useWakeLock'

/** Margen para dar la cuerda por afinada (cents). */
export const IN_TUNE = 5
export const MAX_GAIN_DB = 30
const SMOOTHING = 5
/** Lecturas seguidas necesarias antes de mostrar nada: las primeras, al arrancar o al pulsar, son inestables. */
const MIN_READINGS = 3

const STORAGE_DEVICE = 'bass-tutor.tuner.device'
const STORAGE_GAIN = 'bass-tutor.tuner.gain-db'

/** Cuerda a afinar: `'auto'` detecta la nota más cercana; un número es el índice de la cuerda. */
export type Target = 'auto' | number

function initialGainDb(): number {
  const stored = Number(readStored(STORAGE_GAIN))
  return Number.isFinite(stored) ? Math.min(MAX_GAIN_DB, Math.max(0, stored)) : 0
}

/**
 * Estado y audio del afinador: micrófono, entrada y ganancia recordadas, lectura suavizada y tono de referencia.
 * `Tuner` solo pinta lo que este hook devuelve.
 */
export function useTuner(tuningId: string) {
  const openMidis = useMemo(() => getTuning(tuningId).strings.map((open) => fretPitch(open, 0).midi), [tuningId])

  const [listening, setListening] = useState(false)
  const [error, setError] = useState<TunerError | null>(null)
  const [target, setTarget] = useState<Target>('auto')
  const [frequency, setFrequency] = useState<number | null>(null)
  const [refString, setRefString] = useState<number | null>(null)
  const [inputs, setInputs] = useState<AudioInput[]>([])
  const [deviceId, setDeviceId] = useState(() => readStored(STORAGE_DEVICE) ?? '')
  const [gainDb, setGainDb] = useState(initialGainDb)
  const [level, setLevel] = useState(0)
  useWakeLock(listening)

  const stopRef = useRef<TunerHandle | null>(null)
  const gainDbRef = useRef(gainDb)
  const stopToneRef = useRef<(() => void) | null>(null)
  const history = useRef<number[]>([])
  const rangeRef = useRef<PitchOptions>(DEFAULT_RANGE)

  // Con una cuerda elegida, solo se busca cerca de ella (± media octava): evita errores de octava.
  useEffect(() => {
    if (target === 'auto') {
      rangeRef.current = DEFAULT_RANGE
    } else {
      const f = midiToFrequency(openMidis[target])
      rangeRef.current = { minFrequency: f / 1.42, maxFrequency: f * 1.42 }
    }
    history.current = []
  }, [target, openMidis])

  // Al salir de la vista se libera el micrófono y se para el tono.
  useEffect(
    () => () => {
      stopRef.current?.stop()
      stopToneRef.current?.()
    },
    [],
  )

  // La lista de entradas se mantiene al día mientras se escucha (conectar o desconectar un cable o una interfaz).
  useEffect(() => {
    if (!listening) return
    const refresh = () => void listAudioInputs().then(setInputs)
    refresh()
    navigator.mediaDevices.addEventListener('devicechange', refresh)
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh)
  }, [listening])

  const open = (id: string) =>
    startTuner(
      (reading) => {
        if (!reading) {
          history.current = []
          setFrequency(null)
          return
        }
        history.current = [...history.current, reading.frequency].slice(-SMOOTHING)
        setFrequency(history.current.length >= MIN_READINGS ? median(history.current) : null)
      },
      () => rangeRef.current,
      { deviceId: id || undefined, gain: dbToGain(gainDbRef.current), onLevel: setLevel },
    )

  const start = async (id = deviceId) => {
    setError(null)
    try {
      try {
        stopRef.current = await open(id)
      } catch (e) {
        // La entrada recordada ya no existe (otro equipo, cable desconectado): se vuelve a la predeterminada.
        if (!id || tunerErrorOf(e) !== 'sin-microfono') throw e
        setDeviceId('')
        stopRef.current = await open('')
      }
      setListening(true)
    } catch (e) {
      setError((e as { name?: string })?.name === 'NotSupported' ? 'no-soportado' : tunerErrorOf(e))
    }
  }

  const stop = () => {
    stopRef.current?.stop()
    stopRef.current = null
    setListening(false)
    setFrequency(null)
    setLevel(0)
  }

  const changeDevice = (id: string) => {
    setDeviceId(id)
    writeStored(STORAGE_DEVICE, id)
    if (listening) {
      stop()
      void start(id)
    }
  }

  const changeGain = (db: number) => {
    setGainDb(db)
    gainDbRef.current = db
    writeStored(STORAGE_GAIN, String(db))
    stopRef.current?.setGain(dbToGain(db))
  }

  const toggleTone = async (string: number) => {
    stopToneRef.current?.()
    stopToneRef.current = null
    if (refString === string) {
      setRefString(null)
      return
    }
    stopToneRef.current = await startReferenceTone(openMidis[string])
    setRefString(string)
  }

  return {
    openMidis,
    listening,
    error,
    target,
    setTarget,
    frequency,
    refString,
    inputs,
    deviceId,
    gainDb,
    level,
    start,
    stop,
    changeDevice,
    changeGain,
    toggleTone,
  }
}

/**
 * Lectura para mostrar: la nota más cercana (automático) o la desviación respecto a la cuerda elegida.
 * Con `frequency` nulo no hay nota ni cents.
 */
export function tunerReading(
  frequency: number | null,
  target: Target,
  openMidis: number[],
): { midi: number | null; cents: number | null } {
  if (frequency === null) return { midi: null, cents: null }
  if (target === 'auto') {
    const nearest = nearestMidi(frequency)
    return { midi: nearest.midi, cents: nearest.cents }
  }
  return { midi: openMidis[target], cents: centsOff(frequency, midiToFrequency(openMidis[target])) }
}
