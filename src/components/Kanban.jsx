import { useState } from "react";

function Kanban() {

    cosnt [columns, setColumns] = useState({
        todo:_{
            nombre: "To Do",
            items: [
                {id: "1", content: "test"},
                {id: "2", content: "test2"}
            ]
        },
        inProgress: {
            nombre: "In Progress",
            items: [
                {id: "3", content: "test"},
                {id: "4", content: "test2"}
            ]
        },
        done: {
            nombre: "Done",
            items: [
                {id: "5", content: "test"},
                {id: "6", content: "test2"}
            ]
        }
    })
} 