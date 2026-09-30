/**
 * npm run content:check — valida todo src/content contra el esquema (src/content/schema.ts).
 * Sale con código 1 si hay errores; los avisos (borradores, ejercicios sin usar) no bloquean.
 * Se ejecuta antes de cada build.
 */
import { formatIssue, loadCourse } from './course-source'

const { course, issues } = loadCourse()
const errors = issues.filter((i) => i.level === 'error')
const warnings = issues.filter((i) => i.level === 'warning')

for (const issue of [...errors, ...warnings]) console.log(formatIssue(issue))

console.log(
  `\nContenido: ${course.modules.length} módulos, ${course.lessons.length} lecciones, ${course.exercises.length} ejercicios` +
    ` · ${errors.length} errores, ${warnings.length} avisos`,
)
process.exit(errors.length > 0 ? 1 : 0)
