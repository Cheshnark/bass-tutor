import { mkdtempSync, readFileSync, rmSync, statSync, utimesSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { copyIfChanged } from '../scripts/vite-plugin-alphatab-assets'

describe('copyIfChanged', () => {
  const dir = mkdtempSync(join(tmpdir(), 'bass-tutor-assets-'))
  const from = join(dir, 'origen.sf2')
  const to = join(dir, 'destino.sf2')

  afterEach(() => rmSync(to, { force: true }))

  it('copia si el destino no existe', () => {
    writeFileSync(from, 'soundfont')
    expect(copyIfChanged(from, to)).toBeNull()
    expect(readFileSync(to, 'utf8')).toBe('soundfont')
  })

  it('no vuelve a copiar si el destino ya es igual (mismo tamaño)', () => {
    writeFileSync(from, 'soundfont')
    writeFileSync(to, 'soundfont')
    const old = new Date('2020-01-01')
    utimesSync(to, old, old)
    expect(copyIfChanged(from, to)).toBeNull()
    expect(statSync(to).mtime.getFullYear()).toBe(2020)
  })

  it('actualiza si el tamaño cambia', () => {
    writeFileSync(from, 'soundfont nuevo')
    writeFileSync(to, 'viejo')
    copyIfChanged(from, to)
    expect(readFileSync(to, 'utf8')).toBe('soundfont nuevo')
  })
})
