import { lazy, Suspense, type ComponentProps } from 'react'

// alphaTab (~1 MB) va en su propio chunk: solo se descarga al mostrar una tablatura.
const TabView = lazy(() => import('./TabView'))

export function LazyTabView(props: ComponentProps<typeof TabView>) {
  return (
    <Suspense fallback={<p className="hint">Cargando partitura…</p>}>
      <TabView {...props} />
    </Suspense>
  )
}
