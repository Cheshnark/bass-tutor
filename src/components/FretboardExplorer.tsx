import { useMemo, useState } from 'react'
import { ARPEGGIOS, INTERVALS, ROOTS, SCALES, type CatalogEntry } from '../theory/catalog'
import type { FretboardMode, FretboardView, LabelMode } from '../theory/fretboard'
import { formatNote, type Notation } from '../theory/notation'
import { DEFAULT_TUNING_ID, getTuning, TUNINGS } from '../theory/tunings'
import { Fretboard } from './Fretboard/Fretboard'

const MODES: { id: FretboardMode; label: string }[] = [
  { id: 'notes', label: 'Notas' },
  { id: 'scale', label: 'Escala' },
  { id: 'arpeggio', label: 'Arpegio' },
  { id: 'interval', label: 'Intervalo' },
]

const LABELS: { id: LabelMode; label: string }[] = [
  { id: 'note', label: 'Nota' },
  { id: 'degree', label: 'Grado' },
  { id: 'interval', label: 'Intervalo' },
]

const CATALOG: Record<Exclude<FretboardMode, 'notes'>, CatalogEntry[]> = {
  scale: SCALES,
  arpeggio: ARPEGGIOS,
  interval: INTERVALS,
}

const DEFAULT_TYPE: Record<Exclude<FretboardMode, 'notes'>, string> = {
  scale: 'minor pentatonic',
  arpeggio: 'm7',
  interval: '5P',
}

/** Explorador del mástil (Fase 1). Estado local; se moverá a un store en la Fase 3. */
export function FretboardExplorer() {
  const [tuningId, setTuningId] = useState(DEFAULT_TUNING_ID)
  const [leftHanded, setLeftHanded] = useState(false)
  const [notation, setNotation] = useState<Notation>('anglo')
  const [mode, setMode] = useState<FretboardMode>('scale')
  const [root, setRoot] = useState('A')
  const [types, setTypes] = useState(DEFAULT_TYPE)
  const [labels, setLabels] = useState<LabelMode>('note')
  const [lastFret, setLastFret] = useState(12)

  const tuning = getTuning(tuningId)
  const type = mode === 'notes' ? undefined : types[mode]
  const view = useMemo<FretboardView>(
    () => ({ mode, root, type, frets: [0, lastFret], labels: mode === 'notes' ? 'note' : labels }),
    [mode, root, type, lastFret, labels],
  )

  const typeLabel = mode === 'notes' ? undefined : CATALOG[mode].find((e) => e.id === type)?.label
  const description = typeLabel ? `${formatNote(root, notation)} · ${typeLabel}` : 'todas las notas'

  return (
    <section className="panel" aria-labelledby="fretboard-title">
      <h2 id="fretboard-title">Mástil</h2>

      <div className="controls">
        <label>
          Afinación
          <select value={tuningId} onChange={(e) => setTuningId(e.target.value)}>
            {TUNINGS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Ver
          <select value={mode} onChange={(e) => setMode(e.target.value as FretboardMode)}>
            {MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Fundamental
          <select value={root} onChange={(e) => setRoot(e.target.value)}>
            {ROOTS.map((r) => (
              <option key={r} value={r}>
                {formatNote(r, notation)}
              </option>
            ))}
          </select>
        </label>

        {mode !== 'notes' && (
          <label>
            Tipo
            <select
              value={types[mode]}
              onChange={(e) => setTypes({ ...types, [mode]: e.target.value })}
            >
              {CATALOG[mode].map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.label}
                </option>
              ))}
            </select>
          </label>
        )}

        <label>
          Etiquetas
          <select
            value={mode === 'notes' ? 'note' : labels}
            disabled={mode === 'notes'}
            onChange={(e) => setLabels(e.target.value as LabelMode)}
          >
            {LABELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Trastes
          <select value={lastFret} onChange={(e) => setLastFret(Number(e.target.value))}>
            {[12, 15, 17, 20, 21, 22, 24].map((f) => (
              <option key={f} value={f}>
                0–{f}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nombres
          <select value={notation} onChange={(e) => setNotation(e.target.value as Notation)}>
            <option value="anglo">C D E</option>
            <option value="latina">Do Re Mi</option>
          </select>
        </label>

        <button
          type="button"
          className="btn"
          aria-pressed={leftHanded}
          onClick={() => setLeftHanded(!leftHanded)}
        >
          Zurdo: {leftHanded ? 'sí' : 'no'}
        </button>
      </div>

      <Fretboard
        tuning={tuning}
        view={view}
        leftHanded={leftHanded}
        notation={notation}
        description={description}
      />
      <p className="hint">Pulsa cualquier casilla para oír la nota.</p>
    </section>
  )
}
