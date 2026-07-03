import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskDetail from './components/TaskDetail';

function App() {
  const [vistaActual, setVistaActual] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuarioActivo');
    return sesionGuardada ? 'dashboard' : 'login';
  });

  const irAlDashboard = () => {
    setVistaActual('dashboard');
  };


  const irADetalleTarea = () => {
    setVistaActual('detalleTarea');
  };

  const manejarCerrarSesion = () => {
    localStorage.removeItem('usuarioActivo');
    setVistaActual('login');
  };

  return (
    <div className="app-container">
     {vistaActual === 'login' && (
        <Login onLoginSuccess={irAlDashboard} />
      )}

      {vistaActual === 'dashboard' && (
        <Dashboard onLogout={manejarCerrarSesion}
        onVerDetalle={irADetalleTarea} />
      )}

      {vistaActual === 'detalleTarea' && (
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
    </div>
  );
}

export default App;