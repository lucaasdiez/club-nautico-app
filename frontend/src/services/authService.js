import api from "./api";

// Llamada al endpoint /api/login del backend
export const login = async (email, password) => {
  try {
    const response = await api.post("/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al iniciar sesión";
  }
};
