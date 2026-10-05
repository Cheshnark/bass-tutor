import { useEffect, useMemo, useRef, useState } from 'react'
import { midiToFrequency } from '../../audio/notePlayer'
import { cents as centsOff, dbToGain, DEFAULT_RANGE, levelFraction, median, nearestMidi, type PitchOptions } from '../../audio/pitch'
import {
  listAudioInputs,
  startReferenceTone,
  startTuner,
  tunerErrorOf,
  type AudioInput,
  type TunerError,
  type TunerHandle,
} from '../../audio/tuner'
import { useSettings } from '../../state/settings'
import { fretPitch } from '../../theory/fretboard'
import { midiName } from '../../theory/notation'
import { getTuning } from '../../theory/tunings'
import { useWakeLock } from '../../useWakeLock'
import { PanelTitle } from '../PanelTitle'
import './Tuner.css'
import { VuMeter } from './VuMeter'

/** Margen para dar la cuerda por afinada (cents). */
const IN_TUNE = 5
const SMOOTHING = 5
/** Lecturas seguidas necesarias antes de mostrar nada: las primeras, al arrancar o al pulsar, son inestables. */
const MIN_READINGS = 3

const ERROR_TEXT: Record<TunerError, string> = {
  'sin-permiso': 'No hay permiso para usar el micrófono. Actívalo en los ajustes del navegador para este sitio.',
  'sin-microfono': 'No se ha encontrado ningún micrófono.',
  'no-soportado': 'Este navegador no deja usar el micrófono desde la web.',
  otro: 'No se ha podido abrir el micrófono.',
}

type Target = 'auto' | number

const MAX_GAIN_DB = 30
const STORAGE_DEVICE = 'bass-tutor.tuner.device'
const STORAGE_GAIN = 'bass-tutor.tuner.gain-db'

/** Preferencias del afinador en este dispositivo; si el almacenamiento no está disponible, se ignoran. */
function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sin almacenamiento: la preferencia no se recuerda */
  }
}

function initialGainDb(): number {
  const stored = Number(readStored(STORAGE_GAIN))
  return Number.isFinite(stored) ? Math.min(MAX_GAIN_DB, Math.max(0, stored)) : 0
}

/** Afinador por micrófono (experimental) y tono de referencia para afinar de oído. */
export function Tuner() {
  const { tuningId, notation } = useSettings()
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

  // Lectura: nota más cercana (automático) o desviación respecto a la cuerda elegida.
  let noteLabel = '—'
  let cents: number | null = null
  if (frequency !== null) {
    if (target === 'auto') {
      const nearest = nearestMidi(frequency)
      noteLabel = midiName(nearest.midi, notation)
      cents = nearest.cents
    } else {
      noteLabel = midiName(openMidis[target], notation)
      cents = centsOff(frequency, midiToFrequency(openMidis[target]))
    }
  }
  const status =
    cents === null
      ? listening
        ? 'Toca una cuerda al aire y déjala sonar.'
        : 'Pulsa "Activar micrófono" para empezar.'
      : Math.abs(cents) <= IN_TUNE
        ? 'Afinado'
        : cents < 0
          ? 'Bajo: sube (tensa la cuerda)'
          : 'Alto: baja (afloja la cuerda)'

  return (
    <section className="panel tuner" aria-labelledby="tuner-title">
      <PanelTitle id="tuner-title">
        Afinador <span className="badge">Experimental</span>
      </PanelTitle>
      <p className="hint">
        Usa el micrófono del dispositivo. Los micros de móvil captan mal los graves y la lectura puede fallar, sobre
        todo en la E y la B. Si no es estable, usa un afinador de pinza o afina de oído con el tono de referencia.
      </p>

      <div className="row">
        {listening ? (
          <button type="button" className="btn btn--big" onClick={stop}>
            Parar micrófono
          </button>
        ) : (
          <button type="button" className="btn btn--primary btn--big" onClick={() => void start()}>
            Activar micrófono
          </button>
        )}
      </div>
      {error && (
        <p role="alert" className="error">
          {ERROR_TEXT[error]}
        </p>
      )}

      <section aria-labelledby="tuner-input" className="tuner-input">
        <h2 id="tuner-input">Entrada</h2>
        <label className="field">
          Dispositivo
          <select
            value={inputs.some((i) => i.deviceId === deviceId) ? deviceId : ''}
            onChange={(e) => changeDevice(e.target.value)}
          >
            <option value="">Predeterminado del sistema</option>
            {inputs
              .filter((i) => i.deviceId !== 'default')
              .map((i) => (
                <option key={i.deviceId} value={i.deviceId}>
                  {i.label}
                </option>
              ))}
          </select>
        </label>
        <label className="field">
          Ganancia: +{gainDb} dB
          <input
            type="range"
            min={0}
            max={MAX_GAIN_DB}
            step={3}
            value={gainDb}
            onChange={(e) => changeGain(Number(e.target.value))}
          />
        </label>
        <label className="field">
          Nivel de entrada
          <meter min={0} max={1} low={0.15} high={0.9} optimum={0.6} value={listening ? levelFraction(level) : 0} />
        </label>
        <p className="hint">
          Toca una cuerda: la barra debería llegar al menos a la mitad sin llenarse del todo. Si apenas se mueve, sube
          la ganancia o elige otra entrada (la lista aparece al activar el micrófono).
        </p>
      </section>

      <fieldset className="tuner-strings">
        <legend>Cuerda</legend>
        <button type="button" className="btn" aria-pressed={target === 'auto'} onClick={() => setTarget('auto')}>
          Automático
        </button>
        {openMidis.map((midi, i) => (
          <button key={i} type="button" className="btn" aria-pressed={target === i} onClick={() => setTarget(i)}>
            {midiName(midi, notation)}
          </button>
        ))}
      </fieldset>

      <div className={`tuner-display${cents !== null && Math.abs(cents) <= IN_TUNE ? ' is-in-tune' : ''}`}>
        <p className="tuner-note" data-testid="tuner-note">
          {noteLabel}
        </p>
        <VuMeter cents={cents} inTune={IN_TUNE} />
        <p className="tuner-cents" data-testid="tuner-cents">
          {cents === null ? '' : `${cents > 0 ? '+' : ''}${Math.round(cents)} cents · ${frequency!.toFixed(1)} Hz`}
        </p>
        <p className="tuner-status" role="status">
          {status}
        </p>
      </div>

      <section aria-labelledby="tuner-reference" className="tuner-reference">
        <h2 id="tuner-reference">Tono de referencia</h2>
        <p className="hint">Para afinar de oído: escucha la nota y ajusta la cuerda hasta que suene igual.</p>
        <div className="row">
          {openMidis.map((midi, i) => (
            <button key={i} type="button" className="btn" aria-pressed={refString === i} onClick={() => void toggleTone(i)}>
              {refString === i ? 'Parar' : 'Escuchar'} {midiName(midi, notation)}
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}
