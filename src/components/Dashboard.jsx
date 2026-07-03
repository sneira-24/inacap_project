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

const Dashboard = ({ onLogout, email }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex items-center justify-between bg-white shadow-sm px-6 py-3 mb-6">
        <button
          onClick={onLogout}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
        >
          Cerrar sesión
        </button>
        <span className="text-sm text-gray-600 font-medium truncate max-w-[50%]">
          {email}
        </span>
      </nav>

      <div className="px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col gap-3">
            {proyectosEjemplo.map((p) => (
              <TarjetaProyecto key={p.id} {...p} />
            ))}
            {proyectosEjemplo.map((p) => (
              <TarjetaProyecto key={p.id} {...p} />
            ))}
            {proyectosEjemplo.map((p) => (
              <TarjetaProyecto key={p.id} {...p} />
            ))}
            {proyectosEjemplo.map((p) => (
              <TarjetaProyecto key={p.id} {...p} />
            ))}
          </div>

          <div className="md:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <FechasProximas fechas={fechasEjemplo} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">
            aquí iría el módulo de mi trabajo hoy
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
