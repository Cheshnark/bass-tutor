/**
 * Copia las fuentes (Bravura) y el soundfont de alphaTab a public/ solo si faltan o han cambiado.
 *
 * Sustituye a la copia de @coderline/alphatab-vite (que usamos con `assetOutputDir: false`): aquella copia
 * todo en cada arranque y, en Windows, falla con EBUSY si el soundfont está abierto (por ejemplo, al
 * reiniciar el servidor de dev), tumbando el servidor.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'

const SUBDIRS = ['font', 'soundfont']

function alphaTabDist(): string {
  const require = createRequire(import.meta.url)
  return dirname(require.resolve('@coderline/alphatab'))
}

/** Copia `from` a `to` si falta o el tamaño es distinto. Devuelve un aviso si no se pudo pero ya había copia. */
export function copyIfChanged(from: string, to: string): string | null {
  if (existsSync(to) && statSync(to).size === statSync(from).size) return null
  try {
    copyFileSync(from, to)
    return null
  } catch (error) {
    // Destino bloqueado (EBUSY/EPERM en Windows): si ya existe una copia, se sigue con ella.
    if (existsSync(to)) return `no se pudo actualizar ${to} (${(error as Error).message}); se usa la copia existente`
    throw error
  }
}

export function alphaTabAssets(): Plugin {
  let publicDir = ''
  return {
    name: 'bass-tutor:alphatab-assets',
    configResolved(config) {
      publicDir = config.publicDir
    },
    buildStart() {
      if (!publicDir) return
      const dist = alphaTabDist()
      for (const subdir of SUBDIRS) {
        const source = join(dist, subdir)
        const target = join(publicDir, subdir)
        mkdirSync(target, { recursive: true })
        for (const file of readdirSync(source, { withFileTypes: true })) {
          if (!file.isFile()) continue
          const warning = copyIfChanged(join(source, file.name), join(target, file.name))
          if (warning) this.warn(warning)
        }
      }
    },
  }
}
