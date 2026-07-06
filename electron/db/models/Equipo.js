import mongoose from "mongoose";

const equipoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  lider_id: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
});

export default mongoose.model("Equipo", equipoSchema, "equipos");
