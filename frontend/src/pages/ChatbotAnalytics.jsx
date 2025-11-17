import { useState, useEffect } from "react";
import "./ChatbotAnalytics.scss";
import AdminNavbar from "../components/AdminNavbar"; // 🔹 Importamos AdminNavbar
import {
  obtenerEstadisticas,
  obtenerPreguntasFrecuentes,
  obtenerPreguntasPorCategoria,
  obtenerTendencias,
  obtenerUltimasConsultas,
} from "../services/chatbotService";
import Swal from "sweetalert2";
import {
  BarChart3,
  HelpCircle,
  Folder,
  TrendingUp,
  History,
  RefreshCw,
  MessageSquare,
  Calendar,
  CalendarDays,
  Zap,
  Users,
  ArrowLeft,
  Flame,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <div className="chatbot-analytics">
  {/* 🔹 Usamos AdminNavbar */}
      <AdminNavbar />

      <div className="analytics-actions">
        <button className="btn-refresh" onClick={cargarDatos}>
          <RefreshCw size={18} /> Actualizar
        </button>
      </div>

      {/* Navegación por tabs */}
      <div className="analytics-tabs">
        <button
          className={vistaActiva === "estadisticas" ? "active" : ""}
          onClick={() => setVistaActiva("estadisticas")}
        >
          <BarChart3 size={20} /> Estadísticas
        </button>
        <button
          className={vistaActiva === "preguntas" ? "active" : ""}
          onClick={() => setVistaActiva("preguntas")}
        >
          <HelpCircle size={20} /> Preguntas Frecuentes
        </button>
        <button
          className={vistaActiva === "categorias" ? "active" : ""}
          onClick={() => setVistaActiva("categorias")}
        >
          <Folder size={20} /> Por Categoría
        </button>
        <button
          className={vistaActiva === "historial" ? "active" : ""}
          onClick={() => setVistaActiva("historial")}
        >
          <History size={20} /> Historial
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
                  <MessageSquare size={32} />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.totalConsultas}</h3>
                  <p>Consultas Totales</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Calendar size={32} />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasHoy}</h3>
                  <p>Consultas Hoy</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <CalendarDays size={32} />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasSemana}</h3>
                  <p>Última Semana</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BarChart3 size={32} />
                </div>
                <div className="stat-info">
                  <h3>{estadisticas.consultasMes}</h3>
                  <p>Último Mes</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <Zap size={32} />
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
                  <Users size={32} />
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
              <Flame size={24} /> Top 10 Preguntas Más Frecuentes
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
              <Folder size={24} /> Preguntas por Categoría
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
                    {categoriasAbiertas[categoria] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
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
              <TrendingUp size={24} /> Tendencias Diarias (Últimos 30 días)
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
              <History size={24} /> Últimas 20 Consultas
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
          <ArrowLeft size={18} /> Volver al Panel
        </button>
      </div>
    </div>
  );
}

export default ChatbotAnalytics;