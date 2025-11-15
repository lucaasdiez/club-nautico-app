
import api from "./api";

export const getSocios = () => api.get("/socios");
export const createSocio = (data) => api.post("/socios", data);
export const updateSocio = (nroSocio, socioData) => {
  return api.put(`/socios/${nroSocio}`, socioData);
};
export const deleteSocio = (nroSocio) => {
  return api.delete(`/socios/${nroSocio}`);
};
export const getSocioByUsername = async (username) => {
  try {

    const response = await api.get(`/socios/socio/${username}`);

    return response.data;

  } catch (error) {
    console.error("Error al buscar socio por username:", error);
    throw error.response?.data || "Error al buscar socio";
  }
};