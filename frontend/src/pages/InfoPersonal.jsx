import "./InfoPersonal.scss";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import { getSocioByUsername } from "../services/sociosService";

function InfoPersonal() {
  const [socio, setSocio] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  useEffect(() => {
    const username = localStorage.getItem("userUsername");

    if (!username) {
      console.error("No se encontró 'userUsername' en localStorage.");
      return;
    }

    const fetchSocioData = async () => {
      try {
        const apiResponse = await getSocioByUsername(username);
        setSocio(apiResponse.data); 
      } catch (error) {
        console.error("Error al cargar los datos del socio:", error);
      }
    };

    fetchSocioData();
  }, []); 

  if (!socio) {
    return (
      <div className="info-personal-page">
        <Navbar />
        <div className="info-container">
          <p>Cargando información...</p>
        </div>
      </div>
    );
  }

  const estado = socio.estadoCuota === 'AL_DIA' ? 'Al día' : (socio.estadoCuota === 'VENCIDA' ? 'Debe' : 'Por Vencer');
  const estadoClass = socio.estadoCuota === 'AL_DIA' ? 'activo' : 'vencido'; 

  return (
    <div className="info-personal-page">
      <Navbar /> 

      <div className="info-container">
        <div className="info-card2">
          <h1>Mi Información Personal</h1>

          <div className="info-grid">
            <div className="info-item">
              <label>Nombre y Apellido:</label>

              <span>{socio.nombre} {socio.apellido}</span>
            </div>

            <div className="info-item">
              <label>Número de Socio:</label>
              <span>#{socio.nroSocio}</span>
            </div>

            <div className="info-item">
              <label>Estado de Cuota:</label>
              <span className={estadoClass}>{estado}</span>
            </div>

            <div className="info-item">
              <label>Email:</label>
              <span>{socio.email}</span>
            </div>

            <div className="info-item">
              <label>Teléfono:</label>
              <span>{socio.telefono}</span>
            </div>

            <div className="info-item">
              <label>Miembro desde:</label>
              <span>{formatDate(socio.fechaAlta)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPersonal;