import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import TaskDetail from "./components/TaskDetail";
import Kanban from "./components/Kanban";

function App() {
  const [vistaActual, setVistaActual] = useState(() => {
    const sesionGuardada = localStorage.getItem("usuarioActivo");
    return sesionGuardada ? "dashboard" : "login";
  });

  const [emailUsuario, setEmailUsuario] = useState(() => {
    const sesionGuardada = localStorage.getItem("usuarioActivo");
    return sesionGuardada ? JSON.parse(sesionGuardada).email : "";
  });

  const [selectedSprintId, setSelectedSprintId] = useState(null);

  const [idTareaSeleccionada, setIdTareaSeleccionada] = useState(null);

  const irAlDashboard = (dato) => {
    if (typeof dato === "string") {
      setEmailUsuario(dato);
    }
    setVistaActual("dashboard");
  };

  const irADetalleTarea = (id) => {
    setIdTareaSeleccionada(id);
    setVistaActual("detalleTarea");
  };

  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setEmailUsuario("");
    setVistaActual("login");
  };

  const irAKanban = () => {
    setVistaActual("kanban");
  };

  return (
    <div className="app-container">
      {vistaActual === "login" && <Login onLoginSuccess={irAlDashboard} />}

      {vistaActual === "dashboard" && (
        <Dashboard
          onLogout={manejarCerrarSesion}
          onVerDetalle={irADetalleTarea}
          email={emailUsuario}
          onSprintClick={irAKanban}
          onSprintHover={setSelectedSprintId}
        />
      )}

      {vistaActual === "detalleTarea" && (
        <TaskDetail tareaId={idTareaSeleccionada} onVolver={irAlDashboard} />
      )}

      {vistaActual === "kanban" && (
        <Kanban
          id_sprint={selectedSprintId}
          onVolver={irAlDashboard}
          email={emailUsuario}
        />
      )}
    </div>
  );
}

export default App;
