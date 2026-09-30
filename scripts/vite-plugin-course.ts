/**
 * Plugin de Vite: expone el curso ya validado como `import course from 'virtual:course'`.
 * El navegador recibe JSON: ni Zod ni el parser de YAML van en el bundle.
 * En dev, cualquier cambio en src/content regenera el módulo y recarga la página;
 * si el contenido tiene errores, Vite los muestra en su overlay (y el build falla).
 */
import type { Plugin } from 'vite'
import { CONTENT_DIR, formatIssue, loadCourse } from './course-source'

const PUBLIC_ID = 'virtual:course'
const RESOLVED_ID = '\0virtual:course'

export function coursePlugin(): Plugin {
  return {
    name: 'bass-tutor:course',
    resolveId(id) {
      return id === PUBLIC_ID ? RESOLVED_ID : undefined
    },
    load(id) {
      if (id !== RESOLVED_ID) return undefined
      const { course, issues } = loadCourse()
      const errors = issues.filter((i) => i.level === 'error')
      if (errors.length > 0) {
        this.error(`Contenido inválido (npm run content:check):\n${errors.map(formatIssue).join('\n')}`)
      }
      return `export default ${JSON.stringify(course)}`
    },
    configureServer(server) {
      server.watcher.add(CONTENT_DIR)
      const onChange = (file: string) => {
        if (!file.replaceAll('\\', '/').includes('/src/content/')) return
        if (!/\.(ya?ml|mdx)$/.test(file)) return
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      }
      server.watcher.on('add', onChange)
      server.watcher.on('change', onChange)
      server.watcher.on('unlink', onChange)
    },
  }
}
