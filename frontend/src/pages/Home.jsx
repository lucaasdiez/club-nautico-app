import Navbar from "../components/Navbar";
import "./Home.scss";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Navbar con navegación funcional y modal de logout */}
      <Navbar />

      <div className="container-principal">
        {/* Tarjetas superiores */}
        <div className="cards-superiores">
          <div className="card-item">
            <p>Estado</p>
            <div className="valor verde">
              <span>Activo</span>
              <div className="icono">
                <i className="fa-regular fa-user"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Disciplinas</p>
            <div className="valor azul">
              <span>0</span>
              <div className="icono">
                <i className="fa-solid fa-trophy"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Último Pago</p>
            <div className="valor violeta">
              <span>30-09-2025</span>
              <div className="icono">
                <i className="fa-regular fa-calendar"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Miembro desde</p>
            <div className="valor naranja">
              <span>2025</span>
              <div className="icono">
                <i className="fa-regular fa-calendar-days"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas inferiores */}
        <div className="cards-inferiores">
          {/* Información Personal */}
          <div className="card-info-personal">
            <h3>Información Personal</h3>
            <div className="perfil">
              <div className="avatar">JMS</div>
              <div className="datos">
                <p className="nombre">Juan Manuel Semper</p>
                <p className="socio">Socio #30802</p>
                <span className="estado">Activo</span>
              </div>
            </div>

            <div className="detalle">
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

          {/* Disciplinas inscritas */}
          <div className="card-disciplinas">
            <h3>Disciplinas Inscritas</h3>
            <p className="subtitulo">Tus actividades deportivas actuales</p>

            <div className="no-disc">
              <i className="fa-solid fa-trophy"></i>
              <p>No tienes disciplinas inscritas</p>
              <button
                className="btn-ver"
                onClick={() => navigate("/disciplinas")}
              >
                Ver Disciplinas
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
