import mongoose from "mongoose";

const proyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  fecha_inicio: Date,
  fecha_fin: Date,
  estado: {
    type: String,
    enum: ["planificacion", "activo", "pausado", "completado"],
    default: "activo",
  },
  equipo_id: { type: mongoose.Schema.Types.ObjectId, ref: "Equipo" },
});

proyectoSchema.virtual("sprints", {
  ref: "Sprint",
  localField: "_id",
  foreignField: "proyecto_id",
});

proyectoSchema.set("toObject", { virtuals: true });
proyectoSchema.set("toJSON", { virtuals: true });

export default mongoose.model("Proyecto", proyectoSchema, "proyectos");
