import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  nombre: { type: String, required: true },
  rol: {
    type: String,
    enum: ["desarrollador", "lider", "producto", "admin"],
    default: "desarrollador",
  },
  fecha_union: { type: Date, default: Date.now },
});

export default mongoose.model("Usuario", usuarioSchema, "usuarios");
