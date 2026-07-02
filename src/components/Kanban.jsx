import { useState } from "react";
import "./Kanban.css";

function Kanban() {
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
      items: [{ id: "5", content: "test" }],
    },
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumns, setActiveColumns] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updatedColumns = { ...columns };

    updatedColumns[activeColumns].items.push({
      id: Date.now.toString(),
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
            from-zinc-900 to-zing-800 flex items-center justify-center"
      ></div>
      <div></div>
    </>
  );
}

export default Kanban;
