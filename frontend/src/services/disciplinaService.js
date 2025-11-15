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
export const getDisciplinaByNombre = (nombre) => {
  return api.get(`/disciplinas/disciplina/${nombre}`);
};

export const createDisciplina = (disciplinaData) => {
  return api.post("/disciplinas/crear", disciplinaData);
};

// --- NECESITARÁS AÑADIR ESTOS ENDPOINTS EN TU BACKEND ---


export const updateDisciplina = (nombreDisciplinaVieja, disciplinaData) => {
  return api.put(`/disciplinas/${nombreDisciplinaVieja}`, disciplinaData);
};

export const deleteDisciplina = (nombre) => {
  return api.delete(`/disciplinas/${nombre}`);
};