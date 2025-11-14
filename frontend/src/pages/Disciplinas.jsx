import "./Disciplinas.scss";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";
import axios from "axios";

function Disciplinas() {
  const MySwal = withReactContent(Swal);
  const [usuario, setUsuario] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

  // 🧠 Cargar usuario y datos desde backend o localStorage
  useEffect(() => {
    const userData = localStorage.getItem("userEmail");
    if (userData) setUsuario(userData);

    const fetchData = async () => {
      try {
        const email = userData || "";
        const [discRes, insRes] = await Promise.all([
          axios.get("http://localhost:8080/api/disciplinas"),
          axios.get(`http://localhost:8080/api/inscripciones?email=${email}`),
        ]);
        setDisciplinas(discRes.data);
        setInscripciones(insRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // 💬 SweetAlert bienvenida (una sola vez)
  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("disciplinasWelcomeV2");
    if (!hasWelcomed && usuario) {
      MySwal.fire({
        title: `¡Bienvenido, ${usuario}! 🏊‍♂️`,
        text: "Gestioná tus disciplinas desde este panel.",
        icon: "info",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
        timer: 2200,
        showConfirmButton: false,
      });
      sessionStorage.setItem("disciplinasWelcomeV2", "true");
    }
  }, [usuario, MySwal]);

  // 📌 Función inscribirse
  const handleInscripcion = async (disciplina) => {
    // Verificar si ya está inscripto
    const yaInscripto = inscripciones.some(
      (i) => i.idDisciplina === disciplina.id || i.nombre === disciplina.nombre
    );
    if (yaInscripto) {
      MySwal.fire({
        icon: "warning",
        title: "Ya estás inscripto",
        text: `Ya estás registrado en ${disciplina.nombre}.`,
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    // Confirmación de inscripción
    const result = await MySwal.fire({
      title: `¿Deseás inscribirte en ${disciplina.nombre}?`,
      text: `Confirmá tu inscripción.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, inscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#b91c1c",
      background: "#f8f9fb",
      color: "#333",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.post("http://localhost:8080/api/inscripciones", {
          email: usuario,
          disciplinaId: disciplina.id,
        });

        setInscripciones((prev) => [...prev, response.data.inscripcion]);

        MySwal.fire({
          title: "¡Inscripción confirmada!",
          text: `Te inscribiste en ${disciplina.nombre}.`,
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      } catch (error) {
        console.error("Error al inscribirse:", error);
        MySwal.fire({
          icon: "error",
          title: "Error al inscribirse",
          text: error.response?.data?.error || "Ocurrió un error inesperado.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    }
  };

  // ❌ Desinscribirse
  const handleDesinscripcion = async (disciplina) => {
    const result = await MySwal.fire({
      title: `¿Deseás darte de baja de ${disciplina.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desinscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#1e3a8a",
      background: "#f8f9fb",
      color: "#333",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8080/api/inscripciones/${disciplina.idDisciplina || disciplina.id}?email=${usuario}`
        );

        setInscripciones((prev) =>
          prev.filter(
            (i) =>
              i.idDisciplina !== disciplina.idDisciplina &&
              i.nombre !== disciplina.nombre
          )
        );

        MySwal.fire({
          title: "Desinscripción exitosa",
          text: `Ya no estás inscripto en ${disciplina.nombre}.`,
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      } catch (error) {
        console.error("Error al desinscribirse:", error);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo completar la desinscripción.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    }
  };

  // 💰 Calcular total mensual
  const totalMensual = inscripciones.reduce((acc, i) => {
    const monto = parseFloat(i.precio?.replace(/[^0-9.]/g, "") || 0);
    return acc + monto;
  }, 0);

  // 🔍 Clasificación de disciplinas
  const disponibles = disciplinas.filter(
    (disc) => !inscripciones.some((i) => i.nombre === disc.nombre)
  );

  return (
    <div className="disciplinas-page page-background">
      <Navbar />
      <div className="disciplinas-container">
        <div className="disciplinas-content">
          <h1>Gestión de Disciplinas</h1>

          {/* === Sección de inscritas === */}
          <section className="inscritas-section">
            <h2>Mis Disciplinas Inscritas</h2>
            {inscripciones.length > 0 ? (
              <div className="disciplinas-grid">
                {inscripciones.map((disc, index) => (
                  <div className="card-inscripta" key={index}>
                    <div className="header">
                      <h3>{disc.nombre}</h3>
                      <span className="estado">Inscripto</span>
                    </div>
                    <p className="horario">
                      <i className="fa-regular fa-clock"></i> Horario según plan actual
                    </p>
                    <p className="precio">{disc.precio}</p>
                    <button
                      className="btn-desinscribirse"
                      onClick={() => handleDesinscripcion(disc)}
                    >
                      <i className="fa-solid fa-xmark"></i> Desinscribirse
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-inscripciones">
                No estás inscripto en ninguna disciplina.
              </p>
            )}
          </section>

          {/* === Sección de disponibles === */}
          <section className="disponibles-section">
            <h2>Disciplinas Disponibles</h2>
            <div className="disciplinas-grid">
              {disponibles.map((disc) => (
                <div className="card-disciplina" key={disc.id}>
                  <div className="header">
                    <h3>{disc.nombre}</h3>
                    <span
                      className={`badge ${
                        disc.inscritos >= disc.cupos ? "ocupado" : "disponible"
                      }`}
                    >
                      {disc.inscritos >= disc.cupos ? "Sin cupos" : "Disponible"}
                    </span>
                  </div>
                  <p className="descripcion">{disc.descripcion}</p>
                  <p className="horario">
                    <i className="fa-regular fa-clock"></i> {disc.horario}
                  </p>
                  <p className="inscritos">
                    {disc.inscritos}/{disc.cupos} inscritos
                  </p>
                  <p className="precio">{disc.precio}</p>
                  <button
                    className="btn-inscribirse"
                    onClick={() => handleInscripcion(disc)}
                    disabled={disc.inscritos >= disc.cupos}
                  >
                    Inscribirme
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* === Resumen === */}
          <section className="resumen-section">
            <h2>Resumen de Inscripciones</h2>
            {inscripciones.length > 0 ? (
              <>
                <div className="resumen-lista">
                  {inscripciones.map((i, idx) => (
                    <p key={idx}>
                      <strong>{i.nombre}</strong> — {i.precio}
                    </p>
                  ))}
                </div>
                <p className="total">
                  Total Mensual: <span>${totalMensual.toLocaleString()}</span>
                </p>
              </>
            ) : (
              <p className="no-inscripciones">Sin inscripciones activas.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Disciplinas;


// Aviso: Para poder hacer la prueba de las disciplinas se deben hacer los siguientes pasos:
/* 
  1. Ir a la terminal y pararse dentro de la rama /server
  2. Dentro de la rama, ejectutar los siguientes comandos:
    npm init -y
    npm install express cors
    node server.js
  3. Una vez hecho esto, esperan a que levante y al final diga: ✅ Servidor corriendo en http://localhost:8080
  4. Cuando esten dentro de la pagina, abran la consola con F12 y van a "Console", ahi dentro escriben el siguiente comando:
    localStorage.setItem("userEmail", "paz@nautico.com");
  5. Después presioná Enter, recargá la página (Ctrl + R) y ya vas a poder acceder al /disciplinas sin iniciar sesión.
*/