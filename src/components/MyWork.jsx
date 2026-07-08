import { useState, useEffect } from 'react';

function MyWork({ emailUsuario, onVerDetalle }) {
  const [misTareas, setMisTareas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Efecto que se ejecuta al cargar la pantalla
  useEffect(() => {
    async function cargarTareasBD() {
      if (!window.dbAPI) {
        console.error("El puente IPC no está conectado.");
        setCargando(false);
        return;
      }

      try {
        const usuarios = await window.dbAPI.find("Usuario", { email: emailUsuario });
        if (usuarios.length === 0) {
          setCargando(false);
          return;
        }
        
        const miUsuario = usuarios[0];
        const tareasDB = await window.dbAPI.getTareasByUsuario(miUsuario._id);
        
        setMisTareas(tareasDB || []);
      } catch (error) {
        console.error("Error de conexión:", error);
      } finally {
        setCargando(false);
      }
    }

    cargarTareasBD();
  }, [emailUsuario]);

  // Limpiar tareas viejas o terminadas
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normalizamos a las 00:00 para comparar solo el día

  const tareasActivas = misTareas.filter((tarea) => {
    // Filtrar tareas que ya están listas
    const estado = tarea.estado?.toLowerCase();
    if (estado === 'done' || estado === 'completado') return false;

    // Filtrar tareas de Sprints cuya fecha de fin ya pasó
    if (tarea.sprint_id && tarea.sprint_id.fecha_fin) {
      const fechaFinSprint = new Date(tarea.sprint_id.fecha_fin);
      fechaFinSprint.setHours(0, 0, 0, 0);
      
      if (fechaFinSprint < hoy) return false; // Si venció ayer o antes, no se muestra
    }

    return true;
  });

  // Agrupacion
  const pesosPrioridad = { "crítica": 1, "critica": 1, "alta": 2, "media": 3, "baja": 4 };

  // Agrupamos tareasActivas
  const tareasPorSprint = tareasActivas.reduce((grupos, tarea) => {
    const sprintId = tarea.sprint_id?._id || "backlog"; // Si no tiene sprint, va al backlog
    
    if (!grupos[sprintId]) {
      grupos[sprintId] = {
        sprint: tarea.sprint_id,
        tareas: []
      };
    }
    grupos[sprintId].tareas.push(tarea);
    return grupos;
  }, {});

  // Convertimos el objeto en un arreglo y ordenamos las tareas internamente por prioridad
  const sprintsAgrupados = Object.values(tareasPorSprint).map(grupo => {
    grupo.tareas.sort((a, b) => {
      const pesoA = pesosPrioridad[a.prioridad?.toLowerCase()] || 5;
      const pesoB = pesosPrioridad[b.prioridad?.toLowerCase()] || 5;
      return pesoA - pesoB; // Prioridad más crítica arriba
    });
    return grupo;
  });

  // Función formatear fechas a un formato amigable (DD/MM/YYYY)
  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return "--/--/----";
    return new Date(fechaISO).toLocaleDateString("es-CL");
  };

  // Funcion colores
  const colorEstado = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'done': 
      case 'completado': return 'bg-green-900/30 text-green-400 border border-green-800';
      case 'in_progress': return 'bg-blue-900/30 text-blue-400 border border-blue-800';
      case 'todo': return 'bg-gray-800 text-gray-400 border border-gray-600';
      default: return 'bg-gray-800 text-gray-400 border border-gray-600';
    }
  };

  const getColorPrioridad = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case "crítica": 
      case "critica": 
        return "text-red-500 font-bold";
      case "alta": 
        return "text-orange-500 font-semibold";
      case "media": 
        return "text-yellow-500 font-medium";
      case "baja": 
        return "text-gray-400";
      default: 
        return "text-gray-500";
    }
  };

  if (cargando) {
    return <div className="p-8 text-gray-400 flex justify-center">Conectando con la base de datos...</div>;
  }

  return (
    <div className="font-sans text-gray-200 w-full">
      {/* Cabecera */}
      <div className="mb-8 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white m-0">Mi Trabajo</h2>
        <p className="text-gray-400 mt-2 text-sm">
          Tus tareas agrupadas por Sprints y ordenadas por prioridad.
        </p>
      </div>

      <div className="space-y-8 w-full">
        {sprintsAgrupados.length === 0 ? (
          <div className="text-gray-500 bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center">
            No tienes tareas pendientes ni sprints activos asignados por el momento.
          </div>
        ) : (
          sprintsAgrupados.map((grupo, index) => (
            <div key={index} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              
              {/* Título del Sprint con Rango de Fechas usando los campos reales de la BD */}
              <div className="mb-4 pb-3 border-b border-gray-700/50 flex flex-col md:flex-row md:items-start justify-between gap-2">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    {grupo.sprint ? `Sprint N° ${grupo.sprint.numero || index + 1}` : "Backlog / Tareas sin Sprint"}
                  </h3>
                  {grupo.sprint?.objetivo && (
                    <p className="text-xs text-gray-400 italic mt-1">
                      Objetivo: {grupo.sprint.objetivo}
                    </p>
                  )}
                </div>
                {grupo.sprint && (
                  <span className="text-sm font-medium text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full whitespace-nowrap">
                    {formatearFecha(grupo.sprint.fecha_inicio)} — {formatearFecha(grupo.sprint.fecha_fin)}
                  </span>
                )}
              </div>

              {/* Lista de Tareas de este Sprint */}
              <div className="grid gap-3">
                {grupo.tareas.map((tarea) => (
                  <div 
                    key={tarea._id}
                    className="bg-gray-900/80 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                          {tarea.sprint_id?.proyecto_id?.nombre || "Proyecto Activo"}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colorEstado(tarea.estado)} uppercase`}>
                          {tarea.estado || 'todo'}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-semibold text-white m-0">
                        {tarea.titulo}
                      </h4>
                      
                      <div className="mt-1">
                        <span className={`uppercase text-xs tracking-wide ${getColorPrioridad(tarea.prioridad)}`}>
                          Prioridad: {tarea.prioridad || "Media"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <button 
                        onClick={() => onVerDetalle(tarea._id)}
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-1.5 px-4 rounded text-sm transition-colors shadow-sm"
                      >
                        Ver Detalle
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyWork;