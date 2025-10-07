import "./AdminHome.scss";

function AdminHome() {
  const handleLogout = () => {
    // Cierra sesión y redirige al login
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="admin-home">
      {/* 🔹 Encabezado fijo */}
      <header className="admin-header">
        <div className="logo-section">
          <img src="/vite.svg" alt="Logo Club Náutico" className="logo" />
          <h2>Club Náutico - Panel Admin</h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </header>

      {/* 🔹 Contenido principal */}
      <main className="admin-content">
        <h1>Panel de Administración</h1>
        <p>
          Bienvenido al panel del Club Náutico. Desde aquí podés gestionar
          socios, disciplinas, pagos y toda la información institucional del
          club.
        </p>

        <div className="admin-buttons">
          <button onClick={() => (window.location.href = "/socios")}>
            Gestionar Socios
          </button>
          <button onClick={() => (window.location.href = "/disciplinas")}>
            Disciplinas
          </button>
          <button onClick={() => (window.location.href = "/pagos")}>
            Control de Pagos
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminHome;
