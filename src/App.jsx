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

  const [idProyecto, setIdProyecto] = useState(() => {});

  const irAlDashboard = (email) => {
    setEmailUsuario(email);
    setVistaActual("dashboard");
  };

  const irADetalleTarea = () => {
    setVistaActual("detalleTarea");
  };

  const manejarCerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    setEmailUsuario("");
    setVistaActual("login");
  };

  const irAKanban = () => {
    setIdProyecto(localStorage.getItem("idProyecto"));
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
          onProjectClick={(idProyecto) => irAKanban(idProyecto)}
        />
      )}

      {vistaActual === "detalleTarea" && (
        <div>
          <div className="bg-gray-50 px-8 pt-4">
            <button
              onClick={irAlDashboard}
              className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-2"
            >
              Volver al Dashboard
            </button>
          </div>
          <TaskDetail />
        </div>
      )}

      {vistaActual === "kanban" && <Kanban id_proyecto={idProyecto} />}
    </div>
  );
}

export default App;
