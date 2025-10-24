import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      // 🔹 Llamada al backend con username en lugar de email
      const response = await axios.post("http://localhost:8080/api/login", {
        username,
        password,
      });

      const rol = response.data.rol?.toLowerCase();
      const nombre = response.data.nombre || "Socio"; // nombre del backend o genérico

      // 🔹 Guarda datos del usuario en localStorage
      localStorage.setItem("userName", nombre);
      localStorage.setItem("userUsername", username);
      localStorage.setItem("userRole", rol?.toUpperCase());

      // 🔹 Redirección según rol
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "socio") {
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
