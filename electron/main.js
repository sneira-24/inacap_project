import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import isDev from "electron-is-dev";
import { connectDB } from "./db/connection.js";
import {
  Usuario,
  Equipo,
  Proyecto,
  Sprint,
  Tarea,
  ComentarioTarea,
  TimeEntry,
  CambioTarea,
} from "./db/models/index.js";
import { serialize } from "./db/serialize.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(async () => {
  await connectDB();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

const models = {
  Usuario,
  Equipo,
  Proyecto,
  Sprint,
  Tarea,
  ComentarioTarea,
  TimeEntry,
  CambioTarea,
};

function handle(channel, fn) {
  ipcMain.handle(channel, async (...args) => {
    const result = await fn(...args);
    return serialize(result);
  });
}

// ---- Generic CRUD ----
handle("db:find", async (_e, { model, filter = {}, populate = null }) => {
  let query = models[model].find(filter);
  if (populate) query = query.populate(populate);
  return query.lean();
});

handle("db:findOne", async (_e, { model, filter }) => {
  return models[model].findOne(filter).lean();
});

handle("db:findById", async (_e, { model, id, populate = null }) => {
  let query = models[model].findById(id);
  if (populate) query = query.populate(populate);
  return query.lean();
});

handle("db:create", async (_e, { model, data }) => {
  const doc = await models[model].create(data);
  return doc.toObject();
});

handle("db:updateById", async (_e, { model, id, data }) => {
  return models[model]
    .findByIdAndUpdate(id, data, { returnDocument: "after" })
    .lean();
});

handle("db:deleteById", async (_e, { model, id }) => {
  return models[model].findByIdAndDelete(id).lean();
});

handle("db:getSprintsByProject", async (_e, proyectoId) => {
  return Sprint.find({ proyecto_id: proyectoId }).lean();
});

handle("db:getTareasBySprint", async (_e, sprintId) => {
  return Tarea.find({ sprint_id: sprintId })
    .populate("asignado_a", "nombre email")
    .lean();
});

handle("db:getProjectFull", async (_e, proyectoId) => {
  return Proyecto.findById(proyectoId)
    .populate({
      path: "sprints",
      populate: {
        path: "tareas",
        populate: { path: "asignado_a", select: "nombre email" },
      },
    })
    .lean({ virtuals: true });
});

handle("db:getAllProjectsFull", async () => {
  return Proyecto.find()
    .populate({
      path: "sprints",
      populate: {
        path: "tareas",
        populate: { path: "asignado_a", select: "nombre email" },
      },
    })
    .lean({ virtuals: true });
});

handle("db:getTareasByUsuario", async (_e, usuarioId) => {
  return Tarea.find({ asignado_a: usuarioId })
    .populate({
      path: "sprint_id",
      populate: { path: "proyecto_id", select: "nombre" },
    })
    .lean();
});

handle("db:getComentariosByTarea", async (_e, tareaId) => {
  return ComentarioTarea.find({ tarea_id: tareaId })
    .populate("usuario_id", "nombre")
    .sort({ fecha: 1 })
    .lean();
});

ipcMain.handle("db:validarLogin", async (_e, { email, password }) => {
  try {
    // Buscar al usuario
    const user = await models.Usuario.findOne({ email }).lean();
    if (!user)
      return {
        exito: false,
        mensaje: "El correo electrónico no está registrado.",
      };

    // Comparar la contraseña ingresada con el hash de la BD
    const contrasenaValida = await bcrypt.compare(password, user.contraseña);
    if (!contrasenaValida)
      return { exito: false, mensaje: "Contraseña incorrecta." };

    // Quitar la contraseña del objeto antes de enviarlo a React (por seguridad)
    const { contraseña, ...usuarioSeguro } = user;
    return { exito: true, usuario: usuarioSeguro };
  } catch (error) {
    console.error("Error en login:", error);
    return { exito: false, mensaje: "Error interno del servidor." };
  }
});

ipcMain.handle("db:updateTarea", async (_e, { id, nuevaDescripcion }) => {
  try {
    const tareaActualizada = await models.Tarea.findByIdAndUpdate(
      id,
      { descripcion: nuevaDescripcion },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).lean();

    if (!tareaActualizada) {
      return {
        exito: false,
        mensaje: "La tarea no existe en la base de datos.",
      };
    }

    return { exito: true, tarea: serialize(tareaActualizada) };
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    return {
      exito: false,
      mensaje: "Error interno al guardar en la base de datos.",
    };
  }
});
