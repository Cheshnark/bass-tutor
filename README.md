# Basscraft

Profesor de bajo eléctrico, en español, como web/PWA: **sin cuenta, sin servidor y con funcionamiento sin conexión**.
Lecciones cortas que terminan tocando con metrónomo, con mástil interactivo, partitura y tablatura reproducibles.

- Versión publicada: https://cheshnark.github.io/bass-tutor/
- Estado: Fases 0–6 hechas; contenido (Fase 7) escrito como **borrador pendiente de revisión pedagógica**.
  Detalle en [docs/project_state.md](docs/project_state.md).

## Qué incluye

- Curso: 26 módulos, 79 lecciones y 123 ejercicios (tronco común, ampliación común y cuatro itinerarios: metal/punk,
  rock/pop, blues/jazz y funk/soul).
- Mástil (4/5/6 cuerdas, afinaciones alternativas, zurdo), metrónomo, diccionario de teoría, afinador (experimental),
  práctica con repaso espaciado y quiz de mástil, entrenamiento de oído.
- Progreso guardado en tu dispositivo; copia exportable.

## Ejecutarlo

Requiere Node.js 22.

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # valida el contenido, comprueba tipos y compila
npm test           # unitarios
npm run test:e2e   # Playwright (build + preview)
```

Documentación del proyecto en [`docs/`](docs/): negocio, arquitectura, decisiones, hoja de ruta e investigación.

## Licencias, créditos y privacidad

- **Código:** [MIT](LICENSE).
- **Contenido del curso** (`src/content/`): sin licencia concedida todavía. Hay un [borrador](CONTENT-LICENSE.md) que propone
  CC BY-SA 4.0 cuando termine la revisión.
- **Terceros:** [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) (se regenera con `npm run notices`) y, dentro de la app,
  la página *Créditos y avisos* (`#/creditos`).
- **Privacidad:** la app no usa cuentas, cookies ni analítica y guarda todo en tu dispositivo; ver la página *Privacidad*
  dentro de la app (`#/privacidad`).
- Auditoría de procedencia y licencias: [procedencia](docs/legal-provenance.md), [licencias](docs/legal-licenses.md),
  [historial de git](docs/legal-history-scan.md) y [nombre y marcas](docs/legal-naming.md). Son informes técnicos, no
  asesoramiento legal.

## Aviso

Contenido educativo «tal cual», sin garantía. Si notas dolor en manos o muñecas, para; usa un volumen razonable.
Las marcas citadas son solo referencias, sin vínculo ni respaldo. Para reclamaciones o retirada de contenido:
escribe a csnark.dev@gmail.com (ver también *Créditos y avisos*).
