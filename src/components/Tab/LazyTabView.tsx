import { lazy, Suspense, type ComponentProps } from 'react'
import { loadTabView } from './loadTabView'

const TabView = lazy(loadTabView)

export function LazyTabView(props: ComponentProps<typeof TabView>) {
  return (
    <Suspense fallback={<p className="hint">Cargando partitura…</p>}>
      <TabView {...props} />
    </Suspense>
  )
}
