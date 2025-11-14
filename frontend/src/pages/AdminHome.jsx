import "./AdminHome.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { Users, Trophy, CreditCard, BarChart3, LogOut, Settings } from "lucide-react";

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
        title: "Bienvenido al Panel Administrativo",
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
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="admin-logo"
      />

      <main className="admin-main">
        <div className="admin-card">
          <div className="admin-header">
            <Settings className="header-icon" size={32} />
            <h1>Panel de Administración</h1>
          </div>
          <p>
            Desde este panel podés gestionar socios, disciplinas, pagos y la
            información institucional del Club Náutico.
          </p>

          <div className="admin-buttons">
            <button onClick={() => (window.location.href = "/socios")} className="btn-primary">
              <Users size={20} />
              <span>Gestionar Socios</span>
            </button>
            <button onClick={() => (window.location.href = "#")} className="btn-primary">
              <Trophy size={20} />
              <span>Disciplinas</span>
            </button>
            <button onClick={() => (window.location.href = "#")} className="btn-primary">
              <CreditCard size={20} />
              <span>Control de Pagos</span>
            </button>
            <button
              onClick={() => (window.location.href = "/chatbot-analytics")}
              className="btn-analytics"
            >
              <BarChart3 size={20} />
              <span>Analytics del Chatbot</span>
            </button>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
