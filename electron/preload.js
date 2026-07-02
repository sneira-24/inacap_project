import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("db", {
  crearTarea: (titulo) => ipcRenderer.invoke("crear-tarea", titulo),

  listarTareas: () => ipcRenderer.invoke("listar-tareas"),
});
