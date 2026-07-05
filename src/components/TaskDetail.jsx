import { useState } from 'react';

// Datos locales iniciales
const tareaLocal = {
  id: "task_1",
  titulo: "Diseñar vistas del Login",
  descripcion: "Crear los componentes JSX y CSS para el acceso seguro de los desarrolladores. Validar formato de correo corporativo y longitud mínima de contraseña.",
  asignado_a: "dev1@project.cl",
  prioridad: "alta",
  story_points: 5,
  estado: "In Progress",
  comentarios: [
    { id: 1, usuario: "pm@project.cl", texto: "Asegúrate de incluir validaciones Regex para el correo.", fecha: "2026-07-02 10:00" },
    { id: 2, usuario: "dev1@project.cl", texto: "Listo, Regex añadido y botón de ver contraseña implementado.", fecha: "2026-07-02 11:30" }
  ],
  timeTracking: [
    { id: 1, usuario: "dev1@project.cl", horas: 2.5, descripcion: "Maquetación inicial HTML/CSS", fecha: "2026-07-01" },
    { id: 2, usuario: "dev1@project.cl", horas: 1.5, descripcion: "Lógica de validaciones y estados", fecha: "2026-07-02" }
  ],
  historial: [
    { id: 1, usuario: "pm@project.cl", accion: "cambió la prioridad de 'media' a 'alta'", fecha: "2026-07-01 09:00" },
    { id: 2, usuario: "dev1@project.cl", accion: "movió la tarea de 'To Do' a 'In Progress'", fecha: "2026-07-01 10:15" }
  ]
};

