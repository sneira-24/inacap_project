import { useState } from 'react';

function MyWork({ onVerDetalle }) {
  // Datos simulados locales
  const [misTareas] = useState([
    { 
      id: 1, 
      titulo: "Crear componente de Login con validación", 
      proyecto: "Project A", 
      estado: "Completado", 
      prioridad: "Alta", 
      fechaEntrega: "03/07/2026" 
    },
    { 
      id: 2, 
      titulo: "Integrar API de Festivos (Boostr.cl)", 
      proyecto: "Project A", 
      estado: "En Progreso", 
      prioridad: "Media", 
      fechaEntrega: "08/07/2026" 
    },
    { 
      id: 3, 
      titulo: "Diseñar pantalla 'Mi Trabajo'", 
      proyecto: "Project B", 
      estado: "Pendiente", 
      prioridad: "Baja", 
      fechaEntrega: "12/07/2026" 
    }
  ]);

  // Función auxiliar adaptada para modo oscuro
  const colorEstado = (estado) => {
    switch(estado) {
      case 'Completado': return 'bg-green-900/30 text-green-400 border border-green-800';
      case 'En Progreso': return 'bg-blue-900/30 text-blue-400 border border-blue-800';
      case 'Pendiente': return 'bg-gray-800 text-gray-400 border border-gray-600';
      default: return 'bg-gray-800 text-gray-400 border border-gray-600';
    }
  };

  return (
    // Contenedor transparente que hereda el ancho del Dashboard
    <div className="font-sans text-gray-200 w-full">
      
      {/* Header */}
      <div className="mb-6 border-b border-gray-700 pb-4">
        <h2 className="text-2xl font-bold text-white m-0">Mi Trabajo</h2>
        <p className="text-gray-400 mt-2 text-sm">
          Revisa las tareas que tienes asignadas para esta semana.
        </p>
      </div>

      {/* Lista de Tareas (Tarjetas) */}
      <div className="grid gap-4 w-full">
        {misTareas.map((tarea) => (
          <div 
            key={tarea.id} 
            className="bg-gray-900/50 border border-gray-700 rounded-lg p-5 hover:bg-gray-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Información de la tarea */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  {tarea.proyecto}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colorEstado(tarea.estado)}`}>
                  {tarea.estado}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white m-0">
                {tarea.titulo}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Vence el: <span className="font-medium text-gray-300">{tarea.fechaEntrega}</span> | Prioridad: {tarea.prioridad}
              </p>
            </div>

            {/* Botón para abrir tu TaskDetail */}
            <div>
              <button 
                onClick={() => onVerDetalle(tarea.id)}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
              >
                Ver Detalle
              </button>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default MyWork;