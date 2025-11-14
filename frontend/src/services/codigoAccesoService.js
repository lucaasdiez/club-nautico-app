import api from "./api";

/**
 * Servicio para gestionar códigos QR de acceso
 */

// Generar código de acceso para un socio
export const generarCodigoAcceso = async (nroSocio) => {
  try {
    const response = await api.post(`/codigo-acceso/generar/${nroSocio}`);
    return response.data;
  } catch (error) {
    console.error("Error al generar código de acceso:", error);
    throw error.response?.data || "Error al generar código de acceso";
  }
};

// Validar código de acceso (para escanear)
export const validarCodigoAcceso = async (token) => {
  try {
    const response = await api.post(`/codigo-acceso/validar/${token}`);
    return response.data;
  } catch (error) {
    console.error("Error al validar código de acceso:", error);
    throw error.response?.data || "Error al validar código de acceso";
  }
};