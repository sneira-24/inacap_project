import mongoose from "mongoose";

const tareaSchema = new mongoose.Schema({
  sprint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sprint",
    required: true,
  },
  titulo: { type: String, required: true },
  descripcion: String,
  asignado_a: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  prioridad: {
    type: String,
    enum: ["baja", "media", "alta", "critica"],
    default: "media",
  },
  estado: {
    type: String,
    enum: ["todo", "in_progress", "done"],
    default: "todo",
  },
  story_points: Number,
});

export default mongoose.model("Tarea", tareaSchema, "tareas");
