/**
 * Acceso a `localStorage` que no falla: con el almacenamiento bloqueado (modo privado, datos de sitio desactivados)
 * se lee `null` y no se guarda nada, y la app sigue funcionando sin recordar la preferencia.
 */
export function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStored(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {
    /* sin almacenamiento: la preferencia no se recuerda */
  }
}

/** Objeto JSON guardado, o `null` si no hay, está corrupto o no es un objeto. */
export function readStoredObject(key: string): Record<string, unknown> | null {
  const raw = readStored(key)
  if (raw === null) return null
  try {
    const parsed: unknown = JSON.parse(raw)
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null
  } catch {
    return null
  }
}
