import { useEffect, useState } from 'react'

function readHash<T extends string>(views: readonly T[], fallback: T): T {
  const id = window.location.hash.replace(/^#\/?/, '')
  return (views as readonly string[]).includes(id) ? (id as T) : fallback
}

/**
 * Ruta mínima por hash (`#/diccionario`). Funciona sin servidor y offline, y no hace falta
 * configurar reescrituras en el hosting. `views` debe ser estable (constante de módulo).
 */
export function useHashRoute<T extends string>(views: readonly T[], fallback: T): T {
  const [view, setView] = useState<T>(() => readHash(views, fallback))

  useEffect(() => {
    const onChange = () => setView(readHash(views, fallback))
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [views, fallback])

  return view
}
