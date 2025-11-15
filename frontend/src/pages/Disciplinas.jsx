import "./Disciplinas.scss";
import Navbar from "../components/Navbar";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useEffect, useState } from "react";

// ✅ CAMBIO: Ya no importamos 'api' directamente
// import api from "../services/api"; 
import { getDisciplinas } from "../services/disciplinaService";

// ✅ CAMBIO: Importamos las nuevas funciones del servicio
import {
  getInscripcionesSocio,
  inscribirSocio,
  cancelarInscripcion,
} from "../services/inscripcionesService"; // (Asumo que está en esta ruta)

// Pequeño componente helper para el ícono de 'X' (cerrar)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function Disciplinas() {
  const MySwal = withReactContent(Swal);

  const [usuario, setUsuario] = useState("");
  const [nroSocio, setNroSocio] = useState("");
  const [disciplinas, setDisciplinas] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [modalDisciplina, setModalDisciplina] = useState(null);

  // Helper (sin cambios)
  const getNombreDisciplinaFromInscripcion = (inscripcion) => {
    return (
      inscripcion?.nombre ||
      inscripcion?.nombreDisciplina ||
      inscripcion?.disciplina?.nombre ||
      ""
    );
  };

  // 🧠 Cargar usuario y datos desde backend o localStorage
  useEffect(() => {
    const username = localStorage.getItem("userUsername");
    const storedNroSocio = localStorage.getItem("userNroSocio");

    if (username) setUsuario(username);
    if (storedNroSocio) setNroSocio(storedNroSocio);

    if (!storedNroSocio) {
      console.warn("No se encontró nroSocio en localStorage (userNroSocio)");
      return;
    }

    const fetchData = async () => {
      try {
        // ✅ CAMBIO: Usamos el nuevo servicio
        const [disciplinasResponse, insRes] = await Promise.all([
          getDisciplinas(),
          getInscripcionesSocio(storedNroSocio),
        ]);

        // getDisciplinas() devuelve ApiResponse, sus datos están en .data
        const disciplinasBack = disciplinasResponse?.data ?? disciplinasResponse;
        
        // getInscripcionesSocio() devuelve ApiResponse, sus datos están en .data
        const inscripcionesBack = insRes?.data ?? insRes?.data ?? [];

        setDisciplinas(disciplinasBack || []);
        setInscripciones(inscripcionesBack || []);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        MySwal.fire({
          title: "Error de Red",
          text: "Hubo un problema al cargar tus disciplinas. Revisa tu conexión o la VPN.",
          icon: "error",
        });
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 💬 SweetAlert bienvenida (sin cambios)
  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("disciplinasWelcomeV2");
    if (!hasWelcomed && usuario) {
      MySwal.fire({
        title: `¡Bienvenido, ${usuario.split(" ")[0]}! 🏊‍♂️`,
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
    setModalDisciplina(null);

    const result = await MySwal.fire({
      title: `¿Deseás inscribirte en ${disciplina.nombre}?`,
      text: `Confirmá tu inscripción.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, inscribirme",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#888",
    });

    if (result.isConfirmed) {
      try {
        // ✅ CAMBIO: Usamos el nuevo servicio
        const response = await inscribirSocio(nroSocio, disciplina.nombre);

        const nuevaInscripcion = response?.data ?? response;

        setInscripciones((prev) => [...prev, nuevaInscripcion]);

        MySwal.fire({
          title: "¡Inscripción exitosa! 🎉",
          text: `Te inscribiste en ${disciplina.nombre}.`,
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      } catch (error) {
        console.error("Error al inscribirse:", error);
        // El servicio ya nos devuelve el error formateado
        const msg =
          error?.message || error || "No se pudo completar la inscripción.";
        MySwal.fire({ title: "Error", text: msg, icon: "error" });
      }
    }
  };

  // 📌 Función desinscribirse
  const handleDesinscripcion = async (disciplina) => {
    const result = await MySwal.fire({
      title: `¿Deseás darte de baja de ${disciplina.nombre}?`,
      text: "Esta acción puede ser irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#888",
    });

    if (result.isConfirmed) {
      try {
        // ✅ CAMBIO: Usamos el nuevo servicio
        await cancelarInscripcion(nroSocio, disciplina.nombre);

        setInscripciones((prev) =>
          prev.filter(
            (i) => getNombreDisciplinaFromInscripcion(i) !== disciplina.nombre
          )
        );

        MySwal.fire({
          title: "Baja realizada",
          text: `Te diste de baja de ${disciplina.nombre}.`,
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      } catch (error) {
        console.error("Error al desinscribirse:", error);
        // El servicio ya nos devuelve el error formateado
        const msg =
          error?.message || error || "No se pudo completar la baja.";
        MySwal.fire({ title: "Error", text: msg, icon: "error" });
      }
    }
  };

  const inscripcionesActivas = inscripciones.filter(
    (ins) => ins.estado === "ACTIVA"
  );

  const nombresInscriptas = inscripcionesActivas.map((i) =>
    getNombreDisciplinaFromInscripcion(i)
  );

  const disponibles = disciplinas.filter(
    (disc) =>
      disc.estado === "ACTIVA" && !nombresInscriptas.includes(disc.nombre)
  );

  // 🎨 Renderizado (sin cambios)
  return (
    <div className="disciplinas-page page-background">
      <Navbar />
      <div className="disciplinas-container">
        <div className="disciplinas-content">
          <h1>Gestión de Disciplinas</h1>

          {/* === Sección de inscritas (sin cambios) === */}
<section className="inscritas-section">
            <h2>Mis Disciplinas Inscritas</h2>

            {/* 👇 CAMBIO AQUÍ: usa inscripcionesActivas.length */}
            {inscripcionesActivas.length > 0 ? (
              <div className="scrollable-grid-container" style={{maxHeight: '300px'}}>
                <div className="disciplinas-grid">

                  {/* 👇 CAMBIO AQUÍ: usa inscripcionesActivas.map */}
                  {inscripcionesActivas.map((ins, index) => {
                    const nombreDisc = getNombreDisciplinaFromInscripcion(ins);
                    const disciplinaRelacionada = disciplinas.find(
                      (d) => d.nombre === nombreDisc
                    );

                    return (
                      <div className="card-inscripta" key={index}>
                        <div className="header">
                          <h3>{nombreDisc}</h3>
                          {/* Asumimos que si está en esta lista, está inscripto */}
                          <span className="estado">Inscripto</span>
                        </div>
                        <p className="precio">
                          {disciplinaRelacionada?.precioMensual
                            ? `$${disciplinaRelacionada.precioMensual}`
                            : "Cuota social"}
                        </p>
                        <button
                          className="btn-desinscribirse"
                          onClick={() =>
                            handleDesinscripcion(
                              disciplinaRelacionada || { nombre: nombreDisc }
                            )
                          }
                        >
                          Dar de baja
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="no-inscripciones">
                No estás inscripto en ninguna disciplina activa.
              </p>
            )}
          </section>

          {/* === Sección de disponibles (sin cambios) === */}
          <section className="disponibles-section">
            <h2>Disciplinas Disponibles</h2>
            
            <div className="scrollable-grid-container">
              <div className="disciplinas-grid">
                
                {disponibles.length === 0 && (
                   <p className="no-inscripciones">
                     No hay más disciplinas disponibles por el momento.
                   </p>
                )}

                {disponibles.map((disc) => {
                  const cupos = disc.cupoMaximo ?? Infinity;
                  const inscritos = disc.inscritos ?? 0; 
                  const estaLlena = inscritos >= cupos;

                  return (
                    <div className="card-disciplina" key={disc.id || disc.nombre}>
                      <div className="header">
                        <h3>{disc.nombre}</h3>
                      </div>
                      
                      <p className="precio">
                        {disc.precioMensual ? `$${disc.precioMensual}` : "Consultar"}
                      </p>
                      
                      <div className="card-buttons">
                        <button
                          className="btn-info"
                          onClick={() => setModalDisciplina(disc)}
                        >
                          Más info
                        </button>
                        <button
                          className="btn-inscribirse"
                          onClick={() => handleInscripcion(disc)}
                          disabled={estaLlena}
                        >
                          {estaLlena ? "Sin cupos" : "Inscribirme"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* === El Modal (Popup) (sin cambios) === */}
      {modalDisciplina && (
        <div className="modal-backdrop" onClick={() => setModalDisciplina(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setModalDisciplina(null)}
            >
              <CloseIcon />
            </button>
            
            <h2>{modalDisciplina.nombre}</h2>
            
            <p className="modal-descripcion">
              {modalDisciplina.descripcion || "Sin descripción."}
            </p>

            <div className="modal-detalles">
              <p>
                <strong>Precio:</strong> 
                {modalDisciplina.precioMensual ? ` $${modalDisciplina.precioMensual}` : " Consultar"}
              </p>
              <p>
                <strong>Cupos:</strong> 
                {modalDisciplina.inscritos ?? 0} / {modalDisciplina.cupoMaximo || "Ilimitados"}
              </p>
              <p>
                <strong>Estado:</strong> 
                <span className={`badge ${modalDisciplina.estado?.toLowerCase()}`}>
                  {modalDisciplina.estado}
                </span>
              </p>
            </div>

            <h4>Horarios Disponibles</h4>
            {(!modalDisciplina.horarios || modalDisciplina.horarios.length === 0) ? (
              <p className="no-horarios">Horarios a confirmar.</p>
            ) : (
              <ul className="horarios-lista">
                {modalDisciplina.horarios.map((h, index) => (
                  <li key={index}>
                    <strong>{h.dia}</strong>: {h.horaInicio} - {h.horaFin}
                  </li>
                ))}
              </ul>
            )}

            <button
              className="btn-inscribirse modal-inscribir-btn"
              onClick={() => handleInscripcion(modalDisciplina)}
              disabled={(modalDisciplina.inscritos ?? 0) >= (modalDisciplina.cupoMaximo ?? Infinity)}
            >
              {(modalDisciplina.inscritos ?? 0) >= (modalDisciplina.cupoMaximo ?? Infinity)
                ? "Sin cupos"
                : "Inscribirme"}
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Disciplinas;