import axios from "axios";

// 1. Creamos la instancia de Axios con tu baseURL
const api = axios.create({
  baseURL: "http://localhost:8080/api", // backend Spring Boot
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. ¡EL INTERCEPTOR! (El "Guardia")
// Esto se ejecuta ANTES de que cualquier petición sea enviada
api.interceptors.request.use(
  (config) => {
    // 3. Buscamos el token en el localStorage
    const token = localStorage.getItem("token");

    // 4. Si el token existe, lo agregamos a la cabecera (Header)
    if (token) {
      // El nombre de la cabecera debe ser "Authorization"
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    
    return config; // Dejamos que la petición continúe
  },
  (error) => {
    // Si hay un error al configurar la petición
    return Promise.reject(error);
  }
);

export default api;