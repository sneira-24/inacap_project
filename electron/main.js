import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import isDev from "electron-is-dev";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tareaSchema = new mongoose.Schema({
  titulo: String,
  completada: Boolean,
});

const Tarea = mongoose.model("Tarea", tareaSchema);

async function conectarDB() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/mi_app");
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Error conectando a MongoDB:", err);
  }
}

let ventana;

function crearVentana() {
  ventana = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    ventana.loadURL("http://localhost:5173");
    ventana.webContents.openDevTools();
  } else {
    ventana.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

app.whenReady().then(async () => {
  await conectarDB();
  crearVentana();
});

ipcMain.handle("crear-tarea", async (_, titulo) => {
  return await Tarea.create({
    titulo,
    completada: false,
  });
});

ipcMain.handle("listar-tareas", async () => {
  return await Tarea.find();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
