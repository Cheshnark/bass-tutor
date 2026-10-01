import { lessonsOf, moduleNumber, modulesOf } from '../../content/course'
import type { Module } from '../../content/schema'
import { TRACKS } from '../../content/tracks'
import { PracticeReminder } from '../Practice/PracticeReminder'
import { useLessonsProgress } from '../../state/progress/hooks'
import type { LessonProgress } from '../../state/progress/model'
import { ProgressPanel } from './ProgressPanel'
import './Lesson.css'

interface ModuleBlockProps {
  module: Module
  progress: ReadonlyMap<string, LessonProgress>
  /** h4 en el tronco común; h5 dentro de un itinerario, que ya va bajo un h4. */
  headingLevel: 4 | 5
}

function ModuleBlock({ module, progress, headingLevel }: ModuleBlockProps) {
  const lessons = lessonsOf(module)
  const Heading = headingLevel === 4 ? 'h4' : 'h5'
  const done = lessons.filter((l) => progress.get(l.id)?.completedAt).length

  return (
    <section className="course-module" aria-labelledby={`module-${module.id}`}>
      <Heading id={`module-${module.id}`} className="course-module__heading">
        <span className="course-module__number">{moduleNumber(module)}</span> {module.title}
        <span className="course-module__done" aria-label={`${done} de ${lessons.length} lecciones completadas`}>
          {done}/{lessons.length}
        </span>
      </Heading>
      <p className="hint">{module.summary}</p>
      <ol className="course-lessons">
        {lessons.map((lesson) => {
          const p = progress.get(lesson.id)
          const completed = Boolean(p?.completedAt)
          // Si la empezaste y no la has completado, el enlace te lleva al paso donde lo dejaste.
          const resumeStep = !completed && p && p.lastStep > 0 ? p.lastStep + 1 : null
          return (
            <li key={lesson.id} className={completed ? 'is-done' : undefined}>
              <a href={`#/curso/${lesson.id}${resumeStep ? `/${resumeStep}` : ''}`}>
                <span className="course-lessons__title">
                  {completed && (
                    <span className="course-lessons__check" aria-label="Completada">
                      ✓
                    </span>
                  )}
                  {lesson.title}
                </span>
                <span className="course-lessons__meta">
                  {resumeStep ? `Sigue en el paso ${resumeStep}` : `${lesson.durationMin} min`}
                  {lesson.status === 'borrador' && <span className="badge">Borrador</span>}
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

/** Índice del curso: tronco común, itinerarios por estilo y tu progreso. */
export function CourseIndex() {
  const [common, ...styles] = TRACKS
  const commonModules = modulesOf(common.id)
  const progress = useLessonsProgress()

  return (
    <section className="panel course" aria-labelledby="course-title">
      <h2 id="course-title">Curso</h2>
      <PracticeReminder />

      <section className="course-track" aria-labelledby="track-comun">
        <h3 id="track-comun">{common.label}</h3>
        <p className="hint">{common.summary}</p>
        {commonModules.length === 0 && <p className="hint">Todavía no hay lecciones.</p>}
        {commonModules.map((m) => (
          <ModuleBlock key={m.id} module={m} progress={progress} headingLevel={4} />
        ))}
      </section>

      <section className="course-track" aria-labelledby="track-styles">
        <h3 id="track-styles">Itinerarios por estilo</h3>
        <p className="hint">Cuando termines el tronco común, elige uno (o varios).</p>
        {styles.map((track) => {
          const modules = modulesOf(track.id)
          return (
            <section key={track.id} className="course-style" aria-labelledby={`track-${track.id}`}>
              <h4 id={`track-${track.id}`}>
                {track.label}
                {modules.length === 0 && <span className="badge badge--muted">En preparación</span>}
              </h4>
              <p className="hint">{track.summary}</p>
              {modules.map((m) => (
                <ModuleBlock key={m.id} module={m} progress={progress} headingLevel={5} />
              ))}
            </section>
          )
        })}
      </section>

      <ProgressPanel />
    </section>
  )
}
