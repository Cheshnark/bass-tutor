# Negocio

## Objetivo

Un profesor de bajo eléctrico en web/PWA, en español, que funcione offline y sin cuenta.
No es una guía "pasiva". Es una **guía de baja fricción con práctica activa obligatoria**: cada
lección termina en algo que se toca con metrónomo, con un tempo objetivo, autoevaluación y repaso.

Base: [research.md](research.md) (investigación previa, con fuentes y nivel de evidencia marcado).

## Usuarios

- **Ahora:** uso personal del autor, de principiante a intermedio.
- **Más adelante (sin decidir):** posible apertura a más usuarios. Eso cambiaría las decisiones de marca,
  licencias y backend (ver [decisions.md](decisions.md)).

## Supuestos

- Bajo de 4 cuerdas como caso base; 5 y 6 cuerdas y modo zurdo desde el diseño.
- Interfaz y contenido en español. Nomenclatura **anglosajona (C-D-E) por defecto**, con la latina (Do-Re-Mi) conmutable.
- Uso con el bajo colgado y el móvil a un metro de distancia: controles principales de 48 px o más, texto grande y contraste AA.

## Requisitos del primer hito (Fase 0)

1. Repositorio con Vite + React + TypeScript estricto, lint, tests unitarios, tests e2e y CI.
2. Prueba de concepto de **alphaTab**: renderiza partitura + tablatura de un ejercicio alphaTex original y lo reproduce.
3. Prueba de concepto de **metrónomo** programado sobre `AudioContext.currentTime`, sin deriva.
4. Validación manual en el móvil propio (Chrome Android y/o Safari iOS): audio, standalone y almacenamiento.

## Fuera de alcance (explícito)

Corrección automática de la interpretación, repertorio comercial con licencia, vídeo propio a gran escala y funciones sociales.
