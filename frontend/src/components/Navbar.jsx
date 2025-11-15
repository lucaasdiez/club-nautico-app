import "./Navbar.scss";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const MySwal = withReactContent(Swal);
  const [menuOpen, setMenuOpen] = useState(false);

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

        {/* BOTÓN HAMBURGUESA */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* LINKS */}
        <ul className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <li onClick={() => { navigate("/home"); setMenuOpen(false); }}>Inicio</li>
          <li onClick={() => { navigate("/perfil"); setMenuOpen(false); }}>Mi Perfil</li>
          <li onClick={() => { navigate("/disciplinas"); setMenuOpen(false); }}>Disciplinas</li>
          <li onClick={() => { navigate("/pagos"); setMenuOpen(false); }}>Pagos</li>
          <li onClick={() => { navigate("/acceso"); setMenuOpen(false); }}>Acceso</li>
          <li onClick={() => { navigate("/certificados"); setMenuOpen(false); }}>Certificados</li>
          <li className="logout" onClick={() => { handleLogout(); setMenuOpen(false); }}>
            Cerrar sesión
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
