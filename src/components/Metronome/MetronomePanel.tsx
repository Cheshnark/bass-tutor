import { useEffect, useState, type KeyboardEvent } from 'react'
import type { AccentLevel } from '../../audio/accents'
import { MAX_BPM, MIN_BPM } from '../../audio/beatClock'
import { TapTempo } from '../../audio/tapTempo'
import { DEFAULT_LADDER, validateLadder, type LadderConfig, type LadderMode } from '../../audio/tempoLadder'
import { metronomeEngine, useMetronome } from '../../state/metronome'
import { Knob } from '../Knob/Knob'
import { PanelTitle } from '../PanelTitle'
import './Metronome.css'

const SUBDIVISIONS = [
  { value: 1, label: 'Negras' },
  { value: 2, label: 'Corcheas' },
  { value: 3, label: 'Tresillos' },
  { value: 4, label: 'Semicorcheas' },
]

const ACCENT_LABEL: Record<AccentLevel, string> = {
  accent: 'acento',
  normal: 'normal',
  silent: 'silencio',
}

/** Escala del pote de tempo (20–300 BPM). */
const TEMPO_SCALE = [20, 60, 100, 140, 180, 220, 260, 300].map((v) => ({ value: v, label: String(v) }))
/** Escala del pote de volumen: 0–10, como en un ampli. */
const VOLUME_SCALE = [0, 2, 4, 6, 8, 10].map((v) => ({ value: v / 10, label: String(v) }))

interface LadderStatus {
  progress: number
  done: boolean
}

/**
 * Metrónomo completo: tap tempo, acentos, escalera de tempo y pulso visual grande.
 * El estado vive en `useMetronome` (compartido con los `<Metronome/>` de las lecciones).
 */
