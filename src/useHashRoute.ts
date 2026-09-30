import { useEffect, useState } from 'react'

export interface Route<T extends string> {
  view: T
  /** Segmentos tras la vista: `#/curso/cuerdas-al-aire/3` → ["cuerdas-al-aire", "3"]. */
  params: string[]
}

function readHash<T extends string>(views: readonly T[], fallback: T): Route<T> {
  const [id, ...rest] = window.location.hash.replace(/^#\/?/, '').split('/')
  const view = (views as readonly string[]).includes(id) ? (id as T) : fallback
  const params = view === id ? rest.filter(Boolean).map(decodeURIComponent) : []
  return { view, params }
}

/**
 * Ruta mínima por hash (`#/diccionario`, `#/curso/<id>/<paso>`). Funciona sin servidor y offline,
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
