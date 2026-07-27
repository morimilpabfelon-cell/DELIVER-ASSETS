# Arquitectura de DELIVER ASSETS

## Estado actual

DELIVER ASSETS es un prototipo frontend desarrollado con React, TypeScript y Vite.

Actualmente funciona como una simulación local. No incluye backend de producción, autenticación real, pagos reales, GPS real ni persistencia remota.

## Archivos principales

- src/main.tsx: punto de entrada de React.
- src/App.tsx: aplicación y vistas principales.
- src/styles.css: estilos globales.
- vite.config.ts: configuración local de Vite.
- tests/project-structure.test.mjs: pruebas estructurales.
- scripts/verify-project.mjs: verificación posterior al build.

## Riesgos estructurales

src/App.tsx y src/styles.css concentran una cantidad elevada de código.

No deben dividirse mediante una refactorización masiva. La separación se realizará gradualmente y se ejecutará npm.cmd run check después de cada cambio.

## Orden de refactorización

1. Tipos e interfaces.
2. Datos simulados y constantes.
3. Componentes visuales sin estado.
4. Navegación principal.
5. Vistas de cliente.
6. Vistas de negocio.
7. Vistas de repartidor.
8. Vistas administrativas.
9. Estilos por sección.
10. Carga diferida de vistas.

## Reglas obligatorias

Antes de guardar cambios ejecutar:

- npm.cmd run check
- git diff --check
- git status

No deben subirse node_modules, dist, archivos .env, credenciales, claves API, archivos tsbuildinfo ni archivos JavaScript generados desde vite.config.ts.

## Política de cambios

- Un objetivo por commit.
- Cambios pequeños y reversibles.
- No mezclar diseño con refactorización.
- No modificar funciones no relacionadas.
- No crear commits cuando npm.cmd run check falle.
- No usar git add . sin revisar los archivos.
