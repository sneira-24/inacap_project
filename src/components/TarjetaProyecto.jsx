import React from "react";

const esSprintActivo = (sprint) => {
  if (!sprint.fecha_inicio || !sprint.fecha_fin) return false;
  const hoy = new Date();
  const inicio = new Date(sprint.fecha_inicio);
  const fin = new Date(sprint.fecha_fin);
  return hoy >= inicio && hoy <= fin;
};

const TarjetaProyecto = ({
  id,
  imagen,
  alt,
  titulo,
  fecha,
  porcentaje,
  onSprintClick,
  sprints = [],
}) => {
  return (
    <div className="flex items-center gap-4 bg-gray-700 rounded-xl p-3 border border-gray-600 hover:border-gray-500 transition-colors">
      <div className="flex-shrink-0">
        <img
          src={imagen}
          alt={alt}
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-100 truncate">
          {titulo}
        </h3>

        <div className="flex gap-2 mt-2">
          {sprints.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No hay Sprint para este Proyecto
            </p>
          ) : (
            sprints.map((sprint) => {
              const activo = esSprintActivo(sprint);
              return (
                <button
                  className={`text-xs font-medium border rounded-full px-3 py-1 transition-colors cursor-pointer ${
                    activo
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-500"
                      : "text-blue-400 bg-gray-800 border-gray-600 hover:bg-gray-700"
                  }`}
                  key={sprint._id}
                  onMouseEnter={() =>
                    localStorage.setItem("idSprint", sprint._id)
                  }
                  onClick={onSprintClick}
                >
                  Sprint {sprint.numero}
                  {activo && " •"}
                </button>
              );
            })
          )}
        </div>

        <p className="text-sm text-gray-400">
          Fecha esperada de término: {fecha}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-600 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
            {porcentaje}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProyecto;
