import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Register() {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const MySwal = withReactContent(Swal);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!nombre || !apellido || !dni || !email || !password) {
      setError("Por favor, completá todos los campos.");
      return;
    }

    try {
      // 🔹 Ejemplo: acá podrías llamar al backend real
      // await axios.post("http://localhost:8080/api/register", { nombre, apellido, dni, email, password });

      // 🔹 Guarda nombre y datos en localStorage
      const fullName = `${nombre} ${apellido}`;
      localStorage.setItem("userName", fullName);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", "SOCIO");

      // 🔹 Alerta de éxito
      await MySwal.fire({
        title: "Registro exitoso 🎉",
        text: `Bienvenido/a, ${nombre}!`,
        icon: "success",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
      });

      navigate("/home");
    } catch (err) {
      console.error(err);
      setError("Hubo un problema con el registro. Intentá nuevamente.");
    }
  };

  return (
    <div className="register-page">
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="register-logo"
      />

      <form className="register-form" onSubmit={handleRegister}>
        <h1>Registro de Usuario</h1>

        <div className="form-fields">
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
        </div>

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
