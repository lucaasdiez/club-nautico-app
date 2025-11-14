import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

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
     
      const response = await api.post("/login", {
        username,
        password,
      });

      const { rol, nombre, token } = response.data;

      localStorage.setItem("token", token); // <-- ¡EL MÁS IMPORTANTE!
      localStorage.setItem("userName", nombre || "Socio");
      localStorage.setItem("userUsername", username);
      localStorage.setItem("userRole", rol?.toUpperCase());

      // 🔹 Redirección (esto sigue igual)
      if (rol?.toLowerCase() === "admin") {
        navigate("/admin");
      } else if (rol?.toLowerCase() === "socio") {
        navigate("/home");
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