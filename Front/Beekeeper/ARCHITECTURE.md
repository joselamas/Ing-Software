# Arquitectura Limpia en Beekeeper

## Introducción

Este documento describe la arquitectura recomendada para el proyecto Beekeeper, basada en el esquema en `src/`.

Beekeeper es una aplicación React modular para gestionar apicultores, colmenas y apiarios. Cada módulo tiene su propia carpeta y se organiza internamente en:
- `hooks/` para la lógica de React y estados
- `css/` para estilos específicos
- archivos principales de vista en la carpeta del módulo

Además, `src/webService/` actúa como la capa de servicios que comunica el frontend con el backend.

## Estructura de carpetas recomendada

```
src/
├── apiarios/
│   ├── hooks/
│   ├── css/
│   └── apiario.js
├── colmenas/
│   ├── hooks/
│   ├── css/
│   └── colmena.js
├── componentes/
├── imagenes/
├── nbar/
│   ├── barra.js
│   └── barra.css
├── styles/
├── usuario/
│   ├── hooks/
│   │   ├── useCrearUsuario.js
│   │   ├── useLogin.js
│   │   └── useModificarUsuario.js
│   ├── css/
│   │   ├── crearUsuario.css
│   │   ├── login.css
│   │   └── modificarUsuario.css
│   ├── crearUsuario.js
│   ├── login.js
│   └── modificarUsuario.js
├── webService/
│   ├── WS_apiario.js
│   ├── WS_colmena.js
│   └── WS_usuario.js
├── App.js
└── index.js
```

## Principios de Arquitectura Limpia aplicados

### 1. App.js como base del proyecto

`App.js` es el punto de entrada principal. Su función es:
- definir la navegación entre módulos
- mantener el estado global mínimo necesario
- renderizar las vistas principales

No debe contener lógica de negocio de usuario, colmena o apiario. Esa lógica debe estar en los módulos correspondientes.

### 2. Módulos independientes por dominio

Cada módulo representa una funcionalidad clara del sistema:
- `usuario/`
- `colmenas/`
- `apiarios/`

Cada módulo debe incorporar:
- `hooks/` para la lógica de React
- `css/` para estilos propios
- vistas en la raíz del módulo

Esto permite que cada módulo sea autocontenido y fácil de mantener.

### 3. Hooks como adaptadores de presentación

Los hooks en `src/<modulo>/hooks/` deben:
- manejar estados y efectos de React
- consumir los servicios de `src/webService/`
- transformar y preparar datos para la UI
- manejar errores y estados de carga

Ejemplos:
- `useLogin.js` en `src/usuario/hooks/`
- `useCrearUsuario.js` en `src/usuario/hooks/`
- `useModificarUsuario.js` en `src/usuario/hooks/`

### 4. CSS por módulo como capa de presentación

Cada módulo usa su carpeta `css/` para mantener estilos locales.
- `src/usuario/css/login.css`
- `src/usuario/css/crearUsuario.css`
- `src/usuario/css/modificarUsuario.css`

Los estilos compartidos pueden ir en `src/styles/`.

### 5. webService como capa de infraestructura

`src/webService/` es la capa encargada de la comunicación con el backend.
Cada módulo debe tener su propio WS, por ejemplo:
- `WS_usuario.js`
- `WS_colmena.js`
- `WS_apiario.js`

Estos archivos deberían contener funciones como:
- `loginUsuario()`
- `crearUsuario()`
- `actualizarUsuario()`
- `obtenerColmenas()`
- `crearColmena()`
- `obtenerApiarios()`

## Flujo de datos recomendado

1. El usuario usa una vista en `src/usuario/`, `src/colmenas/` o `src/apiarios/`.
2. La vista usa un hook de `src/<modulo>/hooks/`.
3. El hook llama a una función de `src/webService/`.
4. El servicio realiza la llamada al backend y devuelve datos.
5. El hook transforma y entrega los datos a la vista.

## Mapa de responsabilidades

| Carpeta | Función | Equivalente en Arquitectura Limpia |
|--------|---------|-----------------------------------|
| `src/usuario/` | UI y lógica de presentación de usuario | Interface Adapters + Presentation |
| `src/colmenas/` | UI y lógica de colmena | Interface Adapters + Presentation |
| `src/apiarios/` | UI y lógica de apiario | Interface Adapters + Presentation |
| `src/webService/` | Conexión con backend | Infrastructure |
| `src/App.js` | Coordinador y punto de entrada | Application / Orquestador |
| `src/styles/` | Estilos globales compartidos | Presentation |

## Buenas prácticas para Beekeeper

- Mantén `App.js` libre de lógica de negocio específica.
- Usa `hooks/` para lógica de React y llamadas a APIs.
- Mantén `css/` por módulo para evitar estilos globales no controlados.
- Usa `webService/` solo para llamadas HTTP y mapeo de datos.
- No mezcles lógica de negocio en las vistas.

## Ejemplo de flujo en el módulo usuario

1. `App.js` muestra la vista `src/usuario/login.js`
2. `login.js` usa `src/usuario/hooks/useLogin.js`
3. `useLogin.js` llama a `src/webService/WS_usuario.js`
4. `WS_usuario.js` consulta al backend
5. El hook devuelve el resultado a la vista

## Conclusión

Esta arquitectura mantiene a Beekeeper modular, escalable y fácil de mantener. La separación entre UI, hooks y servicios crea una base clara para seguir desarrollando los módulos de usuario, colmenas y apiarios.
