import { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const correoLimpio = email.trim();
    const passwordLimpia = password.trim();

    if (!correoLimpio || !passwordLimpia) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (!validarEmail(correoLimpio)) {
      setError('Por favor, ingresa un correo válido.');
      return;
    }

    if (!correoLimpio.endsWith('@project.cl')) {
      setError('Acceso denegado: Utiliza tu correo corporativo (@project.cl).');
      return;
    }

    if (passwordLimpia.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      if (window.electronAPI) {
        const respuesta = await window.electronAPI.enviarLogin({ 
          email: correoLimpio, 
          password: passwordLimpia 
        });

        if (respuesta.exito) {
          localStorage.setItem('usuarioActivo', JSON.stringify({ email: correoLimpio }));
          onLoginSuccess();
        } else {
          setError('Credenciales incorrectas. Intenta nuevamente.');
          setPassword(''); 
        }
      } else {
        setTimeout(() => {
          localStorage.setItem('usuarioActivo', JSON.stringify({ email: correoLimpio }));
          onLoginSuccess();
        }, 1000);
      }
    } catch (err) {
        console.error('Error al comunicarse con el servidor:', err);
      setError('Error de comunicación con el servidor. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Ingreso a ProjectHub</h2>
        <p>Inicia sesión para ver tus tareas</p>

        <form onSubmit={handleLogin} noValidate>
          {error && (
            <div className="error-message" role="alert" aria-live="assertive" style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Correo del Desarrollador</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev1@project.cl"
              disabled={isLoading}
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          <div className="form-group password-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <div className="password-input-wrapper">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
                aria-invalid={error ? "true" : "false"}
              />
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                disabled={isLoading}
                aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? 'Verificando credenciales...' : 'Entrar al Tablero'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;