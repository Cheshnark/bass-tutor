/**
 * Componentes que se pueden usar dentro de una lección MDX. Sus props se validan en build
 * (EMBED_SCHEMAS en src/content/schema.ts), así que aquí se confía en ellas.
 */
import { useEffect, useMemo, useState } from 'react'
import { getExercise } from '../../content/course'
import type { ExerciseEmbed, FretboardEmbed, MetronomeEmbed, TabEmbed, VideoEmbed } from '../../content/schema'
import { metronomeEngine, useMetronome } from '../../state/metronome'
import { useSettings } from '../../state/settings'
import type { FretboardView } from '../../theory/fretboard'
import { getTuning } from '../../theory/tunings'
import { Fretboard } from '../Fretboard/Fretboard'
import { LazyTabView } from '../Tab/LazyTabView'

export function LessonFretboard({ mode, root, type, frets = [0, 12], labels = 'note' }: FretboardEmbed) {
  const { tuningId, leftHanded, notation } = useSettings()
  // `frets` llega como array nuevo en cada render del MDX: se memoriza por valor.
  const [from, to] = frets
  const view = useMemo<FretboardView>(
    () => ({ mode, root, type, frets: [from, to], labels }),
    [mode, root, type, from, to, labels],
  )
  return (
    <figure className="lesson-embed">
      <Fretboard tuning={getTuning(tuningId)} view={view} leftHanded={leftHanded} notation={notation} />
    </figure>
  )
}

export function LessonTab({ exercise: id }: TabEmbed) {
  const exercise = getExercise(id)
  if (!exercise) return null
  return (
    <figure className="lesson-embed">
      <LazyTabView tex={exercise.alphaTex} title={exercise.title} />
    </figure>
  )
}

/** Botón para el metrónomo global a un tempo concreto, con piloto de pulso. */
export function LessonMetronome({ bpm, beatsPerBar }: MetronomeEmbed) {
  const { running, ladderActive, bpm: current, setBpm, setBeatsPerBar, start, stop } = useMetronome()
  const [pulse, setPulse] = useState(0)

  useEffect(() => {
    if (!running) return
    let frame = 0
    let last: number | undefined
    const loop = () => {
      const tick = metronomeEngine.currentTick()
      if (tick && tick.subInBeat === 0 && tick.time !== last) {
        last = tick.time
        setPulse((p) => p + 1)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [running])

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
      <span className={`met-pilot${running ? ' met-pilot--on' : ''}`} key={pulse} aria-hidden="true" />
      <button type="button" className="btn btn--primary" onClick={toggle} aria-pressed={running}>
        {running ? `Parar metrónomo (${current} BPM)` : `Metrónomo a ${target} BPM`}
      </button>
    </div>
  )
}

/** Tarjeta de ejercicio: instrucciones, tempo, notación, metrónomo y criterios de superación. */
export function LessonExercise({ id }: ExerciseEmbed) {
  const exercise = getExercise(id)
  const [checked, setChecked] = useState<boolean[]>([])
  if (!exercise) return null
  const { tempo, passCriteria } = exercise
  const [numerator, denominator] = exercise.timeSignature.split('/').map(Number)

  return (
    <article className="lesson-exercise" aria-labelledby={`exercise-${id}`} data-testid={`exercise-${id}`}>
      <h3 id={`exercise-${id}`}>Ejercicio · {exercise.title}</h3>
      <p>{exercise.instructions}</p>
      <p className="lesson-exercise__tempo">
        Empieza a <strong>{tempo.start} BPM</strong> y sube {tempo.step} BPM cada vez que lo toques limpio,
        hasta <strong>{tempo.target} BPM</strong>. Compás {exercise.timeSignature}.
      </p>
      <LessonMetronome bpm={tempo.start} beatsPerBar={denominator === 4 ? numerator : undefined} />
      <LazyTabView tex={exercise.alphaTex} title={exercise.title} />
      <fieldset className="lesson-exercise__criteria">
        <legend>Autoevaluación: ¿lo has tocado…?</legend>
        {passCriteria.map((criterion, i) => (
          <label key={criterion}>
            <input
              type="checkbox"
              checked={checked[i] ?? false}
              onChange={(e) => setChecked((prev) => Object.assign([...prev], { [i]: e.target.checked }))}
            />
            {criterion}
          </label>
        ))}
      </fieldset>
    </article>
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
