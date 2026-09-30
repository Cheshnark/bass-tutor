import { useMemo, useState } from 'react'
import { playNote, playSequence } from '../../audio/notePlayer'
import { useSettings } from '../../state/settings'
import { ROOTS } from '../../theory/catalog'
import { ascendingMidis, catalogFor, describeEntry, type DictionaryKind } from '../../theory/dictionary'
import type { FretboardView, LabelMode } from '../../theory/fretboard'
import { formatInterval, formatNote } from '../../theory/notation'
import { getTuning } from '../../theory/tunings'
import { Fretboard } from '../Fretboard/Fretboard'
import './Dictionary.css'

const KINDS: { id: DictionaryKind; label: string }[] = [
  { id: 'scale', label: 'Escalas' },
  { id: 'arpeggio', label: 'Arpegios' },
]

const LABELS: { id: LabelMode; label: string }[] = [
  { id: 'degree', label: 'Grado' },
  { id: 'note', label: 'Nota' },
  { id: 'interval', label: 'Intervalo' },
]

/** Diccionario de escalas y arpegios: fórmula, notas, pasos, uso en el bajo y vista en el mástil. */
export function Dictionary() {
  const { tuningId, leftHanded, notation } = useSettings()
  const [kind, setKind] = useState<DictionaryKind>('scale')
  const [selected, setSelected] = useState<Record<DictionaryKind, string>>({ scale: 'major', arpeggio: 'M' })
  const [root, setRoot] = useState('C')
  const [labels, setLabels] = useState<LabelMode>('degree')
  const [playing, setPlaying] = useState(false)

  const tuning = getTuning(tuningId)
  const id = selected[kind]
  const entry = useMemo(() => describeEntry(kind, id, root), [kind, id, root])
  const midis = useMemo(() => ascendingMidis(entry, tuning.strings[0]), [entry, tuning])
  const view = useMemo<FretboardView>(
    () => ({ mode: kind, root, type: id, frets: [0, 12], labels }),
    [kind, root, id, labels],
  )

  const title = `${formatNote(root, notation)} · ${entry.label}`

  const listen = async () => {
    setPlaying(true)
    const seconds = await playSequence(midis, 110)
    // Solo para reactivar el botón; el audio ya está programado en el reloj de audio.
    setTimeout(() => setPlaying(false), seconds * 1000)
  }

  return (
    <section className="panel" aria-labelledby="dictionary-title">
      <h2 id="dictionary-title">Diccionario</h2>

      <div className="dict-kinds" role="group" aria-label="Tipo">
        {KINDS.map((k) => (
          <button
            key={k.id}
            type="button"
            className="btn"
            aria-pressed={kind === k.id}
            onClick={() => setKind(k.id)}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="dict-entries" role="group" aria-label={kind === 'scale' ? 'Escalas' : 'Arpegios'}>
        {catalogFor(kind).map((e) => (
          <button
            key={e.id}
            type="button"
            className="chip"
            aria-pressed={e.id === id}
            onClick={() => setSelected({ ...selected, [kind]: e.id })}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="controls">
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
        <label>
          Etiquetas
          <select value={labels} onChange={(e) => setLabels(e.target.value as LabelMode)}>
            {LABELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <article className="dict-card" aria-labelledby="dict-entry-title">
        <h3 id="dict-entry-title">{title}</h3>
        <p>{entry.summary}</p>

        <dl className="dict-facts">
          <dt>Fórmula</dt>
          <dd className="dict-chips" data-testid="dict-degrees">
            {entry.degrees.map((d, i) => (
              <span key={i} className={`dict-chip${i === 0 ? ' dict-chip--root' : ''}`}>
                {d}
              </span>
            ))}
          </dd>

          <dt>Notas</dt>
          <dd className="dict-chips" data-testid="dict-notes">
            {entry.notes.map((n, i) => (
              <button
                key={n}
                type="button"
                className={`dict-chip dict-chip--note${i === 0 ? ' dict-chip--root' : ''}`}
                aria-label={`Escuchar ${formatNote(n, notation)}`}
                onClick={() => void playNote(midis[i])}
              >
                {formatNote(n, notation)}
              </button>
            ))}
          </dd>

          <dt>{kind === 'scale' ? 'Pasos (T = tono, S = semitono)' : 'Intervalos entre notas'}</dt>
          <dd className="dict-steps" data-testid="dict-steps">
            {entry.steps.map((s) => (kind === 'scale' ? s : formatInterval(s))).join(' · ')}
          </dd>

          <dt>En el bajo</dt>
          <dd>{entry.usage}</dd>
        </dl>

        <button type="button" className="btn btn--primary" onClick={listen} disabled={playing}>
          {playing ? 'Sonando…' : 'Escuchar'}
        </button>
      </article>

      <Fretboard tuning={tuning} view={view} leftHanded={leftHanded} notation={notation} description={title} />
    </section>
  )
}
