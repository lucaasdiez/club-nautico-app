import axios from "axios";

// 1. Creamos la instancia de Axios con tu baseURL
const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. INTERCEPTOR DE REQUEST (Agrega el token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. ✨ INTERCEPTOR DE RESPONSE (Maneja errores de autenticación)
api.interceptors.response.use(
  (response) => {
    // Si la respuesta es exitosa, simplemente la devolvemos
    return response;
  },
  (error) => {
    // Si hay un error de autenticación (401) o prohibido (403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('🚫 Sesión inválida o expirada. Redirigiendo al login...');
      
      // Limpiar el localStorage
      localStorage.clear();
      
      // Redirigir al login
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

export default api;