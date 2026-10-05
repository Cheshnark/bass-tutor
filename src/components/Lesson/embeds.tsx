/**
 * Componentes que se pueden usar dentro de una lección MDX. Sus props se validan en build
 * (EMBED_SCHEMAS en src/content/schema.ts), así que aquí se confía en ellas.
 */
import { useMemo } from 'react'
import { getExercise, playableTex } from '../../content/course'
import type { FretboardEmbed, MetronomeEmbed, TabEmbed, VideoEmbed } from '../../content/schema'
import { useMetronome } from '../../state/metronome'
import { useSettings } from '../../state/settings'
import type { FretboardView } from '../../theory/fretboard'
import { getTuning } from '../../theory/tunings'
import { Fretboard } from '../Fretboard/Fretboard'
import { useBeatPulse } from '../Metronome/useBeatPulse'
import { LazyTabView } from '../Tab/LazyTabView'

export function LessonFretboard({ mode, root, type, frets = [0, 12], labels = 'note', tuning: fixedTuning }: FretboardEmbed) {
  const { tuningId, leftHanded, notation } = useSettings()
  // Una lección puede fijar la afinación (p. ej. drop D); el resto de ajustes (zurdo, nombres) siguen siendo del alumno.
  const tuning = getTuning(fixedTuning ?? tuningId)
  // `frets` llega como array nuevo en cada render del MDX: se memoriza por valor.
  const [from, to] = frets
  const view = useMemo<FretboardView>(
    () => ({ mode, root, type, frets: [from, to], labels }),
    [mode, root, type, from, to, labels],
  )
  return (
    <figure className="lesson-embed">
      <Fretboard tuning={tuning} view={view} leftHanded={leftHanded} notation={notation} />
      {fixedTuning && fixedTuning !== tuningId && <figcaption className="hint">Afinación: {tuning.name}</figcaption>}
    </figure>
  )
}

export function LessonTab({ exercise: id }: TabEmbed) {
  const exercise = getExercise(id)
  if (!exercise) return null
  return (
    <figure className="lesson-embed">
      <LazyTabView tex={playableTex(exercise)} title={exercise.title} />
    </figure>
  )
}

/** Botón para el metrónomo global a un tempo concreto, con piloto de pulso. */
export function LessonMetronome({ bpm, beatsPerBar }: MetronomeEmbed) {
  const { running, ladderActive, bpm: current, setBpm, setBeatsPerBar, start, stop } = useMetronome()
  const pulse = useBeatPulse(running)

  const toggle = async () => {
    if (running) {
      stop()
      return
    }
    // Con la escalera activa manda la escalera: no se toca el tempo.
    if (!ladderActive) {
      if (bpm !== undefined) setBpm(bpm)
      if (beatsPerBar !== undefined) setBeatsPerBar(beatsPerBar)
    }
    await start()
  }

  const target = ladderActive || bpm === undefined ? current : bpm
  return (
    <div className="lesson-metronome">
      <span className={`pilot${running ? ' pilot--flash' : ''}`} key={pulse} aria-hidden="true" />
      <button type="button" className="btn btn--primary" onClick={toggle} aria-pressed={running}>
        {running ? `Parar metrónomo (${current} BPM)` : `Metrónomo a ${target} BPM`}
      </button>
    </div>
  )
}

/** Enlace a una demostración externa (se abre en otra pestaña; no se incrusta). */
export function LessonVideo({ url, title, source }: VideoEmbed) {
  return (
    <a className="lesson-video" href={url} target="_blank" rel="noopener noreferrer">
      <span className="lesson-video__icon" aria-hidden="true">
        ▶
      </span>
      <span className="lesson-video__text">
        <span className="lesson-video__label">Míralo en vídeo</span>
        <span className="lesson-video__title">{title}</span>
        <span className="lesson-video__source">
          {source} · se abre en otra pestaña (en inglés)
        </span>
      </span>
    </a>
  )
}
