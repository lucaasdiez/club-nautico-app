import "./InfoPersonal.scss";
import Navbar from "../components/Navbar"; // ✅ se importa la barra de navegación

function InfoPersonal() {
  return (
    <div className="info-personal-page">
      <Navbar /> {/* ✅ Navbar visible arriba */}

      <div className="info-container">
        <div className="info-card2">
          <h1>Mi Información Personal</h1>

          <div className="info-grid">
            <div className="info-item">
              <label>Nombre y Apellido:</label>
              <span>Juan Pérez</span>
            </div>

            <div className="info-item">
              <label>Número de Socio:</label>
              <span>#12345</span>
            </div>

            <div className="info-item">
              <label>Estado de Cuota:</label>
              <span className="activo">Al día</span>
            </div>

            <div className="info-item">
              <label>Email:</label>
              <span>juanperez@gmail.com</span>
            </div>

            <div className="info-item">
              <label>Teléfono:</label>
              <span>+12 345 678 9101</span>
            </div>

            <div className="info-item">
              <label>Miembro desde:</label>
              <span>13-09-2025</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPersonal;
