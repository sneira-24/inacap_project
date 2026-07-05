import { useState } from "react";
import "./Kanban.css";

function Kanban({ id_proyecto }) {
  const [columns, setColumns] = useState({
    todo: {
      nombre: "To Do",
      items: [
        { id: "1", content: "test" },
        { id: "2", content: "test2" },
      ],
    },
    inProgress: {
      nombre: "In Progress",
      items: [{ id: "3", content: "test" }],
    },
    done: {
      nombre: "Done",
      items: [{ id: "5", content: id_proyecto }],
    },
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updatedColumns = { ...columns };

    updatedColumns[activeColumns].items.push({
      id: Date.now().toString(),
      content: newTask,
    });

    setColumns(updatedColumns);
    setNewTask("");
  };

  const removeTask = (columnID, taskID) => {
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

  const handleDrop = (e, columnID) => {
    e.preventDefault();

    if (!draggedItem) return;

    const { columnID: sourceColumnID, item } = draggedItem;

    if (sourceColumnID === columnID) return;

    const updatedColumns = { ...columns };

    updatedColumns[sourceColumnID].items = updatedColumns[
      sourceColumnID
    ].items.filter((i) => i.id !== item.id);

    updatedColumns[columnID].items.push(item);

    setColumns(updatedColumns);
    setDraggedItem(null);
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },
    inProgress: {
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
        className="p-6 w-full min-h-screen bg-gradient-to-b
            from-zinc-900 to-zinc-800 flex items-center justify-center"
      >
        <div className="flex items-center justify-center flex-col gap-4 w-full max-w-6xl">
          <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400  via-amber-500 to-rose-400">
            React Kanban Board
          </h1>
          <div className="mb-8 flex w-full max-w-lg shadow-lg rounded-lg overflow-hidden">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Agregar nueva tarea..."
              className="flex-grow p-3 bg-zinc-700 text-white"
              onKeyDown={(e) => e.key === "Enter" && addNewTask()}
            ></input>
            <select
              value={activeColumns}
              onChange={(e) => setActiveColumns(e.target.value)}
              className="p-3 bg-zinc-700 text-white border-0 border-l border-zinc-600"
            >
              {Object.keys(columns).map((columnId) => (
                <option value={columnId} key={columnId}>
                  {columns[columnId].nombre}
                </option>
              ))}
            </select>

            <button
              onClick={addNewTask}
              className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-500 transition-all duration-200 cursor-pointer"
            >
              Agregar
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-6 w-full">
            {Object.keys(columns).map((columnId) => (
              <div
                key={columnId}
                className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-x1 border-t-4 ${columnStyles[columnId.border]}`}
                onDragOver={(e) => handleDragOver(e, columnId)}
                onDrop={(e) => handleDrop(e, columnId)}
              >
                <div
                  className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
                >
                  {columns[columnId].nombre}
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
                          className="text-zinc-400 hover: text-red-400 transition-colors duration-400 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600"
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
