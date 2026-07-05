import React from "react";
import TarjetaProyecto from "./TarjetaProyecto";
import FechasProximas from "./FechasProximas";
import patricioImg from "/src/images/patriciobebe.jpg";
import "./Dashboard.css";

/*Datos de ejemplo — acá porque Dashboard es el "contenedor".
  Cuando haya backend, esto se reemplaza por un useEffect + fetch,
  guardando el resultado en un useState.*/
const proyectosEjemplo = [
  {
    id: 1,
    imagen: patricioImg,
    alt: "altPatricio",
    titulo: "Titulo Patricio",
    fecha: "12/12/2012",
    porcentaje: 17,
    sprints: [
      { id: 1, numero: "LOL1" },
      { id: 2, numero: "LOL2" },
      { id: 3, numero: "LOL3" },
    ],
  },
  {
    id: 2,
    imagen: patricioImg,
    alt: "altPatricio2",
    titulo: "Titulo Patricio 2",
    fecha: "06/07/6969",
    porcentaje: 67,
    sprints: [
      { id: 1, numero: "XD1" },
      { id: 2, numero: "XD2" },
    ],
  },
  {
    id: 3,
    imagen: patricioImg,
    alt: "altPatricio3",
    titulo: "Titulo Patricio 3",
    fecha: "06/07/6969",
    porcentaje: 21,
    sprints: [{ id: 1, numero: "LMAO1" }],
  },
];

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

const Dashboard = ({ onLogout, email, onSprintClick }) => {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700 flex flex-col gap-3">
            {proyectosEjemplo.map((p) => (
              <TarjetaProyecto
                onSprintClick={onSprintClick}
                key={p.id}
                {...p}
              />
            ))}
          </div>

          <div className="md:col-span-1 bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
            <FechasProximas fechas={fechasEjemplo} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-gray-200">
            aquí iría el módulo de mi trabajo hoy
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
