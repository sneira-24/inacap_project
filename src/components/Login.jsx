import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const validarEmail = (correo) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
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

    if (!email.endsWith("@project.cl")) {
      setError("Acceso denegado: Utiliza tu correo corporativo (@project.cl).");
      return;
    }

    setIsLoading(true);

    try {
      if (window.dbAPI?.validarLogin) {
        // Llamamos al nuevo puente seguro
        const respuesta = await window.dbAPI.validarLogin(
          correoLimpio,
          passwordLimpia,
        );

        if (respuesta.exito) {
          // Éxito: Guardamos la sesión y avanzamos
          localStorage.setItem(
            "usuarioActivo",
            JSON.stringify({
              email: respuesta.usuario.email,
              nombre: respuesta.usuario.nombre,
            }),
          );
          onLoginSuccess(respuesta.usuario.email);
        } else {
          // Fallo: Mostramos el error que nos mandó el backend
          setError(respuesta.mensaje);
          setPassword("");
        }
      } else {
        setError(
          "Error del sistema: La API de base de datos no está disponible.",
        );
      }
    } catch (err) {
      console.error("Error al comunicarse con el servidor:", err);
      setError("Error de comunicación con el servidor. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-md border border-gray-700 w-full max-w-100">
        <h2 className="text-center text-gray-200 mb-2 text-2xl font-semibold">
          Ingreso a ProjectHub
        </h2>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Inicia sesión para ver tus tareas
        </p>

        <form onSubmit={handleLogin} noValidate>
          {error && (
            <div
              className="text-red-400 font-bold mb-6"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 font-semibold text-gray-300 text-sm"
            >
              Correo del Desarrollador
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 placeholder-gray-500 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:bg-gray-800 disabled:cursor-not-allowed"
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
              className="block mb-2 font-semibold text-gray-300 text-sm"
            >
              Contraseña
            </label>
            <div className="relative flex items-center">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                className="w-full p-3 pr-17.5 bg-gray-700 border border-gray-600 rounded-md text-base text-gray-200 placeholder-gray-500 transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/25 disabled:bg-gray-800 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                disabled={isLoading}
                aria-invalid={error ? "true" : "false"}
              />
              <button
                type="button"
                className="absolute right-2.5 bg-transparent border-none text-blue-400 text-sm font-semibold cursor-pointer p-0 hover:underline hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed"
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
            className="w-full p-3 mt-4 bg-blue-600 text-white border-none rounded-md text-base font-bold cursor-pointer transition-colors hover:not-disabled:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed"
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
