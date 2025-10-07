import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("SOCIO");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni || !email || !password) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    console.log({
      nombre,
      apellido,
      dni,
      email,
      password,
      rol,
    });

    // Simulación temporal
    alert(`✅ ${rol === "ADMIN" ? "Admin" : "Socio"} registrado: ${nombre} ${apellido}`);
    navigate("/"); // redirige al login
  };

  return (
    <div className="register-page">
      <form className="register-form" onSubmit={handleRegister}>
        <h1>Registro de Usuario</h1>

        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
        />

        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
        />

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

        <button type="submit">Registrarme</button>
        {error && <p className="error">{error}</p>}

        <p className="login-link">
          ¿Ya tenés cuenta?{" "}
          <span onClick={() => navigate("/")}>Iniciá sesión</span>
        </p>
      </form>
    </div>
  );
}

export default Register;
