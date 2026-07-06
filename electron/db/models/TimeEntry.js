import mongoose from "mongoose";

const timeEntrySchema = new mongoose.Schema({
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
  horas: mongoose.Schema.Types.Decimal128,
  fecha: Date,
  descripcion: String,
});

export default mongoose.model("TimeEntry", timeEntrySchema, "time_entries");
