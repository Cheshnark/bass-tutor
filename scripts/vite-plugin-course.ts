/**
 * Plugin de Vite: expone el curso ya validado como `import course from 'virtual:course'`.
 * El navegador recibe JSON: ni Zod ni el parser de YAML van en el bundle.
 * Los ejercicios van sin `alphaTex` (lo que necesita el índice y la práctica); los textos están en
 * `virtual:course-tex` (id → alphaTex), que se importa de forma dinámica al abrir una partitura.
 * En dev, cualquier cambio en src/content regenera el módulo y recarga la página;
 * si el contenido tiene errores, Vite los muestra en su overlay (y el build falla).
 */
import type { Plugin } from 'vite'
import { CONTENT_DIR, formatIssue, loadCourse } from './course-source'

const PUBLIC_ID = 'virtual:course'
const RESOLVED_ID = '\0virtual:course'
const TEX_PUBLIC_ID = 'virtual:course-tex'
const TEX_RESOLVED_ID = '\0virtual:course-tex'

/** Curso validado o error de Vite (el build falla con contenido inválido). */
function loadValidCourse(fail: (message: string) => never) {
  const { course, issues } = loadCourse()
  const errors = issues.filter((i) => i.level === 'error')
  if (errors.length > 0) fail(`Contenido inválido (npm run content:check):\n${errors.map(formatIssue).join('\n')}`)
  return course
}

export function coursePlugin(): Plugin {
  return {
    name: 'bass-tutor:course',
    resolveId(id) {
      if (id === PUBLIC_ID) return RESOLVED_ID
      if (id === TEX_PUBLIC_ID) return TEX_RESOLVED_ID
      return undefined
    },
    load(id) {
      if (id === RESOLVED_ID) {
        const course = loadValidCourse((m) => this.error(m))
        const exercises = course.exercises.map(({ alphaTex: _alphaTex, ...meta }) => meta)
        return `export default ${JSON.stringify({ ...course, exercises })}`
      }
      if (id === TEX_RESOLVED_ID) {
        const course = loadValidCourse((m) => this.error(m))
        return `export default ${JSON.stringify(Object.fromEntries(course.exercises.map((e) => [e.id, e.alphaTex])))}`
      }
      return undefined
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)
      const onChange = (file: string) => {
        if (!file.replaceAll('\\', '/').includes('/src/content/')) return
        if (!/\.(ya?ml|mdx)$/.test(file)) return
        for (const resolved of [RESOLVED_ID, TEX_RESOLVED_ID]) {
          const mod = server.moduleGraph.getModuleById(resolved)
          if (mod) server.moduleGraph.invalidateModule(mod)
        }
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
