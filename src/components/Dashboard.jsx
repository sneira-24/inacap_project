import React, { useState, useEffect } from "react";
import TarjetaProyecto from "./TarjetaProyecto";
import FechasProximas from "./FechasProximas";
import patricioImg from "/src/images/patriciobebe.jpg";
import MyWork from "./MyWork";

// Recorre todas las tareas de todos los sprints de un proyecto,
// y calcula qué % están en estado "done"
const calcularPorcentaje = (proyecto) => {
  const todasLasTareas = (proyecto.sprints || []).flatMap(
    (sprint) => sprint.tareas || [],
  );

  if (todasLasTareas.length === 0) return 0;

  const tareasCompletadas = todasLasTareas.filter(
    (tarea) => tarea.estado === "done",
  ).length;

  return Math.round((tareasCompletadas / todasLasTareas.length) * 100);
};

const fechasEjemplo = [
  {
    id: 1,
    proyecto: "Proyecto A",
    descripcion: "Entrega inicial",
    fecha: "12/12/2012",
  },
  {
    id: 2,
    proyecto: "Proyecto B",
    descripcion: "Revisión",
    fecha: "15/12/2012",
  },
  { id: 3, proyecto: "Proyecto C", descripcion: "Cierre", fecha: "20/12/2012" },
];

const Dashboard = ({ onLogout, email, onSprintClick, onVerDetalle }) => {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    window.dbAPI.getAllProjectsFull().then((data) => {
      setProyectos(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="flex items-center justify-between bg-gray-800 shadow-md px-6 py-3 mb-6 border-b border-gray-700">
        <button
          onClick={onLogout}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          Cerrar sesión
        </button>
        <span className="text-sm text-gray-300 font-medium truncate max-w-[50%]">
          {email}
        </span>
      </nav>

      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-start">
          <div className="md:col-span-2 bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700 flex flex-col gap-3">
            {proyectos.length === 0 ? (
              <p className="text-gray-400">Cargando proyectos...</p>
            ) : (
              proyectos.map((p) => (
                <TarjetaProyecto
                  key={p._id}
                  id={p._id}
                  imagen={patricioImg}
                  alt={p.nombre}
                  titulo={p.nombre}
                  fecha={new Date(p.fecha_fin).toLocaleDateString("es-CL", {
                    timeZone: "UTC",
                  })}
                  porcentaje={calcularPorcentaje(p)}
                  sprints={p.sprints}
                  onSprintClick={onSprintClick}
                />
              ))
            )}
          </div>

          <div className="md:col-span-1 bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-gray-200 mb-3">
              Fechas Importantes
            </h2>
            <div className="bg-white rounded-xl p-4 w-fit mx-auto">
              <FechasProximas proyectos={proyectos} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
          <MyWork emailUsuario={email} onVerDetalle={onVerDetalle} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
