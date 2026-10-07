import { afterEach, describe, expect, it, vi } from 'vitest'
import { readStored, readStoredObject, writeStored } from './storage'

/** Almacenamiento mínimo en memoria para probar sin navegador. */
function fakeStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
  }
}

describe('storage', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('lee y escribe', () => {
    vi.stubGlobal('localStorage', fakeStorage())
    writeStored('a', '1')
    expect(readStored('a')).toBe('1')
    expect(readStored('b')).toBeNull()
  })

  it('sin almacenamiento disponible no lanza', () => {
    // En el entorno de test (node) `localStorage` no existe: es el caso del modo privado o de datos bloqueados.
    expect(readStored('a')).toBeNull()
    expect(() => writeStored('a', '1')).not.toThrow()
  })

  it('readStoredObject solo devuelve objetos válidos', () => {
    vi.stubGlobal('localStorage', fakeStorage({ ok: '{"x":true}', mal: '{no json', lista: '[1]', num: '5' }))
    expect(readStoredObject('ok')).toEqual({ x: true })
    expect(readStoredObject('mal')).toBeNull()
    expect(readStoredObject('lista')).toBeNull()
    expect(readStoredObject('num')).toBeNull()
    expect(readStoredObject('falta')).toBeNull()
  })
})
