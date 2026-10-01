import { useEffect, useState } from 'react'
import { useSettings, type ThemeChoice } from './state/settings'

export type Theme = 'cabezal' | 'alto-contraste'

const CONTRAST_QUERY = '(prefers-contrast: more)'

/** Tema efectivo: el elegido o, en "auto", alto contraste si el sistema lo pide. */
export function resolveTheme(choice: ThemeChoice, prefersMoreContrast: boolean): Theme {
  if (choice === 'auto') return prefersMoreContrast ? 'alto-contraste' : 'cabezal'
  return choice
}

/** Aplica el tema y el modo atril en <html> (`data-theme`, `data-stand`) para que el CSS los use. */
export function useAppearance(): { theme: Theme; standMode: boolean } {
  const choice = useSettings((s) => s.theme)
  const standMode = useSettings((s) => s.standMode)
  const [prefersMore, setPrefersMore] = useState(() => window.matchMedia?.(CONTRAST_QUERY).matches ?? false)

  useEffect(() => {
    const query = window.matchMedia?.(CONTRAST_QUERY)
    if (!query) return
    const onChange = () => setPrefersMore(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const theme = resolveTheme(choice, prefersMore)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.dataset.stand = standMode ? 'on' : 'off'
  }, [theme, standMode])
  return { theme, standMode }
}
