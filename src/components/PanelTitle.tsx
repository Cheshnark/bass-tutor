import type { ReactNode } from 'react'

interface PanelTitleProps {
  id: string
  children: ReactNode
}

/**
 * Rótulo del panel, como la leyenda del frontal de un ampli: tira crema con un tornillo en cada extremo.
 * Es el `h1` de la vista (el nombre de la app ya no lo es). Los tornillos son decoración y nunca quedan detrás
 * del texto.
 */
export function PanelTitle({ id, children }: PanelTitleProps) {
  return (
    <div className="legend">
      <span className="screw" aria-hidden="true" />
      <h1 id={id}>{children}</h1>
      <span className="screw" aria-hidden="true" />
    </div>
  )
}
