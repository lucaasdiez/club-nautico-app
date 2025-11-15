import "./Navbar.scss";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";
import { useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔹 Alerta de bienvenida solo una vez por sesión

  // 🔹 Mostrar alerta de bienvenida solo una vez por sesión
  useEffect(() => {
    const hasWelcomed = localStorage.getItem("hasWelcomed");
    const currentPath = location.pathname;

    if (!hasWelcomed && currentPath === "/home") {
      const nombre = localStorage.getItem("userName");
      const saludo = nombre
        ? `¡Hola, ${nombre.split(" ")[0]} 👋!`
        : "¡Hola 👋!";

      MySwal.fire({
        title: saludo,
        text: "Bienvenido/a al Portal del Socio.",
        icon: "success",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
        timer: 2500,
        showConfirmButton: false,
      });

      localStorage.setItem("hasWelcomed", "true");
    }
  }, [location.pathname]);

  // 🔹 Cerrar sesión con confirmación
  const handleLogout = async () => {
    const result = await MySwal.fire({
      title: "¿Deseás cerrar sesión?",
      text: "Podrás volver a ingresar cuando quieras.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#1e3a8a",
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      background: "#f8f9fb",
      color: "#333",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await MySwal.fire({
        title: "Sesión cerrada",
        text: "¡Hasta pronto!",
        icon: "success",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
        timer: 1800,
        showConfirmButton: false,
      });

      // 🔹 Limpia datos de sesión
      localStorage.removeItem("hasWelcomed");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userName");

      navigate("/");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/home")}>
          <img src="/logo-png-redondo-297x300.png" alt="Logo" />
          <span>Club Náutico</span>
        </div>

        <ul className="navbar-links">
          <li onClick={() => navigate("/home")}>Inicio</li>
          <li onClick={() => navigate("/perfil")}>Mi Perfil</li>
          <li onClick={() => navigate("/disciplinas")}>Disciplinas</li>
          <li onClick={() => navigate("/pagos")}>Pagos</li>
          <li onClick={() => navigate("/acceso")}>Acceso</li>
          <li onClick={() => navigate("/certificados")}>Certificados</li>
          <li className="logout" onClick={handleLogout}>
            Cerrar sesión
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
