import { useEffect, useState } from 'react'

export interface Route<T extends string> {
  view: T
  /** Segmento tras la vista: `#/curso/cuerdas-al-aire` → "cuerdas-al-aire". */
  param?: string
}

function readHash<T extends string>(views: readonly T[], fallback: T): Route<T> {
  const [id, param] = window.location.hash.replace(/^#\/?/, '').split('/')
  const view = (views as readonly string[]).includes(id) ? (id as T) : fallback
  return { view, param: view === id && param ? decodeURIComponent(param) : undefined }
}

/**
 * Ruta mínima por hash (`#/diccionario`, `#/curso/<id>`). Funciona sin servidor y offline,
 * y no hace falta configurar reescrituras en el hosting. `views` debe ser estable (constante de módulo).
 */
export function useHashRoute<T extends string>(views: readonly T[], fallback: T): Route<T> {
  const [route, setRoute] = useState<Route<T>>(() => readHash(views, fallback))

  useEffect(() => {
    const onChange = () => {
      setRoute(readHash(views, fallback))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [views, fallback])

  return route
}
