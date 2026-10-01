import { useMemo, useState, type KeyboardEvent } from 'react'
import { playNote } from '../../audio/notePlayer'
import { buildFretboard, type FretboardView, type FretPosition } from '../../theory/fretboard'
import { degreeFromInterval, formatInterval, formatNote, type Notation } from '../../theory/notation'
import type { Tuning } from '../../theory/tunings'
import { computeLayout, INLAYS, STRING_SPACING } from './layout'
import './Fretboard.css'

/** Casilla marcada en modo quiz: la pregunta ("?") o el resultado de una respuesta. */
export interface FretMark {
  string: number
  fret: number
  label: string
  tone: 'ask' | 'ok' | 'wrong'
}

export interface FretboardProps {
  tuning: Tuning
  view: FretboardView
  leftHanded?: boolean
  notation?: Notation
  /** Suena la nota al pulsar (por defecto, sí). */
  sound?: boolean
  /** Descripción legible de lo que se muestra ("La · Pentatónica menor"), para lectores de pantalla. */
  description?: string
  onNoteClick?: (position: FretPosition) => void
  /**
   * Modo quiz: solo se dibujan estas casillas y todas las demás siguen siendo pulsables.
   * Los nombres accesibles no dicen la nota, para no dar la respuesta.
   */
  marks?: readonly FretMark[]
}

const NOTE_RADIUS = 15

function labelFor(p: FretPosition, view: FretboardView, notation: Notation): string {
  if (view.labels === 'degree' && p.interval) return degreeFromInterval(p.interval)
  if (view.labels === 'interval' && p.interval) return formatInterval(p.interval)
  return formatNote(p.pc, notation)
}

/** Mástil de bajo en SVG: 4/5/6 cuerdas, cualquier afinación, zurdo, etiquetas por nota/grado/intervalo. */
export function Fretboard({
  tuning,
  view,
  leftHanded = false,
  notation = 'anglo',
  sound = true,
  description,
  onNoteClick,
  marks,
}: FretboardProps) {
  const positions = useMemo(() => buildFretboard(tuning, view), [tuning, view])
  const layout = useMemo(
    () => computeLayout({ stringCount: tuning.strings.length, frets: view.frets, leftHanded }),
    [tuning.strings.length, view.frets, leftHanded],
  )
  const [lastPlayed, setLastPlayed] = useState<string | null>(null)

  const [from, to] = view.frets
  const frets = Array.from({ length: to - from + 1 }, (_, i) => from + i)
  const stringCount = tuning.strings.length
  const midY = (layout.boardTop + layout.boardBottom) / 2

  const activate = (p: FretPosition) => {
    setLastPlayed(`${p.string}-${p.fret}`)
    if (sound) void playNote(p.midi)
    onNoteClick?.(p)
  }

  const onKey = (e: KeyboardEvent, p: FretPosition) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      activate(p)
    }
  }

  const describe =
    description ?? (view.mode === 'notes' ? 'todas las notas' : `${view.root ?? ''} ${view.type ?? ''}`.trim())

  return (
    <div className="fretboard-scroll">
      <svg
        className="fretboard"
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        width={layout.width}
        height={layout.height}
        role="group"
        aria-label={`Mástil de ${stringCount} cuerdas, trastes ${from} a ${to}${leftHanded ? ', zurdo' : ''}: ${describe}`}
        data-testid="fretboard"
        data-left-handed={leftHanded}
      >
        {/* Diapasón */}
        <rect
          className="fb-wood"
          x={layout.boardLeft}
          y={layout.boardTop}
          width={layout.boardRight - layout.boardLeft}
          height={layout.boardBottom - layout.boardTop}
          rx={4}
        />

        {/* Marcadores */}
        {frets
          .filter((f) => f > 0 && INLAYS[f])
          .map((f) =>
            INLAYS[f] === 2 ? (
              <g key={`inlay-${f}`} className="fb-inlay">
                <circle cx={layout.noteX(f)} cy={midY - STRING_SPACING} r={7} />
                <circle cx={layout.noteX(f)} cy={midY + STRING_SPACING} r={7} />
              </g>
            ) : (
              <circle key={`inlay-${f}`} className="fb-inlay" cx={layout.noteX(f)} cy={midY} r={7} />
            ),
          )}

        {/* Trastes y cejuela */}
        {frets
          .filter((f) => f > 0 || layout.hasNut)
          .map((f) => (
            <line
              key={`wire-${f}`}
              className={f === 0 ? 'fb-nut' : 'fb-wire'}
              x1={layout.wireX(f)}
              x2={layout.wireX(f)}
              y1={layout.boardTop}
              y2={layout.boardBottom}
            />
          ))}

        {/* Cuerdas: más gruesas cuanto más graves */}
        {tuning.strings.map((open, s) => (
          <line
            key={`string-${open}-${s}`}
            className="fb-string"
            x1={Math.min(layout.boardLeft, layout.noteX(from) - 20)}
            x2={Math.max(layout.boardRight, layout.noteX(from) + 20)}
            y1={layout.stringY(s)}
            y2={layout.stringY(s)}
            strokeWidth={1.2 + (stringCount - 1 - s) * 0.7}
          />
        ))}

        {/* Números de traste */}
        {frets.map((f) => (
          <text key={`num-${f}`} className="fb-fret-number" x={layout.noteX(f)} y={layout.fretNumberY}>
            {f}
          </text>
        ))}

        {/* Notas */}
        {positions.map((p) => {
          const key = `${p.string}-${p.fret}`
          const cx = layout.noteX(p.fret)
          const cy = layout.stringY(p.string)
          const w = layout.cellWidth(p.fret)
          const mark = marks?.find((m) => m.string === p.string && m.fret === p.fret)
          const shown = marks ? mark !== undefined : p.inSet
          const label = mark ? mark.label : labelFor(p, view, notation)
          const where = `cuerda ${stringCount - p.string}, traste ${p.fret}`
          const name = marks ? where : `${formatNote(p.note, notation, true)}, ${where}`
          const classes = [
            'fb-note',
            shown ? 'fb-note--in' : 'fb-note--out',
            !marks && p.isRoot && view.mode !== 'notes' ? 'fb-note--root' : '',
            mark ? `fb-note--${mark.tone}` : '',
            lastPlayed === key ? 'fb-note--played' : '',
          ].join(' ')
          return (
            <g
              key={key}
              className={classes}
              role="button"
              tabIndex={marks || p.inSet ? 0 : -1}
              aria-label={name}
              data-note={p.note}
              data-fret={p.fret}
              data-string={p.string}
              onClick={() => activate(p)}
              onKeyDown={(e) => onKey(e, p)}
            >
              {/* Zona pulsable: toda la casilla */}
              <rect
                className="fb-hit"
                x={cx - w / 2}
                y={cy - STRING_SPACING / 2}
                width={w}
                height={STRING_SPACING}
              />
              {shown && (
                <>
                  <circle cx={cx} cy={cy} r={NOTE_RADIUS} />
                  <text x={cx} y={cy} className={label.length > 2 ? 'fb-label fb-label--small' : 'fb-label'}>
                    {label}
                  </text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
