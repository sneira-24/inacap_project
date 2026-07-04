import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const validarEmail = (correo) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const validarPassword = (password) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const correoLimpio = email.trim();
    const passwordLimpia = password.trim();

    if (!correoLimpio || !passwordLimpia) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    if (!validarEmail(correoLimpio)) {
      setError("Por favor, ingresa un correo válido.");
      return;
    }

    if (!correoLimpio.endsWith("@project.cl")) {
      setError("Acceso denegado: Utiliza tu correo corporativo (@project.cl).");
      return;
    }

    if (passwordLimpia.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    try {
      if (window.electronAPI) {
        const respuesta = await window.electronAPI.enviarLogin({
          email: correoLimpio,
          password: passwordLimpia,
        });

        if (respuesta.exito) {
          localStorage.setItem(
            "usuarioActivo",
            JSON.stringify({ email: correoLimpio }),
          );
          onLoginSuccess(correoLimpio);
        } else {
          setError("Credenciales incorrectas. Intenta nuevamente.");
          setPassword("");
        }
      } else {
        setTimeout(() => {
          localStorage.setItem(
            "usuarioActivo",
            JSON.stringify({ email: correoLimpio }),
          );
          onLoginSuccess(correoLimpio);
        }, 1000);
      }
    } catch (err) {
      console.error("Error al comunicarse con el servidor:", err);
      setError("Error de comunicación con el servidor. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[400px]">
        <h2 className="text-center text-gray-800 mb-2 text-2xl font-semibold">
          Ingreso a ProjectHub
        </h2>
        <p className="text-center text-gray-500 mb-8 text-sm">
          Inicia sesión para ver tus tareas
        </p>

        <form onSubmit={handleLogin} noValidate>
          {error && (
            <div
              className="text-red-600 font-bold mb-6"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Correo del Desarrollador
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:bg-gray-200 disabled:cursor-not-allowed"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="dev1@project.cl"
              disabled={isLoading}
              aria-invalid={error ? "true" : "false"}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold text-gray-700 text-sm"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 pr-[70px] border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:bg-gray-200 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
                aria-invalid={error ? "true" : "false"}
              />
              <button
                type="button"
                className="absolute right-2.5 bg-transparent border-none text-blue-500 text-sm font-semibold cursor-pointer p-0 hover:underline hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                disabled={isLoading}
                aria-label={
                  mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full p-3 mt-4 bg-blue-500 text-white border-none rounded-md text-base font-bold cursor-pointer transition-colors hover:not-disabled:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Verificando credenciales..." : "Entrar al Tablero"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
