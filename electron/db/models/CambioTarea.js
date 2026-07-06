import mongoose from "mongoose";

const cambioSchema = new mongoose.Schema({
  tarea_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Tarea",
    required: true,
  },
  campo: String,
  valor_anterior: String,
  valor_nuevo: String,
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("CambioTarea", cambioSchema, "cambios_tarea");
