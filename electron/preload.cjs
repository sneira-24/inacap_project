const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("dbAPI", {
  find: (model, filter, populate) =>
    ipcRenderer.invoke("db:find", { model, filter, populate }),
  findOne: (model, filter) =>
    ipcRenderer.invoke("db:findOne", { model, filter }),
  findById: (model, id, populate) =>
    ipcRenderer.invoke("db:findById", { model, id, populate }),
  create: (model, data) => ipcRenderer.invoke("db:create", { model, data }),
  updateById: (model, id, data) =>
    ipcRenderer.invoke("db:updateById", { model, id, data }),
  deleteById: (model, id) => ipcRenderer.invoke("db:deleteById", { model, id }),
  validarLogin: (email, password) =>
    ipcRenderer.invoke("db:validarLogin", { email, password }),
  updateTarea: (id, nuevaDescripcion) =>
    ipcRenderer.invoke("db:updateTarea", { id, nuevaDescripcion }),

  getSprintsByProject: (proyectoId) =>
    ipcRenderer.invoke("db:getSprintsByProject", proyectoId),
  getTareasBySprint: (sprintId) =>
    ipcRenderer.invoke("db:getTareasBySprint", sprintId),
  getAllProjectsFull: () => ipcRenderer.invoke("db:getAllProjectsFull"),
  getProjectFull: (proyectoId) =>
    ipcRenderer.invoke("db:getProjectFull", proyectoId),
  getTareasByUsuario: (usuarioId) =>
    ipcRenderer.invoke("db:getTareasByUsuario", usuarioId),
  getComentariosByTarea: (tareaId) =>
    ipcRenderer.invoke("db:getComentariosByTarea", tareaId),
});
