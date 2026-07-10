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
cd "$HOME\Downloads\deliver-assets-v1.3"
npm config set registry "https://registry.npmjs.org/"
npm ci
npm run dev
```

## Compilar

```powershell
npm run build
```

Todo continúa siendo una simulación local sin backend, pagos, GPS ni autenticación real.
