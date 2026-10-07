import { levelFraction } from '../../audio/pitch'
import { type TunerError } from '../../audio/tuner'
import { useSettings } from '../../state/settings'
import { midiName } from '../../theory/notation'
import { PanelTitle } from '../PanelTitle'
import './Tuner.css'
import { IN_TUNE, MAX_GAIN_DB, tunerReading, useTuner } from './useTuner'
import { VuMeter } from './VuMeter'

const ERROR_TEXT: Record<TunerError, string> = {
  'sin-permiso': 'No hay permiso para usar el micrófono. Actívalo en los ajustes del navegador para este sitio.',
  'sin-microfono': 'No se ha encontrado ningún micrófono.',
  'no-soportado': 'Este navegador no deja usar el micrófono desde la web.',
  otro: 'No se ha podido abrir el micrófono.',
}

/** Afinador por micrófono (experimental) y tono de referencia para afinar de oído. */
export function Tuner() {
  const { tuningId, notation } = useSettings()
  const {
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
  } = useTuner(tuningId)

  const { midi, cents } = tunerReading(frequency, target, openMidis)
  const noteLabel = midi === null ? '—' : midiName(midi, notation)
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
