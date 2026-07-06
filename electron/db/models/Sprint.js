import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema({
  proyecto_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proyecto",
    required: true,
  },
  numero: Number,
  fecha_inicio: Date,
  fecha_fin: Date,
  objetivo: String,
  estado: {
    type: String,
    enum: ["planificacion", "activo", "completado"],
    default: "planificacion",
  },
});

sprintSchema.virtual("tareas", {
  ref: "Tarea",
  localField: "_id",
  foreignField: "sprint_id",
});

sprintSchema.set("toObject", { virtuals: true });
sprintSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Sprint", sprintSchema, "sprints");
