# Basscraft: profesor de bajo (PWA)

Profesor de bajo eléctrico, en español, offline y sin backend.
Especificación: @docs/spec.md · Hoja de ruta: @docs/roadmap.md · Estado: @docs/project_state.md
Método pedagógico y fuentes: docs/pedagogy.md (léelo antes de escribir contenido).
Legal: `docs/legal-*.md`, `LICENSE`, `CONTENT-LICENSE.md` (borrador). Si cambias almacenamiento, micrófono o red, actualiza `PrivacyView.tsx`.

## Idioma

Responde, documenta y comenta el código en **español**. Los identificadores de código van en inglés.

## Comandos

- `npm run dev`: servidor de desarrollo (puerto 5180; `-- --host` para probar desde el móvil)
- `npm run lint`: oxlint
- `npm run typecheck`: `tsc -b`
- `npm test`: Vitest (unitarios, `src/**/*.test.ts`)
- `npm run test:e2e`: Playwright (hace build + preview en el puerto 4173)
- `npm run content:check`: valida `src/content/` (esquema Zod + referencias + alphaTex); los errores rompen el build
- `npm run build`: `content:check` + tipos + build de producción

Antes de cada commit: `npm run lint && npm run typecheck && npm test && npm run build`.
Si tocas UI o audio, ejecuta también `npm run test:e2e`.

## Documentación = fuente de verdad

`docs/` manda sobre el historial del chat. Después de cada tarea relevante, actualiza lo que corresponda:
`project_state.md` (siempre), `todos.md`, `decisions.md` (cualquier decisión técnica, con su motivo),
`architecture.md` (si cambia el stack o la estructura) y `business.md` (si cambian los requisitos).

## Reglas

- TypeScript `strict`; sin `any`.
- Trabaja por fase: lee `docs/roadmap.md` e implementa SOLO la fase o el entregable indicado.
  Al terminar, resume qué criterios de aceptación cumples y cuáles no.
- Audio: NUNCA dispares sonidos con `setTimeout`/`setInterval`. Prográmalos sobre `AudioContext.currentTime`
  (ver `.claude/rules/audio.md`).
- `AudioContext` se crea o reanuda solo tras un gesto del usuario (requisito de iOS).
- Teoría musical siempre vía `src/theory/` (Tonal.js); no calcules notas a mano en los componentes.
- Mástil: 4/5/6 cuerdas, afinaciones arbitrarias y zurdo desde el principio.
- Contenido: formato en `docs/content-guide.md`; todo lo que generes, `status: borrador`. Solo ejercicios originales o de dominio público. Nada de tablaturas, letras ni audio de canciones con copyright.
- UI: objetivos táctiles ≥ 48 px en controles principales y contraste WCAG AA. Decoración skeuomórfica solo en el marco,
  nunca detrás del texto. No combines los rasgos de Orange Amps (ver `docs/spec.md`).
- Nomenclatura por defecto: anglosajona (C-D-E); la latina, conmutable.

## Git

Tras completar una tarea: commit con un mensaje descriptivo en español y push a `origin`.
