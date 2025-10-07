import Navbar from "../components/Navbar";
import "./Disciplinas.scss";

function Disciplinas() {
  const disciplinas = [
    {
      nombre: "Tenis",
      descripcion: "Clases de tenis para todos los niveles",
      horario: "Lunes a Viernes 9:00–18:00",
      inscritos: "0/20 inscritos",
      precio: "$15.000/mes",
    },
    {
      nombre: "Natación",
      descripcion: "Clases de natación y aqua aeróbicos",
      horario: "Todos los días 7:00–21:00",
      inscritos: "0/30 inscritos",
      precio: "$12.000/mes",
    },
    {
      nombre: "Fitness",
      descripcion: "Gimnasio y clases grupales",
      horario: "24/7",
      inscritos: "1/50 inscritos",
      precio: "$8.000/mes",
    },
    {
      nombre: "Fútbol",
      descripcion: "Entrenamientos y partidos de fútbol",
      horario: "Martes y Jueves 19:00–21:00",
      inscritos: "0/25 inscritos",
      precio: "$10.000/mes",
    },
  ];

  return (
    <div className="disciplinas-page">
      <Navbar />

      <div className="container-principal">
        {/* Tarjetas superiores */}
        <div className="cards-superiores">
          <div className="card-item">
            <p>Mis Disciplinas</p>
            <div className="valor azul">
              <span>0</span>
              <div className="icono">
                <i className="fa-solid fa-trophy"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Disponibles</p>
            <div className="valor verde">
              <span>4</span>
              <div className="icono">
                <i className="fa-solid fa-bullseye"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Costo Mensual</p>
            <div className="valor violeta">
              <span>$0</span>
              <div className="icono">
                <i className="fa-solid fa-dollar-sign"></i>
              </div>
            </div>
          </div>

          <div className="card-item">
            <p>Total Disciplinas</p>
            <div className="valor naranja">
              <span>4</span>
              <div className="icono">
                <i className="fa-regular fa-calendar-days"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Disciplinas disponibles */}
        <div className="disciplinas-disponibles">
          <h3>
            <i className="fa-solid fa-trophy"></i> Disciplinas Disponibles
          </h3>

          <div className="grid-disciplinas">
            {disciplinas.map((disc, index) => (
              <div className="card-disciplina" key={index}>
                <div className="header">
                  <h4>{disc.nombre}</h4>
                  <span className="badge">Disponible</span>
                </div>

                <p className="descripcion">{disc.descripcion}</p>

                <p className="horario">
                  <i className="fa-regular fa-clock"></i> {disc.horario}
                </p>

                <p className="inscritos">
                  <i className="fa-regular fa-user"></i> {disc.inscritos}
                </p>

                <div className="precio">{disc.precio}</div>

                <div className="barra-progreso"></div>

                <button className="btn-inscribirse">
                  <i className="fa-regular fa-trophy"></i> Inscribirse
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Disciplinas;
