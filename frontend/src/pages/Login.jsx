import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    try {
      // 🔹 Llamada al backend
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      // 🔹 Ejemplo de respuesta esperada:
      // { "rol": "ADMIN", "mensaje": "Login exitoso" }
      const rol = response.data.rol?.toLowerCase();

      if (rol === "admin") {
        localStorage.setItem("userRole", "ADMIN");
        localStorage.setItem("userEmail", email);
        navigate("/admin");
      } else if (rol === "socio") {
        localStorage.setItem("userRole", "SOCIO");
        localStorage.setItem("userEmail", email);
        navigate("/home"); // ✅ corregido: antes era "/socio"
      } else {
        setError("Rol no reconocido. Contactá con soporte.");
      }
    } catch (err) {
      console.error(err);
      setError("Email o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Iniciar Sesión</h1>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
