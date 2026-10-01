import { useSettings, type ThemeChoice } from '../state/settings'
import { SettingsBar } from './SettingsBar'

const THEMES: { id: ThemeChoice; label: string; hint: string }[] = [
  { id: 'auto', label: 'Automático', hint: 'Alto contraste si tu sistema lo tiene activado; si no, cabezal.' },
  { id: 'cabezal', label: 'Cabezal', hint: 'Tolex oscuro, placa crema y pilotos ámbar.' },
  { id: 'alto-contraste', label: 'Alto contraste', hint: 'Negro, blanco y amarillo; sin texturas.' },
]

/** Todos los ajustes en un sitio (`#/ajustes`), accesible desde cualquier vista. */
export function SettingsView() {
  const { theme, setTheme, standMode, setStandMode, lessonMode, setLessonMode } = useSettings()

  return (
    <section className="panel settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Ajustes</h2>

      <section aria-labelledby="settings-instrument">
        <h3 id="settings-instrument">Instrumento</h3>
        <SettingsBar />
      </section>

      <section aria-labelledby="settings-look">
        <h3 id="settings-look">Aspecto</h3>
        <fieldset className="settings-options">
          <legend>Tema</legend>
          {THEMES.map((t) => (
            <label key={t.id} className="settings-option">
              <input type="radio" name="theme" checked={theme === t.id} onChange={() => setTheme(t.id)} />
              <span>
                <strong>{t.label}</strong>
                <span className="hint"> · {t.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </section>

      <section aria-labelledby="settings-lessons">
        <h3 id="settings-lessons">Lecciones</h3>
        <div className="settings-toggles">
          <button type="button" className="btn btn--big" aria-pressed={standMode} onClick={() => setStandMode(!standMode)}>
            Modo atril: {standMode ? 'sí' : 'no'}
          </button>
          <p className="hint">
            Para tocar con el móvil o la tableta en el atril: sin cabecera, letra más grande y todo el ancho para la
            lección. Mejor con el dispositivo en horizontal.
          </p>
          <button
            type="button"
            className="btn btn--big"
            aria-pressed={lessonMode === 'follow'}
            onClick={() => setLessonMode(lessonMode === 'follow' ? 'full' : 'follow')}
          >
            Paso a paso: {lessonMode === 'follow' ? 'sí' : 'no'}
          </button>
          <p className="hint">Un paso por pantalla (siguiendo la clase) o la lección entera con scroll.</p>
        </div>
      </section>
    </section>
  )
}
