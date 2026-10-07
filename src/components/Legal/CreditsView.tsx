import { APP_NAME } from '../../brand'
import { CONTACT_LABEL, CONTACT_URL, NOTICES_URL, REPO_URL } from '../../legal'
import { PanelTitle } from '../PanelTitle'

/** Componentes de terceros que viajan con la app. La lista completa y los textos están en third-party-notices.txt. */
const COMPONENTS = [
  { name: 'alphaTab', license: 'MPL-2.0', note: 'partitura, tablatura y reproducción; se usa sin modificar', url: 'https://github.com/coderline/alphaTab' },
  { name: 'React', license: 'MIT', note: 'interfaz', url: 'https://react.dev' },
  { name: 'Zustand', license: 'MIT', note: 'estado de la interfaz', url: 'https://github.com/pmndrs/zustand' },
  { name: 'Dexie', license: 'Apache-2.0', note: 'progreso guardado en el dispositivo', url: 'https://dexie.org' },
  { name: 'Tonal', license: 'MIT', note: 'teoría musical (notas, escalas, acordes)', url: 'https://github.com/tonaljs/tonal' },
  { name: 'Workbox', license: 'MIT', note: 'funcionamiento sin conexión', url: 'https://developer.chrome.com/docs/workbox' },
  { name: 'Bravura', license: 'OFL-1.1', note: 'fuente de notación musical (© Steinberg Media Technologies GmbH)', url: 'https://github.com/steinbergmedia/bravura' },
  { name: 'Oswald', license: 'OFL-1.1', note: 'rótulos (© The Oswald Project Authors)', url: 'https://github.com/googlefonts/OswaldFont' },
  { name: 'Atkinson Hyperlegible Next', license: 'OFL-1.1', note: 'texto (© The Atkinson Hyperlegible Next Project Authors)', url: 'https://github.com/googlefonts/atkinson-hyperlegible-next' },
  {
    name: 'SoundFont «sonivox»',
    license: 'Apache-2.0 (según su paquete)',
    note: 'sonidos de la reproducción; origen y licencia pendientes de verificar',
    url: 'https://musical-artifacts.com/artifacts/1517',
  },
]

export function CreditsView() {
  return (
    <section className="panel settings legal" aria-labelledby="credits-title">
      <PanelTitle id="credits-title">Créditos y avisos</PanelTitle>

      <section aria-labelledby="credits-app">
        <h2 id="credits-app">{APP_NAME}</h2>
        <p>
          Profesor de bajo eléctrico, en español, sin cuenta y con funcionamiento sin conexión. Proyecto personal de código
          abierto: <a href={REPO_URL}>{REPO_URL.replace('https://', '')}</a>.
        </p>
        <ul>
          <li>
            <strong>Código:</strong> licencia MIT (ver <a href={`${REPO_URL}/blob/main/LICENSE`}>LICENSE</a>).
          </li>
          <li>
            <strong>Contenido del curso</strong> (lecciones y ejercicios): borrador redactado con ayuda de inteligencia artificial y todavía{' '}
            <strong>pendiente de revisión</strong>. No tiene licencia de reutilización concedida por ahora.
          </li>
          <li>
            Los ejercicios son originales; no hay tablaturas, letras ni audio de canciones con derechos de autor. Los sonidos del metrónomo,
            la batería y los acordes se generan en tu dispositivo.
          </li>
        </ul>
      </section>

      <section aria-labelledby="credits-third">
        <h2 id="credits-third">Software y recursos de terceros</h2>
        <ul>
          {COMPONENTS.map((c) => (
            <li key={c.name}>
              <a href={c.url}>{c.name}</a> · {c.license} · {c.note}
            </li>
          ))}
        </ul>
        <p>
          Cada uno conserva su licencia y sus derechos. Lista completa, copyrights y textos de licencia: <a href={NOTICES_URL}>avisos de terceros</a>{' '}
          (funciona sin conexión).
        </p>
        <p className="hint">
          Las lecciones enlazan vídeos de otros autores (BassBuzz, Scott&apos;s Bass Lessons, StudyBass, TalkingBass, etc.). Solo se enlazan: no se
          incrustan ni se copian, y son de sus autores.
        </p>
      </section>

      <section aria-labelledby="credits-use">
        <h2 id="credits-use">Aviso de uso</h2>
        <ul>
          <li>
            El contenido es educativo y se ofrece <strong>«tal cual»</strong>, sin garantía de que sea correcto, completo o adecuado para ti. No
            sustituye a un profesor.
          </li>
          <li>
            <strong>Cuida tus manos y tus oídos:</strong> si notas dolor, hormigueo o tensión en manos, muñecas o antebrazos, para y descansa; si
            persiste, consulta con un profesional sanitario. Usa un volumen razonable, sobre todo con auriculares.
          </li>
          <li>
            Los nombres de marcas, fabricantes, canales y músicos que aparecen son solo referencias. {APP_NAME} no tiene vínculo con ellos ni cuenta
            con su respaldo.
          </li>
        </ul>
      </section>

      <section aria-labelledby="credits-contact">
        <h2 id="credits-contact">Contacto y retirada de contenido</h2>
        <p>
          Si crees que algún contenido vulnera tus derechos o tiene un error, escribe a <a href={CONTACT_URL}>{CONTACT_LABEL}</a>. Me comprometo a retirar el
          contenido señalado en cuanto lo compruebe.
        </p>
        <p>
          <a href="#/privacidad">Aviso de privacidad</a>
        </p>
      </section>
    </section>
  )
}
