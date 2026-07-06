import React from "react";
import TarjetaProyecto from "./TarjetaProyecto";
import FechasProximas from "./FechasProximas";
import patricioImg from "/src/images/patriciobebe.jpg";
import MyWork from "./MyWork";

/*Datos de ejemplo — acá porque Dashboard es el "contenedor".
  Cuando haya backend, esto se reemplaza por un useEffect + fetch,
  guardando el resultado en un useState.*/
const proyectosEjemplo = [
  {
    id: 1,
    imagen: patricioImg,
    alt: "altPatricio",
    titulo: "Titulo Patricio",
    fecha_inicio: "2012-12-12",
    porcentaje: 17,
    sprints: [
      {
        id: 1,
        numero: "LOL1",
        fecha_ini: "2026-06-12",
        fecha_fin: "2026-07-01",
      },
      {
        id: 2,
        numero: "LOL2",
        fecha_ini: "2026-06-13",
        fecha_fin: "2026-07-02",
      },
      {
        id: 3,
        numero: "LOL3",
        fecha_ini: "2026-06-14",
        fecha_fin: "2026-07-03",
      },
    ],
  },
  {
    id: 2,
    imagen: patricioImg,
    alt: "altPatricio2",
    titulo: "Titulo Patricio 2",
    fecha_inicio: "6969-07-06",
    porcentaje: 67,
    sprints: [
      {
        id: 1,
        numero: "XD1",
        fecha_ini: "2026-06-15",
        fecha_fin: "2026-07-04",
      },
      {
        id: 2,
        numero: "XD2",
        fecha_ini: "2026-06-16",
        fecha_fin: "2026-07-05",
      },
    ],
  },
  {
    id: 3,
    imagen: patricioImg,
    alt: "altPatricio3",
    titulo: "Titulo Patricio 3",
    fecha_inicio: "6969-07-06",
    porcentaje: 21,
    sprints: [
      {
        id: 1,
        numero: "LMAO1",
        fecha_ini: "2026-06-17",
        fecha_fin: "2026-07-06",
      },
    ],
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

const Dashboard = ({ onLogout, email, onSprintClick, onVerDetalle }) => {
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

          <div className="md:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-700">
            <h2 className="text-lg font-semibold text-black-200 mb-3">
              Fechas Importantes
            </h2>
            <FechasProximas proyectos={proyectosEjemplo} />
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
