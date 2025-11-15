import { LogOut } from "lucide-react";
import "./AdminNavbar.scss";

function AdminNavbar({ onLogout }) {
  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/logo-png-redondo-297x300.png" alt="Logo Club Náutico" />
          <span>Club Náutico</span>
        </div>

        <button className="logout-btn" onClick={onLogout}>
          <LogOut size={18} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </nav>
  );
}

export default AdminNavbar;
