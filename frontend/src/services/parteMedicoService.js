import api from "./api";


export const getParteMedicos = async (nroSocio) => {
  try {
    const response = await api.get(`/parte-medico/${nroSocio}`);
    return response.data;
  } catch (error) {
    console.error("Error al Cargar los partes médicos:", error);
    throw error.response?.data || "Error al Cargar los partes médicos";
  }
};


export const subirParteMedico = async (formData) => {
  try {
    const response = await api.post("/parte-medico/subir", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir el parte médico:", error);
    throw error.response?.data || "Error al subir el archivo";
  }
};