import { useState } from 'react';
import Login from './components/Login';

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
        <div style={{ padding: '3rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
           <h2 style={{ color: '#333333' }}>Panel de Control: ProjectHub</h2>
           <p style={{ color: '#666666', marginTop: '1rem' }}>
             Módulo de Dashboard de Proyectos en construcción.
           </p>
           
           <button 
             onClick={manejarCerrarSesion}
             style={{ 
               marginTop: '2rem', 
               padding: '0.5rem 1rem', 
               cursor: 'pointer',
               backgroundColor: '#dc3545',
               color: 'white',
               border: 'none',
               borderRadius: '5px',
               fontWeight: 'bold'
             }}
           >
             Cerrar Sesión
           </button>
        </div>
      )}
    </div>
  );
}

export default App;