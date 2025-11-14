
import api from "./api";

export const getSocios = () => api.get("/socios");
export const createSocio = (data) => api.post("/socios", data);
export const updateSocio = (id, data) => api.put(`/socios/${id}`, data);
export const deleteSocio = (id) => api.delete(`/socios/${id}`);

export const getSocioByUsername = async (username) => {
  try {

    const response = await api.get(`/socios/socio/${username}`);

    return response.data;

  } catch (error) {
    console.error("Error al buscar socio por username:", error);
    throw error.response?.data || "Error al buscar socio";
  }
};