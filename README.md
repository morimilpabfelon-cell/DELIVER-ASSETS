# DELIVER ASSETS — Web v1.3 Motion System

Reconstrucción visual de la web después de revisar nuevamente el video de referencia.

## Cambios principales

- hero cinematográfico con marca cinética;
- logo con revelado, máscaras y rutas animadas;
- escenas de categoría diferenciadas;
- DELIVER ID con composiciones específicas por rol;
- navegación de cliente simplificada en escritorio;
- la barra técnica del flujo queda fuera de la experiencia normal;
- cambio visual completo al seleccionar comida, mercado, farmacia o envíos;
- portadas de comercio con lenguaje gráfico por categoría;
- cliente, negocio, repartidor y administración tienen personalidades distintas;
- reducción de bordes y sombras repetitivas;
- sistema de movimiento de marca, interfaz y estados;
- soporte para `prefers-reduced-motion`;
- se preservan las correcciones funcionales y de responsive de la v1.2.

## Ejecutar

```powershell
cd "$HOME\DELIVER-ASSETS"
npm config set registry "https://registry.npmjs.org/"
npm.cmd ci
npm.cmd run dev -- --open
```

## Compilar

```powershell
npm.cmd run build
```

Todo continúa siendo una simulación local sin backend, pagos, GPS ni autenticación real.
## Verificación local

Instalar las dependencias:

    npm.cmd ci

Ejecutar todas las pruebas y comprobaciones:

    npm.cmd run check

Iniciar el servidor local:

    npm.cmd run dev -- --open

La aplicación se ejecuta normalmente en:

    http://localhost:5173

Durante esta fase, DELIVER ASSETS utiliza Vite localmente y no utiliza GitHub Pages.

La estructura técnica y las reglas de modificación están documentadas en [ARCHITECTURE.md](ARCHITECTURE.md).
