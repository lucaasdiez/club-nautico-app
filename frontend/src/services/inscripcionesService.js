import api from "./api"; 


export const getInscripcionesSocio = async (nroSocio) => {
  try {
    const response = await api.get(`/inscripciones/socio/${nroSocio}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener inscripciones:", error);
    throw error.response?.data || error;
  }
};


export const inscribirSocio = async (nroSocio, nombreDisciplina) => {
  try {
    const response = await api.post("/inscripciones/inscribirse", null, {
      params: {
        nroSocio,
        nombreDisciplina,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al inscribir socio:", error);
    throw error.response?.data || error;
  }
};


export const cancelarInscripcion = async (nroSocio, nombreDisciplina) => {
  try {
    const response = await api.delete("/inscripciones/cancelar", {
      params: {
        nroSocio,
        nombreDisciplina,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar inscripcion:", error);
    throw error.response?.data || error;
  }
};