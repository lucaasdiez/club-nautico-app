import "./AdminHome.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect } from "react";
import { Users, Trophy, CreditCard, BarChart3, LogOut, Settings, ScanQrCode } from "lucide-react";
import Navbar from "../components/Navbar"; 


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
      <header className="admin-header">
        <div className="header-content">
          <div className="logo-section">
            <img
              src="/logo-png-redondo-297x300.png"
              alt="Logo Club Náutico"
              className="admin-logo-img"
            />
            <div>
              <h1>Panel de Administración</h1>
              <p className="header-subtitle">Club Náutico</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

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

<<<<<<< HEAD
          <button onClick={() => (window.location.href = "#")} className="admin-card">
=======
          <button onClick={() => (window.location.href = "/admin/disciplinas")} className="admin-card">
>>>>>>> master
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
<<<<<<< HEAD
=======
            <p>PROXIMAMENTE</p>
>>>>>>> master
          </button>

          <button onClick={() => (window.location.href = "/chatbot-analytics")} className="admin-card">
            <div className="card-icon">
              <BarChart3 size={32} />
            </div>
            <h3>Analytics del Chatbot</h3>
            <p>Visualizá estadísticas del asistente virtual</p>
          </button>
<<<<<<< HEAD
=======

          <button onClick={() => (window.location.href = "/admin-qr")} className="admin-card">
            <div className="card-icon">
              <ScanQrCode size={32} />
            </div>
            <h3>Escanear QR</h3>
            <p>Validá un Acceso</p>
          </button>
>>>>>>> master
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
