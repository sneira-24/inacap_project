import { useState, useEffect } from 'react';

function TaskDetail({ tareaId, onVolver }) {
  const [tarea, setTarea] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [nuevoTexto, setNuevoTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Función para cargar o recargar los datos
  const cargarDetalles = async () => {
    if (!window.dbAPI || !tareaId) {
      setCargando(false);
      return;
    }

    try {
      const tareaDB = await window.dbAPI.findById("Tarea", tareaId, "asignado_a");
      setTarea(tareaDB);

      const comentariosDB = await window.dbAPI.getComentariosByTarea(tareaId);
      setComentarios(comentariosDB);
    } catch (error) {
      console.error("Error cargando los detalles de la tarea:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDetalles();
  }, [tareaId]);

  // Función para enviar el comentario a MongoDB
  const manejarEnviarComentario = async (e) => {
    e.preventDefault();
    if (!nuevoTexto.trim() || !window.dbAPI) return;

    setEnviando(true);

    try {
      const sesion = JSON.parse(localStorage.getItem("usuarioActivo")) || {};
      const emailUsuario = sesion.email;

      let usuarioId = null;

      if (emailUsuario) {
        const usuarios = await window.dbAPI.find("Usuario", { email: emailUsuario });
        if (usuarios.length > 0) {
          usuarioId = usuarios[0]._id;
        }
      }

      if (!usuarioId && tarea?.asignado_a?._id) {
        usuarioId = tarea.asignado_a._id;
      }

      const nuevoComentario = {
        tarea_id: tareaId,
        usuario_id: usuarioId,
        texto: nuevoTexto.trim(),
        fecha: new Date().toISOString()
      };

      await window.dbAPI.create("ComentarioTarea", nuevoComentario);

      setNuevoTexto("");
      await cargarDetalles();

    } catch (error) {
      console.error("Error al guardar el comentario:", error);
      alert("Hubo un error al intentar guardar el comentario en la base de datos.");
    } finally {
      setEnviando(false);
    }
  };

  if (cargando) {
    return <div className="text-gray-400 p-8 text-center bg-gray-900 min-h-screen">Cargando detalles de la tarea...</div>;
  }

  if (!tarea) {
    return (
      <div className="p-8 text-center bg-gray-900 min-h-screen">
        <p className="text-red-400 mb-4">No se pudo cargar la información de la tarea.</p>
        <button onClick={onVolver} className="bg-gray-700 text-white px-4 py-2 rounded">Volver</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen p-8 text-gray-200">
      {/* Botón Volver y Cabecera */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-700 pb-4">
        <button 
          onClick={onVolver}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded transition-colors font-medium cursor-pointer"
        >
          ← Volver
        </button>
        <h1 className="text-3xl font-bold text-white m-0">
          {tarea.titulo}
        </h1>
        <span className="ml-auto bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm font-semibold border border-gray-600 uppercase">
          {tarea.estado || 'TO DO'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Descripción y Comentarios */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Descripción</h2>
            <p className="text-gray-300 whitespace-pre-line leading-relaxed">
              {tarea.descripcion || "Sin descripción proporcionada."}
            </p>
          </div>

          {/* Sección de Comentarios Mejorada */}
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Comentarios</h2>
            
            {/* NUEVO: Formulario para agregar comentarios */}
            <form onSubmit={manejarEnviarComentario} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Escribe un comentario o actualización..."
                  className="flex-1 p-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                  value={nuevoTexto}
                  onChange={(e) => setNuevoTexto(e.target.value)}
                  disabled={enviando}
                />
                <button
                  type="submit"
                  disabled={enviando || !nuevoTexto.trim()}
                  className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  {enviando ? "..." : "Comentar"}
                </button>
              </div>
            </form>

            {/* Lista de Comentarios */}
            {comentarios.length === 0 ? (
              <p className="text-gray-500 italic">No hay comentarios en esta tarea aún.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {comentarios.map((comentario) => (
                  <div key={comentario._id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-blue-400">
                        {comentario.usuario_id?.nombre || "Usuario Actual"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(comentario.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">{comentario.texto}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Metadatos */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-md">
            <h2 className="text-xl font-semibold text-white mb-4">Detalles Técnicos</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-400">Asignado a:</span>
                <span className="font-medium text-white">{tarea.asignado_a?.nombre || "Sin asignar"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Prioridad:</span>
                <span className="font-medium text-red-400 uppercase">{tarea.prioridad || "Normal"}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-400">Story Points:</span>
                <span className="font-medium text-blue-400">{tarea.story_points || 0} pts</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TaskDetail;