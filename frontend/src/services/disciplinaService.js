import api from "./api";

export const getDisciplinas = async () => {
  try {
    const response = await api.get("/disciplinas");
    return response.data; 
  
  } catch (error) {
    console.error("Error al Cargar las disciplinas:", error);
    throw error.response?.data || "Error al Cargar las disciplinas";
  }
};