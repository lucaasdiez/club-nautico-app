import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { getSocioByUsername } from "../services/sociosService.js";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    try {
      // 1. Hacer login y obtener el token
      const response = await api.post("/login", {
        username,
        password,
      });

      const { rol, mensaje, token } = response.data;

      // 2. ✅ GUARDAR EL TOKEN INMEDIATAMENTE (ANTES de cualquier otra llamada)
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", rol?.toUpperCase());
      localStorage.setItem("userUsername", username);

      // 3. ✅ Solo buscar datos adicionales si es SOCIO
      if (rol?.toLowerCase() === "socio") {
        const socioResponse = await getSocioByUsername(username);
        const { nroSocio, nombre, apellido } = socioResponse.data;
        
        localStorage.setItem("userName", `${nombre} ${apellido}`);
        localStorage.setItem("userNroSocio", nroSocio);
        
        navigate("/home");
      } else if (rol?.toLowerCase() === "admin") {
        // Para admin, solo guardamos el username como nombre
        localStorage.setItem("userName", username);
        navigate("/admin");
      } else {
        setError("Rol no reconocido. Contactá con soporte.");
      }
    } catch (err) {
      console.error("❌ Error al iniciar sesión:", err);
      if (err.response && err.response.data) {
        setError(err.response.data); 
      } else {
        setError("Usuario o contraseña incorrectos.");
      }
    }
  };

  return (
    <div className="login-page">
      {/* Logo institucional */}
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="login-logo"
      />

      <form className="login-form" onSubmit={handleLogin}>
        <h1>Portal del Socio</h1>

        <div className="form-fields">
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Ingresar</button>

        {error && <p className="error">{error}</p>}

        <p className="register-link">
          ¿No tenés cuenta?{" "}
          <span onClick={() => navigate("/register")}>Registrate</span>
        </p>
      </form>
    </div>
  );
}

export default Login;