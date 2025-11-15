import api from "./api";

/**
 * Servicio para consumir el API de analytics del chatbot
 */

// Obtener estadísticas generales
export const obtenerEstadisticas = async () => {
  try {
    const response = await api.get("/chatbot/estadisticas");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener estadísticas";
  }
};

// Obtener top 10 preguntas frecuentes agrupadas por IA
export const obtenerPreguntasFrecuentes = async () => {
  try {
    const response = await api.get("/chatbot/preguntas-frecuentes");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener preguntas frecuentes";
  }
};

// Obtener preguntas agrupadas por categoría
export const obtenerPreguntasPorCategoria = async () => {
  try {
    const response = await api.get("/chatbot/preguntas-por-categoria");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener preguntas por categoría";
  }
};

// Obtener tendencias diarias (últimos 30 días)
export const obtenerTendencias = async () => {
  try {
    const response = await api.get("/chatbot/tendencias");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener tendencias";
  }
};

// Obtener últimas 20 consultas
export const obtenerUltimasConsultas = async () => {
  try {
    const response = await api.get("/chatbot/ultimas-consultas");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al obtener últimas consultas";
  }
};

// Buscar consultas por rango de fechas
export const buscarPorFecha = async (inicio, fin) => {
  try {
    const response = await api.get("/chatbot/buscar", {
      params: { inicio, fin }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al buscar consultas";
  }
};

// Registrar consulta (usado por n8n normalmente, pero puede ser útil para testing)
export const registrarConsulta = async (consultaData) => {
  try {
    const response = await api.post("/chatbot/registrar", consultaData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al registrar consulta";
  }
};
