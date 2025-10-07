import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.scss";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const currentPath = location.pathname;

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo">
            <img src="/logo.png" alt="Logo" />
            <div>
              <h3>Club Social</h3>
              <p>Portal del Socio</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div
            className="user-profile"
            onClick={() => navigate("/info")}
            style={{ cursor: "pointer" }}
          >
            <div className="avatar">JMS</div>
            <div className="user-data">
              <p className="name">Juan Manuel Semper</p>
              <p className="id">Socio #30802</p>
            </div>
          </div>
          <button className="logout-btn" onClick={() => setShowLogoutModal(true)}>
            ↩ Salir
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button
          className={currentPath === "/home" ? "active" : ""}
          onClick={() => navigate("/home")}
        >
          <i className="fa-regular fa-user"></i> Resumen
        </button>
        <button
          className={currentPath === "/pagos" ? "active" : ""}
          onClick={() => navigate("/pagos")}
        >
          <i className="fa-regular fa-credit-card"></i> Pagos
        </button>
        <button
          className={currentPath === "/disciplinas" ? "active" : ""}
          onClick={() => navigate("/disciplinas")}
        >
          <i className="fa-solid fa-trophy"></i> Disciplinas
        </button>
        <button
          className={currentPath === "/acceso" ? "active" : ""}
          onClick={() => navigate("/acceso")}
        >
          <i className="fa-solid fa-qrcode"></i> Acceso
        </button>
      </nav>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Seguro que querés cerrar sesión?</h3>
            <div className="buttons">
              <button onClick={() => setShowLogoutModal(false)} className="cancel">
                Cancelar
              </button>
              <button onClick={handleLogout} className="confirm">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
