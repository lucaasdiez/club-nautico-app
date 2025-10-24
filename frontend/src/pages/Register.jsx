import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    dni: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/socios/crear", form);

      if (response.status === 200) {
        Swal.fire({
          title: "✅ Registro exitoso",
          text: `El socio ${form.nombre} ${form.apellido} fue registrado correctamente.`,
          icon: "success",
          confirmButtonText: "Continuar",
        }).then(() => navigate("/home"));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || "Error al registrar el socio.");
    }
  };

  return (
    <div className="register-page">
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="register-logo"
      />

      <form className="register-form" onSubmit={handleSubmit}>
        <h1>Registrar Socio</h1>

        <input
          type="text"
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
        />
        <input
          type="text"
          name="dni"
          placeholder="DNI"
          value={form.dni}
          onChange={handleChange}
        />
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={form.apellido}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={handleChange}
        />

        <button type="submit">Registrar</button>

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
