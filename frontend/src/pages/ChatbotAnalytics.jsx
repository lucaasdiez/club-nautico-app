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

function ChatbotAnalytics() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [preguntasFrecuentes, setPreguntasFrecuentes] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [tendencias, setTendencias] = useState([]);
  const [ultimasConsultas, setUltimasConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vistaActiva, setVistaActiva] = useState("estadisticas"); // estadisticas, preguntas, categorias, tendencias, historial

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

      setEstadisticas(statsRes.data);
      setPreguntasFrecuentes(preguntasRes.data);
      setCategorias(categoriasRes.data);
      setTendencias(tendenciasRes.data);
      setUltimasConsultas(consultasRes.data);
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
        <h1>📊 Analytics del Chatbot</h1>
        <button className="btn-refresh" onClick={cargarDatos}>
          🔄 Actualizar
        </button>
      </div>

      {/* Navegación por tabs */}
      <div className="analytics-tabs">
        <button
          className={vistaActiva === "estadisticas" ? "active" : ""}
          onClick={() => setVistaActiva("estadisticas")}
        >
          📈 Estadísticas
        </button>
        <button
          className={vistaActiva === "preguntas" ? "active" : ""}
          onClick={() => setVistaActiva("preguntas")}
        >
          ❓ Preguntas Frecuentes
        </button>
        <button
          className={vistaActiva === "categorias" ? "active" : ""}
          onClick={() => setVistaActiva("categorias")}
        >
          📂 Por Categoría
        </button>
        <button
          className={vistaActiva === "tendencias" ? "active" : ""}
          onClick={() => setVistaActiva("tendencias")}
        >
          📉 Tendencias
        </button>
        <button
          className={vistaActiva === "historial" ? "active" : ""}
          onClick={() => setVistaActiva("historial")}
        >
          📜 Historial
        </button>
      </div>

      {/* Contenido según la vista activa */}
      <div className="analytics-content">
        {vistaActiva === "estadisticas" && (
          <div className="vista-estadisticas">
            <h2>Estadísticas Generales</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">💬</div>
                <div className="stat-info">
                  <h3>{estadisticas.totalConsultas}</h3>
                  <p>Consultas Totales</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasHoy}</h3>
                  <p>Consultas Hoy</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📆</div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasSemana}</h3>
                  <p>Última Semana</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasMes}</h3>
                  <p>Último Mes</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
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
                <div className="stat-icon">👥</div>
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
            <h2>🔥 Top 10 Preguntas Más Frecuentes</h2>
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
            <h2>📂 Preguntas por Categoría</h2>
            {Object.entries(categorias).map(([categoria, preguntas]) => (
              <div key={categoria} className="categoria-section">
                <h3 className="categoria-titulo">{categoria}</h3>
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
              </div>
            ))}
          </div>
        )}

        {vistaActiva === "tendencias" && (
          <div className="vista-tendencias">
            <h2>📉 Tendencias Diarias (Últimos 30 días)</h2>
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
            <h2>📜 Últimas 20 Consultas</h2>
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
          ← Volver
        </button>
      </div>
    </div>
  );
}

export default ChatbotAnalytics;
