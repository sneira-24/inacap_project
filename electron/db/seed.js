import mongoose from "mongoose";
import dotenv from "dotenv";
import {
  Usuario,
  Equipo,
  Proyecto,
  Sprint,
  Tarea,
  ComentarioTarea,
  TimeEntry,
  CambioTarea,
} from "./models/index.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017";
const DB_NAME = process.env.DB_NAME || "inacap_project";

async function seed() {
  await mongoose.connect(MONGO_URI, { dbName: DB_NAME });
  console.log("Connected for seeding:", DB_NAME);

  await Promise.all([
    Usuario.deleteMany({}),
    Equipo.deleteMany({}),
    Proyecto.deleteMany({}),
    Sprint.deleteMany({}),
    Tarea.deleteMany({}),
    ComentarioTarea.deleteMany({}),
    TimeEntry.deleteMany({}),
    CambioTarea.deleteMany({}),
  ]);
  console.log("Cleared existing collections");

  const [lider, dev1, dev2, producto, dev3] = await Usuario.insertMany([
    {
      email: "lider@project.cl",
      contraseña: "Password123!",
      nombre: "Roberto Silva",
      rol: "lider",
    },
    {
      email: "dev1@project.cl",
      contraseña: "Password123!",
      nombre: "Juan Pérez",
      rol: "desarrollador",
    },
    {
      email: "dev2@project.cl",
      contraseña: "Password123!",
      nombre: "María García",
      rol: "desarrollador",
    },
    {
      email: "producto@project.cl",
      contraseña: "Password123!",
      nombre: "Carlos López",
      rol: "producto",
    },
    {
      email: "dev3@project.cl",
      contraseña: "Password123!",
      nombre: "Ana Rodríguez",
      rol: "desarrollador",
    },
  ]);
  console.log("Usuarios created");

  const [backendTeam, frontendTeam] = await Equipo.insertMany([
    {
      nombre: "Backend Team",
      descripcion: "Equipo de desarrollo backend",
      lider_id: lider._id,
    },
    {
      nombre: "Frontend Team",
      descripcion: "Equipo de desarrollo frontend",
      lider_id: lider._id,
    },
  ]);
  console.log("Equipos created");

  const [platformV2, mobileApp] = await Proyecto.insertMany([
    {
      nombre: "Platform v2.0",
      descripcion: "Rediseño completo de la plataforma",
      fecha_inicio: new Date("2025-01-01"),
      fecha_fin: new Date("2025-03-31"),
      estado: "activo",
      equipo_id: backendTeam._id,
    },
    {
      nombre: "Mobile App",
      descripcion: "Aplicación móvil nativa",
      fecha_inicio: new Date("2025-02-01"),
      fecha_fin: new Date("2025-04-30"),
      estado: "planificacion",
      equipo_id: frontendTeam._id,
    },
  ]);
  console.log("Proyectos created");

  const [sprint1, sprint2, sprint3] = await Sprint.insertMany([
    {
      proyecto_id: platformV2._id,
      numero: 1,
      fecha_inicio: new Date("2025-01-01"),
      fecha_fin: new Date("2025-01-14"),
      objetivo: "Configurar infrastructure",
    },
    {
      proyecto_id: platformV2._id,
      numero: 2,
      fecha_inicio: new Date("2025-01-15"),
      fecha_fin: new Date("2025-01-28"),
      objetivo: "API endpoints básicos",
    },
    {
      proyecto_id: mobileApp._id,
      numero: 1,
      fecha_inicio: new Date("2025-02-01"),
      fecha_fin: new Date("2025-02-14"),
      objetivo: "Setup proyecto React Native",
    },
  ]);
  console.log("Sprints created");

  const [tarea1, tarea2, tarea3] = await Tarea.insertMany([
    {
      sprint_id: sprint1._id,
      titulo: "Configurar CI/CD",
      descripcion: "Setup de pipelines",
      asignado_a: dev1._id,
      prioridad: "alta",
      story_points: 8,
    },
    {
      sprint_id: sprint1._id,
      titulo: "Crear BD inicial",
      descripcion: "MongoDB setup",
      asignado_a: dev2._id,
      prioridad: "critica",
      story_points: 5,
    },
    {
      sprint_id: sprint2._id,
      titulo: "Endpoint usuarios",
      descripcion: "POST /users",
      asignado_a: dev1._id,
      prioridad: "alta",
      story_points: 5,
    },
    {
      sprint_id: sprint2._id,
      titulo: "Endpoint productos",
      descripcion: "GET /products",
      asignado_a: dev2._id,
      prioridad: "media",
      story_points: 3,
    },
    {
      sprint_id: sprint3._id,
      titulo: "Setup React Native",
      descripcion: "Configuración inicial",
      asignado_a: dev3._id,
      prioridad: "alta",
      story_points: 3,
    },
  ]);
  console.log("Tareas created");

  await ComentarioTarea.insertMany([
    {
      tarea_id: tarea1._id,
      usuario_id: lider._id,
      texto: "Validar con DevOps antes de completar",
    },
    {
      tarea_id: tarea2._id,
      usuario_id: dev2._id,
      texto: "Necesito la documentación de esquema",
    },
    { tarea_id: tarea3._id, usuario_id: dev1._id, texto: "Listo para testing" },
  ]);
  console.log("Comentarios created");

  await TimeEntry.insertMany([
    {
      tarea_id: tarea1._id,
      usuario_id: dev1._id,
      horas: 4.5,
      fecha: new Date("2025-01-07"),
      descripcion: "Configuración GitHub Actions",
    },
    {
      tarea_id: tarea1._id,
      usuario_id: dev1._id,
      horas: 3,
      fecha: new Date("2025-01-08"),
      descripcion: "Testing del pipeline",
    },
    {
      tarea_id: tarea2._id,
      usuario_id: dev2._id,
      horas: 6,
      fecha: new Date("2025-01-07"),
      descripcion: "Diseño de colecciones",
    },
    {
      tarea_id: tarea3._id,
      usuario_id: dev1._id,
      horas: 2,
      fecha: new Date("2025-01-10"),
      descripcion: "Implementación endpoint",
    },
  ]);
  console.log("Time entries created");

  await CambioTarea.insertMany([
    {
      tarea_id: tarea1._id,
      campo: "estado",
      valor_anterior: "todo",
      valor_nuevo: "in_progress",
      usuario_id: dev1._id,
    },
    {
      tarea_id: tarea1._id,
      campo: "prioridad",
      valor_anterior: "media",
      valor_nuevo: "alta",
      usuario_id: lider._id,
    },
    {
      tarea_id: tarea3._id,
      campo: "asignado_a",
      valor_anterior: "Sin asignar",
      valor_nuevo: "Juan Pérez",
      usuario_id: lider._id,
    },
  ]);
  console.log("Cambios created");

  console.log("✅ Seed completed successfully");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
