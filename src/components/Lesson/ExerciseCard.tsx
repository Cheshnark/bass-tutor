import { useState } from 'react'
import { getExercise } from '../../content/course'
import type { ExerciseEmbed } from '../../content/schema'
import { useMetronome } from '../../state/metronome'
import { recordAttempt, requestPersistence } from '../../state/progress/db'
import { useExerciseProgress } from '../../state/progress/hooks'
import { reachedTarget, suggestTempo } from '../../state/progress/model'
import { LazyTabView } from '../Tab/LazyTabView'
import { LessonMetronome } from './embeds'

/** Fecha del intento: se toma al guardar, no al pintar. */
const nowIso = () => new Date().toISOString()

/**
 * Tarjeta de ejercicio: instrucciones, tempo, metrónomo, partitura, autoevaluación y registro de intentos.
 * Un intento es "pase limpio" si se marcan todos los criterios.
 */
export function LessonExercise({ id }: ExerciseEmbed) {
  const exercise = getExercise(id)
  const progress = useExerciseProgress(id)
  const metronomeBpm = useMetronome((s) => s.bpm)
  const [checked, setChecked] = useState<boolean[]>([])
  const [bpmInput, setBpmInput] = useState<number | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  if (!exercise) return null

  const { tempo, passCriteria } = exercise
  const [numerator, denominator] = exercise.timeSignature.split('/').map(Number)
  const suggestion = suggestTempo(exercise, progress)
  const bpm = bpmInput ?? suggestion
  const passed = passCriteria.every((_, i) => checked[i])
  const validBpm = Number.isFinite(bpm) && bpm >= 20 && bpm <= 300
  const attempts = progress?.history.length ?? 0

  const save = async () => {
    if (!validBpm) return
    await recordAttempt(id, { date: nowIso(), bpm, passed })
    void requestPersistence()
    setMessage(passed ? `Pase limpio guardado a ${bpm} BPM.` : `Intento guardado a ${bpm} BPM (sin pase limpio).`)
    setChecked([])
    setBpmInput(null)
  }

  return (
    <article className="lesson-exercise" aria-labelledby={`exercise-${id}`} data-testid={`exercise-${id}`}>
      <h3 id={`exercise-${id}`}>Ejercicio · {exercise.title}</h3>
      <p>{exercise.instructions}</p>
      <p className="lesson-exercise__tempo">
        Empieza a <strong>{tempo.start} BPM</strong> y sube {tempo.step} BPM cada vez que lo toques limpio,
        hasta <strong>{tempo.target} BPM</strong>. Compás {exercise.timeSignature}.
      </p>

      <p className="lesson-exercise__progress" data-testid="exercise-progress">
        {attempts === 0 ? (
          'Aún no has guardado ningún intento.'
        ) : (
          <>
            Mejor tempo limpio: <strong>{progress?.bestCleanBpm ?? '—'}</strong>
            {progress?.bestCleanBpm ? ' BPM' : ''} · {attempts} {attempts === 1 ? 'intento' : 'intentos'}
            {reachedTarget(exercise, progress) && <span className="badge badge--ok">Objetivo alcanzado</span>}
          </>
        )}
      </p>

      <LessonMetronome bpm={suggestion} beatsPerBar={denominator === 4 ? numerator : undefined} />
      <LazyTabView tex={exercise.alphaTex} title={exercise.title} bpm={validBpm ? bpm : undefined} />

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

      <div className="lesson-exercise__attempt">
        <label>
          Tempo al que lo has tocado
          <span className="lesson-exercise__bpm">
            <input
              type="number"
              inputMode="numeric"
              min={20}
              max={300}
              value={Number.isFinite(bpm) ? bpm : ''}
              onChange={(e) => setBpmInput(e.target.valueAsNumber)}
            />
            BPM
          </span>
        </label>
        <button type="button" className="btn" onClick={() => setBpmInput(metronomeBpm)}>
          Usar el del metrónomo ({metronomeBpm})
        </button>
        <button type="button" className="btn btn--primary" onClick={save} disabled={!validBpm}>
          {passed ? 'Guardar pase limpio' : 'Guardar intento'}
        </button>
        <p className="hint" aria-live="polite" data-testid="attempt-message">
          {message ?? (passed ? 'Todos los criterios marcados: contará como pase limpio.' : 'Marca los criterios que hayas cumplido.')}
        </p>
      </div>
    </article>
  )
}
