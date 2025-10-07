import "./InfoPersonal.scss";

function InfoPersonal() {
  return (
    <div className="info-personal-page">
      <h1>Mi Información Personal</h1>

      <div className="info-item">
        <label>Nombre y Apellido:</label>
        <span>Juan Pérez</span>
      </div>

      <div className="info-item">
        <label>Número de Socio:</label>
        <span>12345</span>
      </div>

      <div className="info-item">
        <label>Estado de Cuota:</label>
        <span>Al día</span>
      </div>

      <div className="info-item">
        <label>Email:</label>
        <span>juanperez@gmail.com</span>
      </div>
    </div>
  );
}

export default InfoPersonal;
