import { useSettings } from '../state/settings'
import type { Notation } from '../theory/notation'
import { TUNINGS } from '../theory/tunings'

/** Ajustes globales que afectan al mástil: afinación, nomenclatura y zurdo. */
export function SettingsBar() {
  const { tuningId, leftHanded, notation, setTuningId, setLeftHanded, setNotation } = useSettings()

  return (
    <div className="controls settings-bar" role="group" aria-label="Ajustes del mástil">
      <label>
        Afinación
        <select value={tuningId} onChange={(e) => setTuningId(e.target.value)}>
          {TUNINGS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Nombres
        <select value={notation} onChange={(e) => setNotation(e.target.value as Notation)}>
          <option value="anglo">C D E</option>
          <option value="latina">Do Re Mi</option>
        </select>
      </label>
      <button
        type="button"
        className="btn"
        aria-pressed={leftHanded}
        onClick={() => setLeftHanded(!leftHanded)}
      >
        Zurdo: {leftHanded ? 'sí' : 'no'}
      </button>
    </div>
  )
}