export function MetronomePanel() {
  const {
    bpm,
    beatsPerBar,
    subdivision,
    accents,
    volume,
    running,
    ladderActive: ladderOn,
    setBpm,
    setBeatsPerBar,
    setSubdivision,
    cycleAccent,
    setVolume,
    start,
    stop,
    setLadder,
  } = useMetronome()
  const [lastBeat, setBeat] = useState<number | null>(null)
  // Parado no hay pulso encendido (derivado, sin setState en el efecto).
  const beat = running ? lastBeat : null
  const [bar, setBar] = useState(0)

  const [ladderConfig, setLadderConfig] = useState<LadderConfig>(DEFAULT_LADDER)
  const [ladderStatus, setLadderStatus] = useState<LadderStatus>({ progress: 0, done: false })
  const ladderError = validateLadder(ladderConfig)

  const [tapTempo] = useState(() => new TapTempo())

  // Pulso visual sincronizado con el reloj de audio, no con temporizadores.
  useEffect(() => {
    if (!running) return
    let frame = 0
    const loop = () => {
      const tick = metronomeEngine.currentTick()
      if (tick) {
        if (tick.subInBeat === 0) setBeat(tick.beatInBar)
        setBar(tick.bar)
        const ladder = metronomeEngine.ladder
        if (ladder) {
          // Con la escalera activa, el tempo lo manda el motor: la UI lo refleja cuando suena.
          if (tick.bpm !== useMetronome.getState().bpm) useMetronome.getState().syncBpm(tick.bpm)
          const { start: from, target } = ladder.config
          setLadderStatus({ progress: (tick.bpm - from) / (target - from), done: tick.bpm >= target })
        }
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [running])

  const toggle = async () => {
    if (running) stop()
    else await start()
  }

  const changeBpm = (value: number) => setBpm(value)
  const changeBeats = (n: number) => setBeatsPerBar(n)

  const tap = () => {
    const result = tapTempo.tap(performance.now())
    if (result !== null) setBpm(result)
  }

  const onTapKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      tap()
    }
  }

  const startLadder = () => {
    if (ladderError) return
    setLadder(ladderConfig)
    setLadderStatus({ progress: 0, done: false })
  }

  const stopLadder = () => setLadder(null)

  const pass = () => {
    const next = useMetronome.getState().pass()
    if (next !== null) {
      const { start: from, target } = ladderConfig
      setLadderStatus({ progress: (next - from) / (target - from), done: next >= target })
    }
  }

  const setLadderField = <K extends keyof LadderConfig>(key: K, value: LadderConfig[K]) => {
    setLadderConfig((prev) => ({ ...prev, [key]: value }))
  }

  const numberField = (key: 'start' | 'target' | 'step' | 'everyBars', label: string) => (
    <label>
      {label}
      <input
        type="number"
        inputMode="numeric"
        value={Number.isNaN(ladderConfig[key]) ? '' : ladderConfig[key]}
        disabled={ladderOn}
        onChange={(e) => setLadderField(key, e.target.valueAsNumber)}
      />
    </label>
  )

  return (
    <section className="panel metronome" aria-labelledby="metronome-title">
      <PanelTitle id="metronome-title">Metrónomo</PanelTitle>

      {/* Frontal: ventana con el tempo, pilotos de pulso, pote de tempo e interruptor de marcha. */}
      <div className="met-front">
        <div className="met-window" aria-live="off">
          <span className="met-bpm" data-testid="bpm-display">
            {bpm}
          </span>
          <span className="met-unit">BPM</span>
          {ladderOn && <span className="met-target">→ {ladderConfig.target}</span>}
          <span className="met-meta">
            <span>
              {beatsPerBar}/4 · {SUBDIVISIONS.find((s) => s.value === subdivision)?.label}
            </span>
            {running && <span className="met-bar">Compás {bar + 1}</span>}
          </span>
        </div>

        <div className="met-beats" role="group" aria-label="Pulsos del compás: pulsa uno para cambiar su acento">
          {accents.map((level, i) => (
            <button
              key={i}
              type="button"
              className={`met-beat met-beat--${level}${beat === i ? ' met-beat--on' : ''}`}
              aria-label={`Pulso ${i + 1}: ${ACCENT_LABEL[level]}`}
              onClick={() => cycleAccent(i)}
            >
              <span className={`pilot${beat === i && level !== 'silent' ? ' pilot--on' : ''}`} aria-hidden="true" />
              <span className="met-beat__label" aria-hidden="true">
                {i + 1}
                {level === 'accent' && <span className="met-beat__accent">&gt;</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="met-tempo-controls">
          <Knob
            label="Tempo"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            onChange={changeBpm}
            disabled={ladderOn}
            scale={TEMPO_SCALE}
            valueText={(v) => `${v} BPM`}
            travelPx={280}
            className="met-knob"
          />
          <div className="met-tempo">
            <button type="button" className="btn" disabled={ladderOn} onClick={() => changeBpm(bpm - 5)} aria-label="Bajar 5 BPM">
              −5
            </button>
            <button type="button" className="btn" disabled={ladderOn} onClick={() => changeBpm(bpm - 1)} aria-label="Bajar 1 BPM">
              −1
            </button>
            <input
              className="met-bpm-input"
              type="number"
              inputMode="numeric"
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              disabled={ladderOn}
              onChange={(e) => changeBpm(e.target.valueAsNumber)}
              aria-label="BPM"
            />
            <button type="button" className="btn" disabled={ladderOn} onClick={() => changeBpm(bpm + 1)} aria-label="Subir 1 BPM">
              +1
            </button>
            <button type="button" className="btn" disabled={ladderOn} onClick={() => changeBpm(bpm + 5)} aria-label="Subir 5 BPM">
              +5
            </button>
          </div>
        </div>

        <button type="button" className="met-switch met-start" onClick={toggle} aria-pressed={running}>
          {/* Interruptor de palanca: arriba = en marcha. */}
          <svg className="met-switch__lever" viewBox="0 0 52 64" aria-hidden="true" focusable="false">
            <circle cx="26" cy="32" r="16" fill="#8f8a80" />
            <circle cx="26" cy="32" r="12" fill="#d9d4c8" />
            <path
              d="M22.5 32 L20.5 7 Q26 2.5 31.5 7 L29.5 32 Z"
              fill="#ece8df"
              stroke="#6b665d"
              transform={running ? undefined : 'rotate(180 26 32)'}
            />
            <circle cx="26" cy="32" r="5" fill="#5a5650" />
          </svg>
          <span className="met-switch__label">{running ? 'Parar' : 'Iniciar'}</span>
          <span className={`pilot${running ? ' pilot--on' : ''}`} aria-hidden="true" />
        </button>

        <button type="button" className="btn met-tap" disabled={ladderOn} onPointerDown={tap} onKeyDown={onTapKey}>
          Tap
        </button>
      </div>

      <div className="controls met-settings">
        <label>
          Compás
          <select value={beatsPerBar} onChange={(e) => changeBeats(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 9, 12].map((n) => (
              <option key={n} value={n}>
                {n}/4
              </option>
            ))}
          </select>
        </label>
        <label>
          Subdivisión
          <select value={subdivision} onChange={(e) => setSubdivision(Number(e.target.value))}>
            {SUBDIVISIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <div className="met-volume">
          <span aria-hidden="true">Volumen</span>
          <Knob
            label="Volumen"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={setVolume}
            scale={VOLUME_SCALE}
            valueText={(v) => `${(v * 10).toLocaleString('es', { maximumFractionDigits: 1 })} de 10`}
            travelPx={200}
            className="met-knob met-knob--small knob--small"
          />
        </div>
      </div>

      <details className="met-ladder" open={ladderOn || undefined}>
        <summary>Escalera de tempo</summary>
        <p className="hint">
          Empieza lento y sube poco a poco. Sube solo cuando lo toques limpio, a tiempo y sin tensión.
        </p>
        <div className="controls">
          {numberField('start', 'Inicio (BPM)')}
          {numberField('target', 'Objetivo (BPM)')}
          {numberField('step', 'Paso (BPM)')}
          <label>
            Subir
            <select
              value={ladderConfig.mode}
              disabled={ladderOn}
              onChange={(e) => setLadderField('mode', e.target.value as LadderMode)}
            >
              <option value="manual">Al marcar un pase</option>
              <option value="bars">Cada N compases</option>
            </select>
          </label>
          {ladderConfig.mode === 'bars' && numberField('everyBars', 'N compases')}
        </div>

        {ladderError && !ladderOn && (
          <p className="error" role="alert">
            {ladderError}
          </p>
        )}

        {ladderOn && (
          <div className="met-ladder-status">
            <progress value={ladderStatus.progress} max={1} aria-label="Progreso de la escalera" />
            <p>
              {ladderStatus.done
                ? `¡Objetivo alcanzado: ${ladderConfig.target} BPM!`
                : `${bpm} → ${ladderConfig.target} BPM`}
            </p>
          </div>
        )}

        <div className="row">
          {ladderOn ? (
            <>
              <button type="button" className="btn btn--primary" onClick={pass} disabled={ladderStatus.done}>
                Pase limpio: +{ladderConfig.step}
              </button>
              <button type="button" className="btn" onClick={startLadder}>
                Reiniciar
              </button>
              <button type="button" className="btn" onClick={stopLadder}>
                Quitar escalera
              </button>
            </>
          ) : (
            <button type="button" className="btn" onClick={startLadder} disabled={!!ladderError}>
              Activar escalera
            </button>
          )}
        </div>
      </details>
    </section>
  )
}
