import "./AdminHome.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";

function AdminHome() {
  const MySwal = withReactContent(Swal);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    const welcomed = sessionStorage.getItem("adminWelcomed");
    if (!welcomed) {
      MySwal.fire({
        title: "Bienvenido al Panel Administrativo ⚙️",
        text: "Gestioná socios, disciplinas y pagos de forma rápida y clara.",
        icon: "info",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
        timer: 2800,
        showConfirmButton: false,
      });
      sessionStorage.setItem("adminWelcomed", "true");
    }
  }, []);

  return (
    <div className="admin-home">
      {/* ✅ Logo grande centrado arriba */}
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="admin-logo"
      />

      <main className="admin-main">
        <div className="admin-card">
          <h1>Panel de Administración</h1>
          <p>
            Desde este panel podés gestionar socios, disciplinas, pagos y la
            información institucional del Club Náutico.
          </p>

          <div className="admin-buttons">
            <button onClick={() => (window.location.href = "/socios")}>
              👥 Gestionar Socios
            </button>
            <button onClick={() => (window.location.href = "#")}>
              🏆 Disciplinas
            </button>
            <button onClick={() => (window.location.href = "#")}>
              💳 Control de Pagos
            </button>
            <button 
              onClick={() => (window.location.href = "/chatbot-analytics")}
              className="btn-analytics"
            >
              📊 Analytics del Chatbot
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
