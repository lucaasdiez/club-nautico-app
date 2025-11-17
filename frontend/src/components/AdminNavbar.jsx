import "./AdminNavbar.scss";
import { LogOut } from "lucide-react";

function AdminNavbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-container">
        <div className="logo-section" onClick={() => (window.location.href = "/admin")}>
          <img src="/logo-png-redondo-297x300.png" alt="Logo Club Náutico" />
          <span>Panel Administrativo</span>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
