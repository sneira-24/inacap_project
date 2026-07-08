import { useState, useEffect } from 'react';

function MyWork({ emailUsuario, onVerDetalle }) {
  const [misTareas, setMisTareas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Efecto que se ejecuta al cargar la pantalla
  useEffect(() => {
    async function cargarTareasBD() {
      // Si por algún motivo no existe la API (ej. corriendo en navegador normal), salimos
      if (!window.dbAPI) {
        console.error("El puente IPC (dbAPI) no está conectado.");
        setCargando(false);
        return;
      }

      try {
        // 1. Buscamos el usuario completo en la BD usando el email de tu estado App.jsx
        const usuarios = await window.dbAPI.find("Usuario", { email: emailUsuario });
        
        if (usuarios.length === 0) {
          console.warn("No se encontró ningún usuario con ese correo en MongoDB.");
          setCargando(false);
          return;
        }
        
        const miUsuario = usuarios[0];

        // 2. Usamos la función nativa de Sebastián para traer las tareas del usuario
        const tareasDB = await window.dbAPI.getTareasByUsuario(miUsuario._id);
        
        // Guardamos los datos reales en el estado
        setMisTareas(tareasDB);

      } catch (error) {
        console.error("Error de conexión con la BD:", error);
      } finally {
        setCargando(false); // Apagamos el mensaje de carga
      }
    }

    cargarTareasBD();
  }, [emailUsuario]);

  // Función de colores adaptada a los estados reales de la BD ("todo", "in_progress", etc.)
  const colorEstado = (estado) => {
    switch(estado?.toLowerCase()) {
      case 'done': 
      case 'completado': return 'bg-green-900/30 text-green-400 border border-green-800';
      case 'in_progress': return 'bg-blue-900/30 text-blue-400 border border-blue-800';
      case 'todo': return 'bg-gray-800 text-gray-400 border border-gray-600';
      default: return 'bg-gray-800 text-gray-400 border border-gray-600';
    }
  };

  // Pantalla de carga mientras React y Mongo conversan
  if (cargando) {
    return <div className="p-8 text-gray-400 flex justify-center">Conectando con la base de datos...</div>;
  }

  const getColorPrioridad = (prioridad) => {
    switch (prioridad?.toLowerCase()) {
      case "crítica": return "text-red-500 font-bold";
      case "alta": return "text-orange-500 font-semibold";
      case "media": return "text-yellow-500 font-medium";
      case "baja": return "text-gray-400";
      default: return "text-gray-500";
    }
  };

  return (
    <div className="font-sans text-gray-200 w-full">
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white m-0">Mi Trabajo</h2>
        <p className="text-gray-400 mt-2 text-sm">
          Revisa las tareas que tienes asignadas en la base de datos.
        </p>
      </div>

      <div className="grid gap-4 w-full">
        {misTareas.length === 0 ? (
          <div className="text-gray-500 bg-gray-900/50 p-6 rounded-lg border border-gray-700 text-center">
            No tienes tareas asignadas por el momento.
          </div>
        ) : (
          misTareas.map((tarea) => (
            <div 
              key={tarea._id} // Ahora usamos el _id de Mongo
              className="bg-gray-900/50 border border-gray-700 rounded-lg p-5 hover:bg-gray-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                    {/* Leemos el nombre del proyecto que Sebastián nos mandó popularizado */}
                    {tarea.sprint_id?.proyecto_id?.nombre || "Proyecto sin nombre"}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorEstado(tarea.estado)}`}>
                    {tarea.estado || 'todo'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white m-0">
                  {tarea.titulo}
                </h3>
                <span className={`uppercase text-sm ${getColorPrioridad(tarea.prioridad)}`}>
                  Prioridad: {tarea.prioridad}
                </span>
              </div>

              <div>
                <button 
                  onClick={() => onVerDetalle(tarea._id)} // Enviamos el _id de Mongo al TaskDetail
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyWork;