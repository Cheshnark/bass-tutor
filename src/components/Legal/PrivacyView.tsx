import { APP_NAME } from '../../brand'
import { CONTACT_LABEL, CONTACT_URL } from '../../legal'
import { PanelTitle } from '../PanelTitle'

/**
 * Aviso de privacidad. Describe lo que hace el código (comprobado el 2026-10-07): sin peticiones de red propias,
 * sin analítica ni cookies, datos solo en el dispositivo. Si cambia el código, hay que cambiar este texto.
 */
export function PrivacyView() {
  return (
    <section className="panel settings legal" aria-labelledby="privacy-title">
      <PanelTitle id="privacy-title">Privacidad</PanelTitle>
      <p className="hint">Última revisión: 7 de octubre de 2026. Resume lo que hace la app; no es un contrato.</p>

      <section aria-labelledby="privacy-summary">
        <h2 id="privacy-summary">En resumen</h2>
        <p>
          {APP_NAME} no tiene cuentas, no usa cookies ni analítica y no envía tu progreso, tus ajustes ni tu audio a ningún servidor de la app.
          Todo lo que guarda se queda en tu navegador, en este dispositivo.
        </p>
      </section>

      <section aria-labelledby="privacy-stored">
        <h2 id="privacy-stored">Qué se guarda en tu dispositivo</h2>
        <ul>
          <li>
            <strong>Progreso</strong> (base de datos del navegador, IndexedDB): por ejercicio, la fecha, el tempo y si el intento fue «limpio»;
            lecciones completadas y último paso; respuestas del quiz de mástil y del entrenamiento de oído (fecha, acierto, tiempo).
          </li>
          <li>
            <strong>Ajustes</strong> (almacenamiento local): afinación, zurdo, nomenclatura, tema, modo atril, modo de lección, ajustes del
            metrónomo, bloques del índice que abres o cierras y, en el afinador, la entrada de audio elegida y la ganancia.
          </li>
          <li>
            <strong>Copia para funcionar sin conexión</strong> (caché del navegador): los archivos de la propia app.
          </li>
          <li>Si exportas tu progreso, se descarga un archivo JSON a tu dispositivo; tú decides qué hacer con él.</li>
        </ul>
        <p>
          Puedes borrarlo todo desde los ajustes del navegador (datos del sitio). No hay copia en ningún servidor, así que no se puede recuperar
          si lo borras sin haber exportado antes.
        </p>
      </section>

      <section aria-labelledby="privacy-mic">
        <h2 id="privacy-mic">Micrófono</h2>
        <ul>
          <li>
            Solo se pide cuando pulsas activar el micrófono (afinador) o grabar (Grábate). El navegador te pregunta antes.
          </li>
          <li>
            El afinador analiza el sonido <strong>en tu dispositivo</strong> y no lo graba ni lo envía.
          </li>
          <li>
            «Grábate» graba en la memoria del navegador para que te escuches; <strong>no se guarda</strong>: se descarta al salir o al grabar de
            nuevo. No se sube a ningún sitio.
          </li>
        </ul>
      </section>

      <section aria-labelledby="privacy-third">
        <h2 id="privacy-third">Terceros</h2>
        <ul>
          <li>La app no carga fuentes, scripts ni imágenes de otros sitios: todo se sirve desde su propio origen.</li>
          <li>
            Está alojada en <strong>GitHub Pages</strong>. Como cualquier alojamiento, GitHub puede registrar datos técnicos de la visita (como tu
            dirección IP) según su propia política de privacidad. La app no puede controlarlo.
          </li>
          <li>Las lecciones enlazan vídeos de YouTube y de otras webs. Al pulsar un enlace sales de la app y esa web aplica su propia política.</li>
          <li>En el modo «paso a paso» se usa la función de pantalla encendida del navegador (Wake Lock); no envía datos.</li>
        </ul>
      </section>

      <section aria-labelledby="privacy-contact">
        <h2 id="privacy-contact">Contacto</h2>
        <p>
          Dudas sobre este aviso: <a href={CONTACT_URL}>{CONTACT_LABEL}</a>. <a href="#/creditos">Créditos y avisos</a>
        </p>
      </section>
    </section>
  )
}
