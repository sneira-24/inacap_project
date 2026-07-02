import { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [vistaActual, setVistaActual] = useState(() => {
    const sesionGuardada = localStorage.getItem('usuarioActivo');
    return sesionGuardada ? 'dashboard' : 'login';
  });

  const irAlDashboard = () => {
    setVistaActual('dashboard');
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
        <Dashboard onLogout={manejarCerrarSesion} />
      )}
    </div>
  );
}

export default App;