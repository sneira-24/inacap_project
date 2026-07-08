import { useEffect, useState } from "react";

const estados = {
  todo: "todo",
  in_progress: "in_progress",
  done: "done",
};

const column_labels = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

function groupTareasByEstado(tareas) {
  const columns = {
    // Creamos la estructura de las columnas del Kanban
    todo: { nombre: "To Do", items: [] },
    in_progress: { nombre: "In Progress", items: [] },
    done: { nombre: "Done", items: [] },
  };

  tareas.forEach((t) => {
    // Asignamos a su columna correspondiente segun su estado
    const estado = estados[t.estado] ? t.estado : "todo";
    columns[estado].items.push({
      id: t._id.toString(), //incluimos id
      content: t.titulo, // titulo
      story_points: t.story_points ?? 0, // y story points. Si no tiene story points se le asignan 0.
    });
  });

  return columns;
}

const getColumnPoints = (items) =>
  items.reduce((sum, item) => sum + (item.story_points || 0), 0); //Sumatoria de story points de columna en especifico

function Kanban({ id_sprint, onVolver, email }) {
  const [columns, setColumns] = useState({
    // Creamos el useState de las columnas para poder actualizarlas con el drag & drop
    todo: { nombre: "To Do", items: [] },
    in_progress: { nombre: "In Progress", items: [] },
    done: { nombre: "Done", items: [] },
  });
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newPrioridad, setNewPrioridad] = useState("media");
  const [newStoryPoints, setNewStoryPoints] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Cargamos las tareas desde la base de datos
    if (!id_sprint) return;
    setLoading(true);
    setError(null);

    window.dbAPI
      .getTareasBySprint(id_sprint)
      .then((tareas) => {
        setColumns(groupTareasByEstado(tareas)); // Asignamos a su columna correspondiente segun su estado
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar tareas:", err);
        setError(
          "No se pudieron cargar las tareas. Verifica la conexión a la base de datos.",
        );
        setLoading(false);
      });
  }, [id_sprint]);

  const addNewTask = async () => {
    // Funcion para agregar nueva tarea
    if (newTask.trim() === "") return;
    setError(null);

    try {
      const usuario = await window.dbAPI.findOne("Usuario", { email: email }); //Se  busca la id del usuario por medio del email heredado de App
      if (!usuario) throw new Error("Usuario no encontrado");
      const id_usuario = usuario._id;

      const created = await window.dbAPI.create("Tarea", {
        // Se crea la variable tarea con todos los parametros necesarios
        sprint_id: id_sprint,
        titulo: newTask,
        descripcion: "",
        asignado_a: id_usuario,
        estado: "todo",
        prioridad: newPrioridad,
        story_points: newStoryPoints ? Number(newStoryPoints) : 0,
      });

      const updatedColumns = { ...columns }; //Se crea la variable updatedColumns que reemplazara la columna anterior con la tarea agregada
      updatedColumns["todo"].items.push({
        id: created._id,
        content: created.titulo,
        story_points: created.story_points,
      });

      setColumns(updatedColumns);
      setNewTask("");
      setNewPrioridad("media");
      setNewStoryPoints("");
    } catch (err) {
      console.error("Error al crear tarea:", err);
      setError("No se pudo crear la tarea. Intenta de nuevo.");
    }
  };

  const removeTask = async (columnID, taskID) => {
    // Funcion para quitar tarea
    setError(null);
    try {
      await window.dbAPI.deleteById("Tarea", taskID);

      const updatedColumns = { ...columns }; //Se crea la variable updatedColumns que reemplazara la columna anterior con la tarea quitada
      updatedColumns[columnID].items = updatedColumns[columnID].items.filter(
        (item) => item.id !== taskID,
      );
      setColumns(updatedColumns);
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      setError("No se pudo eliminar la tarea. Intenta de nuevo.");
    }
  };

  // Funcion para guardar los datos del item siendo arrastrado
  const handleDragStart = (columnID, item) => {
    setDraggedItem({ columnID, item });
  };

  // Prevenimos la actualizacion de pagina
  const handleDragOver = (e, column_id) => {
    e.preventDefault();
  };

  // Funcion para dropear el item
  const handleDrop = async (e, columnID) => {
    e.preventDefault();
    if (!draggedItem) return;
    setError(null);

    const { columnID: sourceColumnID, item } = draggedItem;
    if (sourceColumnID === columnID) return; // Si el item es dropeado en su columna original no se hace nada

    // Primero intentamos hacer el cambio en la base de datos
    try {
      await window.dbAPI.updateById("Tarea", item.id, { estado: columnID });

      const usuario = await window.dbAPI.findOne("Usuario", { email: email });
      if (!usuario) throw new Error("Usuario no encontrado");
      const id_usuario = usuario._id;

      await window.dbAPI.create("CambioTarea", {
        tarea_id: item.id,
        campo: "estado",
        valor_anterior: sourceColumnID,
        valor_nuevo: columnID,
        usuario_id: id_usuario,
        fecha: new Date().toISOString(),
      });

      const updatedColumns = { ...columns }; // Se actualiza la columna de origen quitando la tarea movida
      updatedColumns[sourceColumnID].items = updatedColumns[
        sourceColumnID
      ].items.filter((i) => i.id !== item.id);
      updatedColumns[columnID].items.push(item); // Se agrega a la columna destino la tarea movida

      setColumns(updatedColumns);
    } catch (err) {
      console.error("Error al mover tarea:", err);
      setError(
        "No se pudo mover la tarea. La tarjeta permanece en su estado original.",
      );
    } finally {
      setDraggedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-gray-900 flex items-center justify-center text-gray-300">
        Cargando tareas...
      </div>
    );
  }

  const columnStyles = {
    todo: {
      header: "bg-blue-600",
      dot: "bg-blue-500",
    },
    in_progress: {
      header: "bg-amber-600",
      dot: "bg-amber-500",
    },
    done: {
      header: "bg-emerald-600",
      dot: "bg-emerald-500",
    },
  };

  return (
    <div className="p-6 w-full min-h-screen bg-gray-900 flex flex-col items-center">
      <button
        onClick={onVolver}
        className="mb-6 self-start text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 transition-colors"
      >
        ← Volver al Dashboard
      </button>

      {error && (
        <div className="mb-4 w-full max-w-2xl bg-red-900/40 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-amber-500 to-emerald-500">
          Tablero Kanban
        </h1>

        <div className="mb-8 flex w-full max-w-2xl rounded-2xl overflow-hidden border border-gray-700 shadow-md">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Agregar nueva tarea..."
            className="grow min-w-0 p-3 bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />
          <select
            value={newPrioridad}
            onChange={(e) => setNewPrioridad(e.target.value)}
            className="p-3 bg-gray-800 text-gray-200 border-l border-gray-700 focus:outline-none"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          <select
            value={newStoryPoints}
            onChange={(e) => setNewStoryPoints(e.target.value)}
            className="p-3 bg-gray-800 text-gray-200 border-l border-gray-700 focus:outline-none"
          >
            <option value="">Story Pts</option>
            {Array.from({ length: 11 }, (_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
          <button
            onClick={addNewTask}
            className="px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors cursor-pointer whitespace-nowrap"
          >
            Agregar
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center">
          {Object.keys(columns).map((columnId) => (
            <div
              key={columnId}
              className="shrink-0 w-80 bg-gray-800 rounded-2xl shadow-md border border-gray-700"
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div className="p-4 rounded-t-2xl border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${columnStyles[columnId].dot}`}
                    />
                    <h3 className="text-gray-200 font-semibold text-lg">
                      {column_labels[columnId]}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
                      {columns[columnId].items.length} tareas
                    </span>
                    <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
                      {getColumnPoints(columns[columnId].items)} pts
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 min-h-64">
                {columns[columnId].items.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 italic text-sm">
                    Arrastra las tareas aquí
                  </div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 mb-3 bg-gray-700 text-gray-200 rounded-xl shadow-sm border border-gray-600 cursor-move flex items-center justify-between transition-colors duration-150 hover:bg-gray-650 hover:border-gray-500"
                      draggable
                      onDragStart={() => handleDragStart(columnId, item)}
                    >
                      <span className="mr-2">{item.content}</span>
                      <button
                        onClick={() => removeTask(columnId, item.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-600"
                      >
                        <span className="text-lg cursor-pointer">x</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Kanban;
