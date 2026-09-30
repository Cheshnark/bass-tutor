import { course, lessonsOf } from '../../content/course'
import './Lesson.css'

/** Índice del curso: módulos en orden y sus lecciones. */
export function CourseIndex() {
  return (
    <section className="panel" aria-labelledby="course-title">
      <h2 id="course-title">Curso</h2>
      {course.modules.length === 0 && <p className="hint">Todavía no hay lecciones.</p>}
      {course.modules.map((module) => (
        <section key={module.id} className="course-module" aria-labelledby={`module-${module.id}`}>
          <h3 id={`module-${module.id}`}>
            <span className="course-module__number">{module.order}</span> {module.title}
          </h3>
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
      ))}
    </section>
  )
}
