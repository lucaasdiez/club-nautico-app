import api from "./api";

export const getSocios = () => api.get("/socios");
export const createSocio = (data) => api.post("/socios", data);
export const updateSocio = (id, data) => api.put(`/socios/${id}`, data);
export const deleteSocio = (id) => api.delete(`/socios/${id}`);
