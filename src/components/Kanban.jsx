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
      raw: t, // keep full task doc around in case you need prioridad, asignado_a, etc later
    });
  });

  return columns;
}

function Kanban({ id_sprint, onVolver }) {
  const [columns, setColumns] = useState({
    todo: { nombre: "To Do", items: [] },
    in_progress: { nombre: "In Progress", items: [] },
    done: { nombre: "Done", items: [] },
  });
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState("todo");
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

    const created = await window.dbAPI.create("Tarea", {
      sprint_id: id_sprint,
      titulo: newTask,
      estado: activeColumns,
    });

    const updatedColumns = { ...columns };

    updatedColumns[activeColumns].items.push({
      id: created._id,
      content: created.titulo,
    });

    setColumns(updatedColumns);
    setNewTask("");
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

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, columnID) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnID: sourceColumnID, item } = draggedItem;
    if (sourceColumnID === columnID) return;

    await window.dbAPI.updateById("Tarea", item.id, { estado: columnID });

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
    <>
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
          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Agregar nueva tarea..."
              className="grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
            ></input>
            <select
              value={activeColumns}
              onChange={(e) => setActiveColumns(e.target.value)}
              className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600"
            >
              {Object.keys(columns).map((columnId) => (
                <option value={columnId} key={columnId}>
                  {column_labels[columnId]}
                </option>
              ))}
            </select>

            <button
              onClick={addNewTask}
              className="px-6 bg-linear-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 cursor-pointer"
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
                  className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
                >
                  {column_labels[columnId]}
                  <span className="ml-2 px-2 py-1 ">
                    {columns[columnId].items.length}
                  </span>
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
    </>
  );
}

export default Kanban;
