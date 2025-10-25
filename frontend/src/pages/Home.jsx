import "./Home.scss";
import Navbar from "../components/Navbar";
import { useEffect } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Home() {
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    // Mostrar alerta solo una vez por sesión
    const hasWelcomed = sessionStorage.getItem("homeWelcomed");
    const nombre = localStorage.getItem("userName") || "socio";

    if (!hasWelcomed) {
      MySwal.fire({
        title: `¡Bienvenido/a, ${nombre.split(" ")[0]}! 👋`,
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
  }, []);

  return (
    <div className="home-page">
      {/* ✅ Navbar visible arriba */}
      <Navbar />

      <div className="home-container">
        <div className="home-content">
          {/* Tarjetas resumen */}
          <div className="cards-summary">
            <div className="card status">
              <p className="label">ESTADO</p>
              <h3 className="value active">Activo</h3>
            </div>

            <div className="card disciplines">
              <p className="label">DISCIPLINAS</p>
              <h3 className="value">1</h3>
            </div>

            <div className="card last-payment">
              <p className="label">ÚLTIMO PAGO</p>
              <h3 className="value">30-09-2025</h3>
            </div>

            <div className="card member-since">
              <p className="label">MIEMBRO DESDE</p>
              <h3 className="value">2025</h3>
            </div>
          </div>

          {/* Sección principal */}
          <div className="main-section">
            <div className="info-card1">
              <h2>Información Personal</h2>

              <div className="profile">
                <div className="avatar">JMS</div>
                <div className="info">
                  <h3>Juan Manuel Semper</h3>
                  <p className="id">Socio #30802</p>
                  <span className="badge">Activo</span>
                </div>
              </div>

              <div className="details">
                <p>
                  <strong>Email:</strong> juanmanuelsemper@gmail.com
                </p>
                <p>
                  <strong>Teléfono:</strong> +54 221 5703572
                </p>
                <p>
                  <strong>Miembro desde:</strong> 13-09-2025
                </p>
              </div>
            </div>

            <div className="disciplines-card">
              <h2>Disciplinas Inscritas</h2>
              <p className="subtitle">Tus actividades deportivas actuales</p>

              <div className="discipline-item">
                <div className="discipline-name">
                  <h3>Tenis</h3>
                  <p>Lunes a Viernes 9:00-18:00</p>
                </div>
                <div className="discipline-price">
                  <span>$15.000</span> <small>mensual</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
