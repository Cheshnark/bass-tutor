import { lessonsOf, modulesOf } from '../../content/course'
import type { Module } from '../../content/schema'
import { TRACKS } from '../../content/tracks'
import './Lesson.css'

function ModuleBlock({ module }: { module: Module }) {
  return (
    <section className="course-module" aria-labelledby={`module-${module.id}`}>
      <h4 id={`module-${module.id}`}>
        <span className="course-module__number">{module.order}</span> {module.title}
      </h4>
      <p className="hint">{module.summary}</p>
      <ol className="course-lessons">
        {lessonsOf(module).map((lesson) => (
          <li key={lesson.id}>
            <a href={`#/curso/${lesson.id}`}>
              <span className="course-lessons__title">{lesson.title}</span>
              <span className="course-lessons__meta">
                {lesson.durationMin} min
                {lesson.status === 'borrador' && <span className="badge">Borrador</span>}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Índice del curso: tronco común y, después, un itinerario por estilo. */
export function CourseIndex() {
  const [common, ...styles] = TRACKS
  const commonModules = modulesOf(common.id)

  return (
    <section className="panel course" aria-labelledby="course-title">
      <h2 id="course-title">Curso</h2>

      <section className="course-track" aria-labelledby="track-comun">
        <h3 id="track-comun">{common.label}</h3>
        <p className="hint">{common.summary}</p>
        {commonModules.length === 0 && <p className="hint">Todavía no hay lecciones.</p>}
        {commonModules.map((m) => (
          <ModuleBlock key={m.id} module={m} />
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
                <ModuleBlock key={m.id} module={m} />
              ))}
            </section>
          )
        })}
      </section>
    </section>
  )
}
