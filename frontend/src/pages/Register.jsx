import "./Register.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Importamos nuestro 'api.js'
import api from "../services/api.js"; // (Ajustá la ruta si es necesario)

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

  // --- ¡AQUÍ ESTÁ LA FUNCIÓN CORREGIDA! ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiamos errores anteriores

    try {
      // --- CÓDIGO DE ÉXITO (TRY) ---
      const response = await api.post("/socios/crear", form);

      // Si llegamos aquí, el registro fue exitoso
      Swal.fire({
        title: "✅ Registro exitoso",
        text: `El socio ${form.nombre} ${form.apellido} fue registrado.`,
        icon: "success",
        confirmButtonText: "Ir a Iniciar Sesión",
      }).then(() => navigate("/")); // Lo mandamos al login para que ingrese

    } catch (err) {
      // --- CÓDIGO DE ERROR (CATCH) ---
      // ¡El manejo de error AHORA ESTÁ AQUÍ!
      console.error("❌ Error al registrar:", err);
      
      let errorMessage = "Error al registrar el socio. Intentá de nuevo.";

      if (err.response && err.response.data) {
        // Si la respuesta es un OBJETO y tiene 'message'
        if (typeof err.response.data === 'object' && err.response.data.message) {
          
          if (err.response.data.message.includes("violates unique constraint")) {
            errorMessage = "El nombre de usuario o DNI ya está registrado.";
          } else {
            errorMessage = err.response.data.message;
          }

        } 
        // Si la respuesta es un STRING simple
        else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      }
      
      setError(errorMessage); // <-- Seteamos el string de error
    }
  };

  return (
    <div className="register-page">
      {/* (Tu JSX no cambia, está perfecto) */}
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
          type_s="text"
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