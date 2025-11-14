import api from "./api";

// Llamada al endpoint /api/login del backend
export const login = async (username, password) => {
  try {
    const response = await api.post("/login", { username, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error al iniciar sesión";
  }
};

// Función para cerrar sesión
export const logout = () => {
  // Limpiar todo el localStorage
  localStorage.clear();
  
  // Redirigir al login
  window.location.href = '/';
};

// Función para verificar si hay una sesión activa
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  
  return !!(token && userRole);
};

// Función para obtener el rol del usuario actual
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Función para obtener el nombre del usuario actual
export const getUserName = () => {
  return localStorage.getItem('userName') || 'Usuario';
};

// Función para obtener el username
export const getUsername = () => {
  return localStorage.getItem('userUsername');
};

// Función para obtener el número de socio
export const getNroSocio = () => {
  return localStorage.getItem('userNroSocio');
};