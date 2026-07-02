import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [tareas, setTareas] = useState([]);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    cargarTareas();
  }, []);

  async function cargarTareas() {
    try {
      const datos = await window.db.listarTareas();
      setTareas(datos);
    } catch (err) {
      console.error(err);
    }
  }

  async function agregarTarea() {
    if (titulo.trim() === "") return;

    try {
      await window.db.crearTarea(titulo);

      setTitulo("");

      cargarTareas();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <h1>Mis tareas</h1>

      <div className="form">
        <input
          type="text"
          placeholder="Escribe una tarea..."
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <button onClick={agregarTarea}>Agregar</button>
      </div>

      <ul>
        {tareas.map((tarea) => (
          <li key={tarea._id}>{tarea.titulo}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
