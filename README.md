# Proyecto GESTIÓN DE EVENTOS Y RESERVAS 

Este proyecto es una aplicación Full Stack que utiliza **React** en el frontend y **Node.js con Express** en el backend. La base de datos es gestionada con **MySQL**.

### Requisitos previos
- Node.js (v20.13.1 o superior)
- MySQL (configurado y en ejecución)
- NPM o Yarn

## Configurar las variables de entorno
Renombrar el archivo __.env.template__ a __.env__

### Instalación

1. Clona el repositorio: https://github.com/Diego-Buitrago/GESTION_EVENTOS_RESERVAS.git
2. cd GESTION_EVENTOS_RESERVAS/frontend npm install (o yarn install)
3. cd GESTION_EVENTOS_RESERVAS/backend npm install (o yarn install)

## Descripción de la base de datos
- Ejecutar script backend/src/datase/script.sql
- La base de datos cuenta con dos tablas eventos y reservas
- Tabla eventos 
    - id (clave primaria)
    - nombre
    - descripcion
    - fecha
    - cupo (número total de plazas disponibles)
- Tabla reservas
    - id (clave primaria)
    - evento_id (clave foránea a la tabla Eventos)
    - nombre_usuario
    - email
    - numero_plazas (cantidad de plazas reservadas)
    - estado (valores posibles: pendiente, confirmada, cancelada, con valor por defecto pendiente).

## Descripción de los endpoints
- **GET /api/eventos:**: Obtiene todos los eventos registrados en la base de datos
- **POST /api/eventos:**: Crea un nuevo evento
- **PUT /api/eventos/:id:**: Actualiza un evento
- **DELETE /api/eventos/:id:**: Elimina un evento

- **POST /api/reservas:**: Crear una nueva reserva para un evento
- **GET /api/reservas/:idEvento:**: Obtiene las reservas de un evento
- **PUT /api/reservas/:id/estado:**: Actualiza el estado de un evento

## Iniciar app
- En la carpeta frontend: npm run dev (o yarn dev)
- En la carpeta backend: npm run dev (o yarn dev)
