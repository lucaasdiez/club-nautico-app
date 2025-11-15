import "./Home.scss";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { getSocioByUsername } from "../services/sociosService";

function Home() {
  const MySwal = withReactContent(Swal);

  const [socio, setSocio] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  };

  useEffect(() => {
    const username = localStorage.getItem("userUsername");

    if (!username) {
      console.error("No se encontró 'userUsername' en localStorage.");
      return;
    }

    const fetchData = async () => {
      try {
        const apiResponse = await getSocioByUsername(username);
        const socioData = apiResponse.data;
        setSocio(socioData); 

        const hasWelcomed = sessionStorage.getItem("homeWelcomed");
        const nombreSocio = localStorage.getItem("userName") || socioData.nombre;

        if (!hasWelcomed && nombreSocio) {
          MySwal.fire({
            title: `¡Bienvenido/a, ${nombreSocio.split(" ")[0]}! 👋`,
            text: "Nos alegra verte nuevamente en el Portal del Socio.",
            icon: "success",
            confirmButtonColor: "#1e3a8a",
            background: "#f8f9fb",
            color: "#333",
            timer: 2500,
            showConfirmButton: false,
          });
          sessionStorage.setItem("homeWelcomed", "true");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []); 

  if (!socio) {
    return (
      <div className="home-page">
        <Navbar />
        <div className="home-container">
          <p>Cargando información del socio...</p>
        </div>
      </div>
    );
  }

  const estado =
    socio.estadoCuota === "AL_DIA"
      ? "Activo"
      : socio.estadoCuota === "VENCIDA"
      ? "Debe"
      : "Por Vencer";

  const estadoClass =
    socio.estadoCuota === "AL_DIA" ? "active" : "inactive";

  return (
    <div className="home-page">
      <Navbar />

      <div className="home-container">
        <div className="home-content">
          
          {/* ==== RESUMEN SUPERIOR ==== */}
          <div className="cards-summary">
            
            <div className="card status">
              <p className="label">ESTADO</p>
              <h3 className={`value ${estadoClass}`}>{estado}</h3>
            </div>

            <div className="card disciplines">
              <p className="label">DISCIPLINAS</p>
              <h3 className="value">{socio.disciplinas?.length || 0}</h3>
            </div>

            <div className="card last-payment">
              <p className="label">ÚLTIMO PAGO</p>
              <h3 className="value">{formatDate(socio.ultimoPagado)}</h3>
            </div>

            <div className="card member-since">
              <p className="label">MIEMBRO DESDE</p>
              <h3 className="value">
                {socio.fechaAlta
                  ? new Date(socio.fechaAlta).getFullYear()
                  : "N/A"}
              </h3>
            </div>

          </div>

          {/* ==== INFORMACIÓN PRINCIPAL ==== */}
          <div className="main-section">

            {/* PERFIL */}
            <div className="info-card1">
              <h2>Información Personal</h2>

              <div className="profile">
                <div className="avatar">
                  {socio.nombre[0]}
                  {socio.apellido[0]}
                </div>

                <div className="info">
                  <h3>
                    {socio.nombre} {socio.apellido}
                  </h3>
                  <p className="id">Socio #{socio.nroSocio}</p>
                  <span className={`badge ${estadoClass}`}>{estado}</span>
                </div>
              </div>

              <div className="details">
                <p>
                  <strong>Email:</strong> {socio.email}
                </p>
                <p>
                  <strong>Teléfono:</strong> {socio.telefono}
                </p>
                <p>
                  <strong>Miembro desde:</strong>{" "}
                  {formatDate(socio.fechaAlta)}
                </p>
              </div>
            </div>

            {/* DISCIPLINAS INSCRIPTAS */}
            <div className="disciplines-card">
              <h2>Disciplinas Inscritas</h2>
              <p className="subtitle">Tus actividades deportivas actuales</p>

              {/* Contenedor para la lista con scroll */}
              <div className="disciplines-list-container">
                {(!socio.disciplinas || socio.disciplinas.length === 0) ? (
                  <p className="no-disciplinas-home">No estás inscripto en ninguna disciplina.</p>
                ) : (
                  socio.disciplinas.map((disciplina, index) => {
                    
                    const nombre = disciplina.nombre;
                    const precio = disciplina.precioMensual;

                    return (
                      <div className="discipline-item" key={index}>
                        <div className="discipline-name">
                          <h3>{nombre}</h3>
                          <p>Disciplina activa</p>
                        </div>

                        <div className="discipline-price">
                          <span>${precio}</span> <small>mensual</small>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;