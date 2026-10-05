import { useId, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { angleOf, dragValue, keyValue, polar, type KnobRange } from './knobMath'
import './Knob.css'

interface KnobProps extends KnobRange {
  /** Nombre accesible ("Tempo", "Volumen"). */
  label: string
  value: number
  onChange: (value: number) => void
  /** Marcas con número alrededor del pote. */
  scale: readonly { value: number; label: string }[]
  /** Texto que lee el lector de pantalla ("80 BPM"). */
  valueText?: (value: number) => string
  disabled?: boolean
  /** Píxeles de arrastre para recorrer el rango entero. */
  travelPx?: number
  className?: string
}

const C = 100 // centro del viewBox de 200 × 200 (con margen para los números)

/**
 * Potenciómetro de ampli (research.md §6.2): se gira con el teclado (flechas, RePág/AvPág, Inicio/Fin) o
 * arrastrando en vertical. Nunca es el único control: va siempre con botones ± y entrada numérica al lado.
 */
export function Knob({
  label,
  value,
  onChange,
  min,
  max,
  step,
  scale,
  valueText,
  disabled = false,
  travelPx = 240,
  className,
}: KnobProps) {
  const range = { min, max, step }
  const gradient = useId()
  const drag = useRef<{ startY: number; startValue: number } | null>(null)
  const angle = angleOf(value, range)

  const onKeyDown = (e: KeyboardEvent) => {
    if (disabled) return
    const next = keyValue(e.key, value, range)
    if (next === null) return
    e.preventDefault()
    if (next !== value) onChange(next)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    e.currentTarget.focus()
    drag.current = { startY: e.clientY, startValue: value }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return
    const next = dragValue(drag.current.startValue, drag.current.startY - e.clientY, range, travelPx)
    if (next !== value) onChange(next)
  }

  const endDrag = () => {
    drag.current = null
  }

  // Marcas menores a medio camino entre las numeradas.
  const minors = scale.slice(1).map((s, i) => (s.value + scale[i].value) / 2)

  return (
    <div
      className={`knob${disabled ? ' knob--disabled' : ''}${className ? ` ${className}` : ''}`}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={valueText?.(value)}
      aria-disabled={disabled || undefined}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <svg viewBox="-14 -14 228 228" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id={`${gradient}-skirt`} cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#3a3632" />
            <stop offset="1" stopColor="#141210" />
          </radialGradient>
          <radialGradient id={`${gradient}-cap`} cx="38%" cy="32%" r="80%">
            <stop offset="0" stopColor="#4a4540" />
            <stop offset="0.6" stopColor="#1f1c19" />
            <stop offset="1" stopColor="#0d0c0b" />
          </radialGradient>
        </defs>
        <g className="knob__scale" strokeLinecap="round">
          {scale.map((s) => {
            const a = angleOf(s.value, range)
            const p1 = polar(C, C, 76, a)
            const p2 = polar(C, C, 86, a)
            const t = polar(C, C, 97, a)
            return (
              <g key={s.value}>
                <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth="2.5" />
                <text x={t.x} y={t.y} textAnchor="middle" dominantBaseline="central">
                  {s.label}
                </text>
              </g>
            )
          })}
          {minors.map((v) => {
            const a = angleOf(v, range)
            const p1 = polar(C, C, 78, a)
            const p2 = polar(C, C, 84, a)
            return <line key={v} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} strokeWidth="1.5" />
          })}
        </g>
        <circle cx={C} cy={C} r="66" fill="#0e0d0c" />
        <circle cx={C} cy={C} r="62" fill={`url(#${gradient}-skirt)`} />
        <circle cx={C} cy={C} r="47" fill={`url(#${gradient}-cap)`} stroke="#000" strokeOpacity="0.5" />
        <line
          className="knob__pointer"
          x1={C}
          y1={C - 64}
          x2={C}
          y2={C - 34}
          strokeWidth="5"
          strokeLinecap="round"
          transform={`rotate(${angle} ${C} ${C})`}
        />
      </svg>
    </div>
  )
}