// 1. SOLUCIÓN AL ERROR DE PANTALLA EN BLANCO: Recibimos la prop onVolver
function TaskDetail({ onVolver }) {
  const [tarea, setTarea] = useState(tareaLocal);
  
  // Estados para la interactividad
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [horasInput, setHorasInput] = useState("");
  const [descTiempoInput, setDescTiempoInput] = useState("");

  // Funciones de Colores adaptadas al Modo Oscuro
  const obtenerColorEstado = (estado) => {
    switch(estado.toLowerCase()) {
      case 'in progress': return 'bg-blue-900/30 text-blue-400 border border-blue-800';
      case 'to do': return 'bg-gray-800 text-gray-400 border border-gray-600';
      case 'done': return 'bg-green-900/30 text-green-400 border border-green-800';
      default: return 'bg-gray-800 text-gray-400 border border-gray-600';
    }
  };

  const obtenerColorPrioridad = (prioridad) => {
    switch(prioridad.toLowerCase()) {
      case 'critica': return 'text-red-500';
      case 'alta': return 'text-orange-400';
      case 'media': return 'text-yellow-400';
      case 'baja': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  // Lógica para agregar un comentario nuevo
  const manejarAgregarComentario = () => {
    if (nuevoComentario.trim() === "") return;
    
    const nuevoObjComentario = {
      id: Date.now(),
      usuario: "dev1@project.cl", 
      texto: nuevoComentario,
      fecha: new Date().toLocaleString()
    };

    setTarea({
      ...tarea,
      comentarios: [...tarea.comentarios, nuevoObjComentario]
    });
    setNuevoComentario(""); 
  };

  // Lógica para guardar las horas en la ventana emergente
  const guardarRegistroTiempo = () => {
    if (!horasInput || !descTiempoInput) return alert("Completa ambos campos");

    const nuevoRegistro = {
      id: Date.now(),
      usuario: "dev1@project.cl",
      horas: parseFloat(horasInput),
      descripcion: descTiempoInput,
      fecha: new Date().toISOString().split('T')[0] 
    };

    setTarea({
      ...tarea,
      timeTracking: [...tarea.timeTracking, nuevoRegistro]
    });

    setHorasInput("");
    setDescTiempoInput("");
    setMostrarModal(false);
  };

  return (
    // 2. CAMBIO A MODO OSCURO: Fondo general bg-gray-900 y texto text-gray-200
    <div className="p-8 font-sans bg-gray-900 min-h-screen text-gray-200 relative">
      
      {/* Botón Volver - AHORA LLAMA A onVolver */}
      <button 
        onClick={onVolver}
        className="mb-6 text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 transition-colors"
      >
        ← Volver al Dashboard
      </button>

      {/* Ventana para Registrar Horas (Modal Oscuro) */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 border border-gray-700 p-6 rounded-lg shadow-2xl w-96 max-w-full">
            <h3 className="text-xl text-white font-bold mb-4 border-b border-gray-700 pb-2">Registrar Horas</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-300 mb-1">Cantidad de Horas</label>
              <input 
                type="number" 
                step="0.5"
                min="0"
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500"
                placeholder="Ej: 2.5"
                value={horasInput}
                onChange={(e) => setHorasInput(e.target.value)}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-300 mb-1">¿Qué hiciste?</label>
              <textarea 
                className="w-full p-2 border border-gray-600 bg-gray-700 text-white rounded focus:outline-none focus:border-blue-500 resize-none h-24"
                placeholder="Describe tu avance..."
                value={descTiempoInput}
                onChange={(e) => setDescTiempoInput(e.target.value)}
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500 transition-colors"
                onClick={guardarRegistroTiempo}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Principal */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-700 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="m-0 text-3xl font-bold text-white">{tarea.titulo}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${obtenerColorEstado(tarea.estado)}`}>
            {tarea.estado}
          </span>
        </div>
        <button 
          className="bg-green-600 hover:bg-green-500 text-white border border-green-700 py-2 px-5 rounded-md font-bold cursor-pointer transition-colors shadow-sm"
          onClick={() => setMostrarModal(true)}
        >
          + Agregar Entrada de Tiempo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Columna Izquierda: Detalles y Comentarios */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="mt-0 border-b border-gray-700 pb-2 mb-4 text-white text-xl font-semibold">Descripción General</h3>
            <p className="leading-relaxed text-gray-300 mb-6">{tarea.descripcion}</p>
            
            <div className="flex flex-col gap-3 bg-gray-900/50 p-4 rounded-md text-sm border border-gray-700">
              <div>
                <strong className="text-gray-400">Asignado a:</strong> <span className="ml-1 text-gray-200">{tarea.asignado_a}</span>
              </div>
              <div>
                <strong className="text-gray-400">Prioridad:</strong> 
                <span className={`ml-1 font-bold uppercase ${obtenerColorPrioridad(tarea.prioridad)}`}>
                  {tarea.prioridad}
                </span>
              </div>
              <div>
                <strong className="text-gray-400">Story Points:</strong> <span className="ml-1 text-gray-200">{tarea.story_points} pts</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md flex flex-col h-full">
            <h3 className="mt-0 border-b border-gray-700 pb-2 mb-4 text-white text-xl font-semibold">Comentarios</h3>
            
            <ul className="list-none p-0 m-0 flex-grow mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {tarea.comentarios.map(comentario => (
                <li key={comentario.id} className="bg-gray-900/50 border border-gray-700 p-4 rounded-md mb-4 last:mb-0">
                  <div className="flex justify-between mb-2 text-sm">
                    <strong className="text-gray-300">{comentario.usuario}</strong>
                    <span className="text-gray-500">{comentario.fecha}</span>
                  </div>
                  <p className="m-0 text-gray-300 text-sm">{comentario.texto}</p>
                </li>
              ))}
            </ul>

            {/* Caja para nuevo comentario */}
            <div className="mt-auto border-t border-gray-700 pt-4">
              <textarea 
                className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-md mb-2 focus:outline-none focus:border-blue-500 text-sm resize-none"
                rows="2"
                placeholder="Escribe un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
              ></textarea>
              <button 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors text-sm shadow-sm"
                onClick={manejarAgregarComentario}
              >
                Enviar Comentario
              </button>
            </div>
          </div>

        </div>

        {/* Columna Derecha: Tablas de Tiempo e Historial */}
        <div className="flex flex-col gap-8">
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md overflow-x-auto">
            <h3 className="mt-0 border-b border-gray-700 pb-2 mb-4 text-white text-xl font-semibold">Time Tracking</h3>
            <table className="w-full text-left border-collapse min-w-[400px]">
              <thead>
                <tr>
                  <th className="p-3 border-b border-gray-700 bg-gray-900/50 text-gray-400 text-sm">Usuario</th>
                  <th className="p-3 border-b border-gray-700 bg-gray-900/50 text-gray-400 text-sm">Fecha</th>
                  <th className="p-3 border-b border-gray-700 bg-gray-900/50 text-gray-400 text-sm">Horas</th>
                  <th className="p-3 border-b border-gray-700 bg-gray-900/50 text-gray-400 text-sm">Descripción</th>
                </tr>
              </thead>
              <tbody>
                {tarea.timeTracking.map(registro => (
                  <tr key={registro.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="p-3 border-b border-gray-700 text-sm text-gray-300">{registro.usuario.split('@')[0]}</td>
                    <td className="p-3 border-b border-gray-700 text-sm text-gray-400">{registro.fecha}</td>
                    <td className="p-3 border-b border-gray-700 text-sm text-green-400"><strong>{registro.horas}h</strong></td>
                    <td className="p-3 border-b border-gray-700 text-sm text-gray-300">{registro.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md">
            <h3 className="mt-0 border-b border-gray-700 pb-2 mb-4 text-white text-xl font-semibold">Historial de Cambios</h3>
            <ul className="list-none p-0 m-0">
              {tarea.historial.map(cambio => (
                <li key={cambio.id} className="flex gap-4 py-3 border-b border-dashed border-gray-700 text-sm last:border-0">
                  <span className="text-gray-500 font-mono whitespace-nowrap">{cambio.fecha.split(' ')[0]}</span>
                  <p className="m-0 text-gray-400"><strong className="text-gray-200">{cambio.usuario}</strong> {cambio.accion}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TaskDetail;