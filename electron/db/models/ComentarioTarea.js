import mongoose from "mongoose";

const comentarioSchema = new mongoose.Schema({
  tarea_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tarea",
    required: true,
  },
  usuario_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  texto: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model(
  "ComentarioTarea",
  comentarioSchema,
  "comentarios_tarea",
);
