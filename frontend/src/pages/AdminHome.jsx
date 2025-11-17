import "./AdminHome.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { Users, Trophy, CreditCard, BarChart3, LogOut, ScanQrCode } from "lucide-react";
import AdminNavbar from "../components/AdminNavbar"; // 🔹 Nuevo navbar

function AdminHome() {
  const MySwal = withReactContent(Swal);

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
      {/* 🔹 Navbar de administración */}
      <AdminNavbar />

      <main className="admin-main">
        <div className="welcome-section">
          <h2>Bienvenido al sistema de gestión</h2>
          <p>Seleccioná una opción para comenzar</p>
        </div>

        <div className="admin-grid">
          <button onClick={() => (window.location.href = "/socios")} className="admin-card">
            <div className="card-icon">
              <Users size={32} />
            </div>
            <h3>Gestionar Socios</h3>
            <p>Administrá la información de los socios del club</p>
          </button>

          <button onClick={() => (window.location.href = "/admin/disciplinas")} className="admin-card">
            <div className="card-icon">
              <Trophy size={32} />
            </div>
            <h3>Disciplinas</h3>
            <p>Gestioná las disciplinas y actividades deportivas</p>
          </button>

          <button onClick={() => (window.location.href = "#")} className="admin-card">
            <div className="card-icon">
              <CreditCard size={32} />
            </div>
            <h3>Control de Pagos</h3>
            <p>Supervisá y registrá los pagos de los socios</p>
            <p>PROXIMAMENTE</p>
          </button>

          <button onClick={() => (window.location.href = "/chatbot-analytics")} className="admin-card">
            <div className="card-icon">
              <BarChart3 size={32} />
            </div>
            <h3>Analytics del Chatbot</h3>
            <p>Visualizá estadísticas del asistente virtual</p>
          </button>

          <button onClick={() => (window.location.href = "/admin-qr")} className="admin-card">
            <div className="card-icon">
              <ScanQrCode size={32} />
            </div>
            <h3>Escanear QR</h3>
            <p>Validá un Acceso</p>
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
