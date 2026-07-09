# ProjectHub

Aplicación de escritorio para la administración de proyectos:login, proyectos, sprints y tareas, con vistas de dashboard, tablero Kanban y calendario de fechas importantes.

## Características

- **Login corporativo**: acceso restringido a correos `@project.cl`.
- **Dashboard de proyectos**: vista general de todos los proyectos, con sus sprints, porcentaje de avance (calculado en base a las tareas completadas) y sprint activo destacado.
- **Tablero Kanban**: gestión de tareas por sprint con *drag & drop* entre columnas (`To Do`, `In Progress`, `Done`), creación y eliminación de tareas, y registro de historial de cambios.
- **Calendario de fechas importantes**: muestra fechas de fin de proyecto (con alerta si quedan 7 días o menos) y feriados de Chile, obtenidos en tiempo real desde una API externa.
- **Módulo "Mi Trabajo"**: listado de tareas asignadas al usuario que inició sesión.

## Tecnologías

- **Frontend**: React + Vite
- **Escritorio**: Electron
- **Estilos**: Tailwind CSS
- **Base de datos**: MongoDB (vía Mongoose)
- **Calendario**: `react-day-picker`
- **Feriados**: [API de Boostr](https://boostr.cl/feriados)

## Requisitos previos

- Node.js instalado
- MongoDB corriendo localmente (por ejemplo, gestionado con [MongoDB Compass](https://www.mongodb.com/products/compass))

## Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Poblar la base de datos con datos de ejemplo
npm run seed

# 3. Levantar la aplicación
npm start
```

## Usuarios de prueba

Tras correr `npm run seed`, quedan disponibles los siguientes usuarios (contraseña `Password123!` para todos):

| Email | Rol |
|---|---|
| lider@project.cl | Líder |
| dev1@project.cl | Desarrollador |
| dev2@project.cl | Desarrollador |
| dev3@project.cl | Desarrollador |
| producto@project.cl | Producto |
