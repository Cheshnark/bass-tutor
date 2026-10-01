/** Escala del VU: de −50 a +50 cents, repartida en ±60° alrededor de la vertical. */
const MAX_CENTS = 50
const MAX_ANGLE = 60
const CX = 150
const CY = 165
const R = 120

const angleOf = (cents: number) => (Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents)) / MAX_CENTS) * MAX_ANGLE

/** Punto de la circunferencia a `radius` para un ángulo en grados (0 = arriba, positivo a la derecha). */
function point(angle: number, radius: number): [number, number] {
  const rad = (angle * Math.PI) / 180
  return [CX + radius * Math.sin(rad), CY - radius * Math.cos(rad)]
}

function arc(from: number, to: number, radius: number): string {
  const [x1, y1] = point(from, radius)
  const [x2, y2] = point(to, radius)
  return `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`
}

const TICKS = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50]
const LABELS = [-50, -25, 0, 25, 50]

/**
 * VU analógico para el afinador (research.md §6.2: aguja de cents, skeuomorfismo en el marco).
 * Es un `meter` accesible: el valor numérico también está en texto junto a la esfera.
 */
export function VuMeter({ cents, inTune }: { cents: number | null; inTune: number }) {
  const value = cents === null ? 0 : Math.round(Math.max(-MAX_CENTS, Math.min(MAX_CENTS, cents)))
  return (
    <div
      className="vu"
      role="meter"
      aria-label="Desviación en cents"
      aria-valuemin={-MAX_CENTS}
      aria-valuemax={MAX_CENTS}
      aria-valuenow={value}
      aria-valuetext={cents === null ? 'sin lectura' : `${value > 0 ? '+' : ''}${value} cents`}
    >
      <svg viewBox="0 0 300 190" aria-hidden="true" focusable="false">
        <rect className="vu-face" x="4" y="4" width="292" height="182" rx="12" />
        {/* Zona "afinado" */}
        <path className="vu-zone" d={arc(angleOf(-inTune), angleOf(inTune), R - 6)} />
        <path className="vu-scale" d={arc(-MAX_ANGLE, MAX_ANGLE, R)} />
        {TICKS.map((t) => {
          const major = LABELS.includes(t)
          const [x1, y1] = point(angleOf(t), R)
          const [x2, y2] = point(angleOf(t), R - (major ? 16 : 9))
          return <line key={t} className="vu-tick" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={major ? 3 : 1.5} />
        })}
        {LABELS.map((t) => {
          const [x, y] = point(angleOf(t), R + 14)
          return (
            <text key={t} className="vu-label" x={x} y={y}>
              {t > 0 ? `+${t}` : t}
            </text>
          )
        })}
        <text className="vu-unit" x={CX} y={CY - 52}>
          cents
        </text>
        {cents !== null && (
          <line
            className="vu-needle"
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - R + 4}
            style={{ transform: `rotate(${angleOf(cents)}deg)`, transformOrigin: `${CX}px ${CY}px` }}
          />
        )}
        <circle className="vu-pivot" cx={CX} cy={CY} r="9" />
      </svg>
    </div>
  )
}
