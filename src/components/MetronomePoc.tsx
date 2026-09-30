import { useEffect, useState } from 'react'
import { clampBpm, MAX_BPM, MIN_BPM } from '../audio/beatClock'
import { Metronome } from '../audio/metronome'

const SUBDIVISIONS = [
  { value: 1, label: 'Negras' },
  { value: 2, label: 'Corcheas' },
  { value: 3, label: 'Tresillos' },
  { value: 4, label: 'Semicorcheas' },
]

/** Prueba de concepto del metrónomo (Fase 0). Sin estilo "cabezal" todavía. */
export function MetronomePoc() {
  const [bpm, setBpm] = useState(80)
  const [beatsPerBar, setBeatsPerBar] = useState(4)
  const [subdivision, setSubdivision] = useState(1)
  const [running, setRunning] = useState(false)
  const [beat, setBeat] = useState<number | null>(null)

  // Se crea una sola vez; el AudioContext no existe hasta pulsar "Iniciar".
  const [metronome] = useState(() => new Metronome({ bpm, beatsPerBar, subdivision }))

  useEffect(() => {
    metronome.update({ bpm, beatsPerBar, subdivision })
  }, [metronome, bpm, beatsPerBar, subdivision])

  // Indicador visual sincronizado con el reloj de audio, no con setInterval.
  useEffect(() => {
    if (!running) return
    let frame = 0
    const loop = () => {
      const tick = metronome.currentTick()
      if (tick && tick.subInBeat === 0) setBeat(tick.beatInBar)
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [metronome, running])

  useEffect(() => {
    return () => {
      metronome.dispose()
    }
  }, [metronome])

  const toggle = async () => {
    if (metronome.isRunning) {
      metronome.stop()
      setRunning(false)
      setBeat(null)
    } else {
      await metronome.start()
      setRunning(true)
    }
  }

  const changeBpm = (value: number) => {
    if (Number.isFinite(value)) setBpm(clampBpm(Math.round(value)))
  }

  return (
    <section className="panel" aria-labelledby="metronome-title">
      <h2 id="metronome-title">Metrónomo</h2>

      <div className="beats" aria-hidden="true">
        {Array.from({ length: beatsPerBar }, (_, i) => (
          <span
            key={i}
            className={`beat${beat === i ? ' beat--on' : ''}${i === 0 ? ' beat--first' : ''}`}
          />
        ))}
      </div>

      <div className="row">
        <button type="button" className="btn" onClick={() => changeBpm(bpm - 5)} aria-label="Bajar 5 BPM">
          −5
        </button>
        <label className="bpm">
          <input
            type="number"
            inputMode="numeric"
            min={MIN_BPM}
            max={MAX_BPM}
            value={bpm}
            onChange={(e) => changeBpm(e.target.valueAsNumber)}
            aria-label="BPM"
          />
          <span>BPM</span>
        </label>
        <button type="button" className="btn" onClick={() => changeBpm(bpm + 5)} aria-label="Subir 5 BPM">
          +5
        </button>
      </div>

      <div className="row">
        <label>
          Compás{' '}
          <select value={beatsPerBar} onChange={(e) => setBeatsPerBar(Number(e.target.value))}>
            {[2, 3, 4, 5, 6, 7].map((n) => (
              <option key={n} value={n}>
                {n}/4
              </option>
            ))}
          </select>
        </label>
        <label>
          Subdivisión{' '}
          <select value={subdivision} onChange={(e) => setSubdivision(Number(e.target.value))}>
            {SUBDIVISIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button type="button" className="btn btn--primary" onClick={toggle} aria-pressed={running}>
        {running ? 'Parar' : 'Iniciar'}
      </button>
    </section>
  )
}
