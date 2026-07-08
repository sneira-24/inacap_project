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
    todo: { nombre: "To Do", items: [] },
    in_progress: { nombre: "In Progress", items: [] },
    done: { nombre: "Done", items: [] },
  };

  tareas.forEach((t) => {
    const estado = estados[t.estado] ? t.estado : "todo";
    columns[estado].items.push({
      id: t._id.toString(),
      content: t.titulo,
      story_points: t.story_points ?? 0,
    });
  });

  return columns;
}

const getColumnPoints = (items) =>
  items.reduce((sum, item) => sum + (item.story_points || 0), 0);

function Kanban({ id_sprint, onVolver, email }) {
  const [columns, setColumns] = useState({
    todo: { nombre: "To Do", items: [] },
    in_progress: { nombre: "In Progress", items: [] },
    done: { nombre: "Done", items: [] },
  });
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [newPrioridad, setNewPrioridad] = useState("media");
  const [newStoryPoints, setNewStoryPoints] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (!id_sprint) return;
    setLoading(true);
    window.dbAPI.getTareasBySprint(id_sprint).then((tareas) => {
      setColumns(groupTareasByEstado(tareas));
      setLoading(false);
    });
  }, [id_sprint]);

  const addNewTask = async () => {
    if (newTask.trim() === "") return;

    const usuario = await window.dbAPI.findOne("Usuario", { email: email });
    const id_usuario = usuario._id;

    const created = await window.dbAPI.create("Tarea", {
      sprint_id: id_sprint,
      titulo: newTask,
      descripcion: "",
      asignado_a: id_usuario,
      estado: "todo",
      prioridad: newPrioridad,
      story_points: newStoryPoints ? Number(newStoryPoints) : 0,
    });

    const updatedColumns = { ...columns };

    updatedColumns["todo"].items.push({
      id: created._id,
      content: created.titulo,
      story_points: created.story_points,
    });

    setColumns(updatedColumns);
    setNewTask("");
    setNewPrioridad("media");
    setNewStoryPoints("");
  };

  const removeTask = async (columnID, taskID) => {
    await window.dbAPI.deleteById("Tarea", taskID);
    const updatedColumns = { ...columns };

    updatedColumns[columnID].items = updatedColumns[columnID].items.filter(
      (item) => item.id !== taskID,
    );

    setColumns(updatedColumns);
  };

  const handleDragStart = (columnID, item) => {
    setDraggedItem({ columnID, item });
  };

  const handleDragOver = (e, column_id) => {
    e.preventDefault();
  };

  const handleDrop = async (e, columnID) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnID: sourceColumnID, item } = draggedItem;
    if (sourceColumnID === columnID) return;

    await window.dbAPI.updateById("Tarea", item.id, { estado: columnID });
    const usuario = await window.dbAPI.findOne("Usuario", { email: email });
    const id_usuario = usuario._id;

    await window.dbAPI.create("CambioTarea", {
      tarea_id: item.id,
      campo: "estado",
      valor_anterior: sourceColumnID,
      valor_nuevo: columnID,
      usuario_id: id_usuario,
      fecha: new Date().toISOString(),
    });

    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnID].items = updatedColumns[
      sourceColumnID
    ].items.filter((i) => i.id !== item.id);

    updatedColumns[columnID].items.push(item);

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="p-6 w-full min-h-screen bg-linear-to-b from-zinc-900 to-zinc-800 flex items-center justify-center text-white">
        Cargando tareas...
      </div>
    );
  }

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },
    in_progress: {
      header: "bg-gradient-to-r from-yellow-600 to-yellow-400",
      border: "border-yellow-400",
    },
    done: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400",
    },
  };

  return (
    <div
      className="p-6 w-full min-h-screen bg-linear-to-b
      from-zinc-900 to-zinc-800 flex flex-col items-center"
    >
      <button
        onClick={onVolver}
        className="mb-6 self-start text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2 transition-colors"
      >
        ← Volver al Dashboard
      </button>
      <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-yellow-400  via-amber-500 to-rose-400">
          React Kanban Board
        </h1>
        <div className="mb-8 flex w-full max-w-2xl shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Agregar nueva tarea..."
            className="grow min-w-0 p-3 bg-zinc-700 text-white placeholder-zinc-400 focus:outline-none"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />
          <select
            value={newPrioridad}
            onChange={(e) => setNewPrioridad(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-l border-zinc-600 focus:outline-none"
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
            <option value="critica">Crítica</option>
          </select>
          <select
            value={newStoryPoints}
            onChange={(e) => setNewStoryPoints(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-l border-zinc-600 focus:outline-none"
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
            className="px-6 bg-linear-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            Agregar
          </button>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center">
          {Object.keys(columns).map((columnId) => (
            <div
              key={columnId}
              className={`shrink-0 w-80 bg-zinc-800 rounded-lg shadow-x1 border-t-4 ${columnStyles[columnId].border}`}
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div
                className={`p-4 rounded-t-md ${columnStyles[columnId].header}`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-bold text-xl">
                    {column_labels[columnId]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="bg-black/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {columns[columnId].items.length} tareas
                    </span>
                    <span className="bg-black/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {getColumnPoints(columns[columnId].items)} pts
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-3 min-h-64">
                {columns[columnId].items.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 italic text-sm ">
                    Arrastra las tareas aquí
                  </div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex item-center justify-between transform transition-all duration-200 hover:scale-105 hover-shadow-lg"
                      draggable
                      onDragStart={() => handleDragStart(columnId, item)}
                    >
                      <span className="mr-2">{item.content}</span>
                      <button
                        onClick={() => removeTask(columnId, item.id)}
                        className="text-zinc-400 hover:text-red-400 transition-colors duration-400 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600"
                      >
                        <span className="text-lg  cursor-pointer">x</span>
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
