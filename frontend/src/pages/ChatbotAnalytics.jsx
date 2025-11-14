import { useState, useEffect } from "react";
import "./ChatbotAnalytics.scss";
import {
  obtenerEstadisticas,
  obtenerPreguntasFrecuentes,
  obtenerPreguntasPorCategoria,
  obtenerTendencias,
  obtenerUltimasConsultas,
} from "../services/chatbotService";
import Swal from "sweetalert2";

// Iconos SVG
const IconChart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

const IconQuestion = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const IconFolder = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconTrending = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const IconHistory = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconRefresh = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const IconMessage = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const IconCalendar = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const IconCalendarWeek = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <path d="M8 14h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 14h.01"></path>
  </svg>
);

const IconBarChart = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const IconZap = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const IconUsers = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const IconFire = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

const IconChevronDown = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const IconChevronUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

function ChatbotAnalytics() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [tendencias, setTendencias] = useState([]);
  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState("estadisticas");
  const [categoriasAbiertas, setCategoriasAbiertas] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [statsRes, preguntasRes, categoriasRes, tendenciasRes, consultasRes] = 
        await Promise.all([
          obtenerEstadisticas(),
          obtenerPreguntasFrecuentes(),
          obtenerPreguntasPorCategoria(),
          obtenerTendencias(),
          obtenerUltimasConsultas(),
        ]);

      console.log("Estadísticas recibidas:", statsRes);
      
      setEstadisticas(statsRes.data || statsRes);
      setPreguntasFrecuentes(preguntasRes.data || preguntasRes);
      setCategorias(categoriasRes.data || categoriasRes);
      setTendencias(tendenciasRes.data || tendenciasRes);
      setUltimasConsultas(consultasRes.data || consultasRes);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudieron cargar los datos del chatbot",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleCategoria = (categoria) => {
    setCategoriasAbiertas(prev => ({
      ...prev,
      [categoria]: !prev[categoria]
    }));
  };

  const getTotalConsultasCategoria = (preguntas) => {
    return preguntas.reduce((total, p) => total + p.cantidad, 0);
  };

  const getNombreCategoria = (categoria) => {
    const nombres = {
      'HORARIOS': 'Consultas sobre horarios',
      'PAGOS': 'Consultas sobre pagos',
      'INSCRIPCIONES': 'Consultas sobre inscripciones',
      'GENERAL': 'Consultas generales',
      'DISCIPLINAS': 'Consultas sobre disciplinas',
      'ACCESO': 'Consultas sobre acceso',
      'SOCIOS': 'Consultas sobre socios',
      'SERVICIOS': 'Consultas sobre servicios'
    };
    return nombres[categoria] || `Consultas sobre ${categoria.toLowerCase()}`;
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatearHora = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="chatbot-analytics">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Cargando datos del chatbot...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbot-analytics">
      <div className="analytics-header">
        <h1>
          <IconBarChart /> Analytics del Chatbot
        </h1>
        <button className="btn-refresh" onClick={cargarDatos}>
          <IconRefresh /> Actualizar
        </button>
      </div>

      {/* Navegación por tabs */}
      <div className="analytics-tabs">
        <button
          className={vistaActiva === "estadisticas" ? "active" : ""}
          onClick={() => setVistaActiva("estadisticas")}
        >
          <IconChart /> Estadísticas
        </button>
        <button
          className={vistaActiva === "preguntas" ? "active" : ""}
          onClick={() => setVistaActiva("preguntas")}
        >
          <IconQuestion /> Preguntas Frecuentes
        </button>
        <button
          className={vistaActiva === "categorias" ? "active" : ""}
          onClick={() => setVistaActiva("categorias")}
        >
          <IconFolder /> Por Categoría
        </button>
        <button
          className={vistaActiva === "historial" ? "active" : ""}
          onClick={() => setVistaActiva("historial")}
        >
          <IconHistory /> Historial
        </button>
      </div>

      {/* Contenido según la vista activa */}
      <div className="analytics-content">
        {vistaActiva === "estadisticas" && (
          <div className="vista-estadisticas">
            <h2>Estadísticas Generales</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">
                  <IconMessage />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.totalConsultas}</h3>
                  <p>Consultas Totales</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <IconCalendar />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasHoy}</h3>
                  <p>Consultas Hoy</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <IconCalendarWeek />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasSemana}</h3>
                  <p>Última Semana</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <IconBarChart />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasMes}</h3>
                  <p>Último Mes</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <IconZap />
                </div>
                <div className="stat-info">
                  <h3>
                    {estadisticas.tiempoPromedioRespuesta
                      ? `${Math.round(estadisticas.tiempoPromedioRespuesta)}ms`
                      : "N/A"}
                  </h3>
                  <p>Tiempo Promedio</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <IconUsers />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.usuariosUnicos}</h3>
                  <p>Usuarios Únicos</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {vistaActiva === "preguntas" && (
          <div className="vista-preguntas">
            <h2>
              <IconFire /> Top 10 Preguntas Más Frecuentes
            </h2>
            <p className="subtitle">Agrupadas automáticamente por similitud semántica</p>
            <div className="preguntas-list">
              {preguntasFrecuentes.map((pregunta, index) => (
                <div key={index} className="pregunta-item">
                  <div className="pregunta-rank">#{index + 1}</div>
                  <div className="pregunta-content">
                    <h3>{pregunta.pregunta}</h3>
                    <div className="pregunta-stats">
                      <span className="cantidad">{pregunta.cantidad} consultas</span>
                      <span className="porcentaje">
                        {pregunta.porcentaje.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActiva === "categorias" && (
          <div className="vista-categorias">
            <h2>
              <IconFolder /> Preguntas por Categoría
            </h2>
            {Object.entries(categorias).map(([categoria, preguntas]) => (
              <div key={categoria} className="categoria-section">
                <div 
                  className="categoria-header"
                  onClick={() => toggleCategoria(categoria)}
                >
                  <div className="categoria-info">
                    <h3 className="categoria-titulo">{getNombreCategoria(categoria)}</h3>
                    <span className="categoria-total">
                      {getTotalConsultasCategoria(preguntas)} consultas totales
                    </span>
                  </div>
                  <button className="categoria-toggle">
                    {categoriasAbiertas[categoria] ? <IconChevronUp /> : <IconChevronDown />}
                  </button>
                </div>
                
                {categoriasAbiertas[categoria] && (
                  <div className="categoria-preguntas">
                    {preguntas.map((pregunta, index) => (
                      <div key={index} className="categoria-pregunta-item">
                        <div className="pregunta-texto">{pregunta.pregunta}</div>
                        <div className="pregunta-cantidad">
                          {pregunta.cantidad} consultas
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {vistaActiva === "tendencias" && (
          <div className="vista-tendencias">
            <h2>
              <IconTrending /> Tendencias Diarias (Últimos 30 días)
            </h2>
            <div className="tendencias-chart">
              {tendencias.map((dia, index) => (
                <div key={index} className="tendencia-bar">
                  <div className="bar-info">
                    <span className="bar-fecha">{formatearFecha(dia.fecha)}</span>
                    <span className="bar-cantidad">{dia.cantidad}</span>
                  </div>
                  <div className="bar-container">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${(dia.cantidad / Math.max(...tendencias.map(t => t.cantidad))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {vistaActiva === "historial" && (
          <div className="vista-historial">
            <h2>
              <IconHistory /> Últimas 20 Consultas
            </h2>
            <div className="consultas-table">
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Pregunta</th>
                    <th>Usuario</th>
                    <th>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasConsultas.map((consulta) => (
                    <tr key={consulta.id}>
                      <td>{formatearFecha(consulta.fecha)}</td>
                      <td>{formatearHora(consulta.fecha)}</td>
                      <td className="pregunta-cell">{consulta.pregunta}</td>
                      <td>
                        {consulta.nombreSocio || (
                          <span className="anonimo">{consulta.tipoUsuario}</span>
                        )}
                      </td>
                      <td>
                        {consulta.tiempoRespuestaMs
                          ? `${consulta.tiempoRespuestaMs}ms`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="analytics-footer">
        <button className="btn-back" onClick={() => window.history.back()}>
          <IconArrowLeft /> Volver
        </button>
      </div>
    </div>
  );
}

export default ChatbotAnalytics;