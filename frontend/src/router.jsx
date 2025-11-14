import { createBrowserRouter, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Portal del socio = Home
import Home from "./pages/Home";
import Pagos from "./pages/Pagos";
import Disciplinas from "./pages/Disciplinas";
import InfoPersonal from "./pages/InfoPersonal";
import Acceso from "./pages/Acceso";
import Socios from "./pages/Socios";
import Certificados from "./pages/Certificados";

// Admin
import AdminHome from "./pages/AdminHome";
import ChatbotAnalytics from "./pages/ChatbotAnalytics"; // <-- Importado

// Chat IA (widget global excepto en login/register)
import ChatWidget from "./components/ChatWidget/ChatWidget";

// ¡Importamos nuestro Guardia!
import ProtectedRoute from "./components/ProtectedRoute"; 

// Tu función withWidget (¡NO SE TOCA!)
function withWidget(Component) {
  return (
    <>
      <Component />
      <ChatWidget />
    </>
  );
}

export const router = createBrowserRouter([
  // Login / Registro (Público)
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },


  // --- Rutas de ADMIN ---
  { 
    path: "/admin", 
    element: (
      <ProtectedRoute roleRequired="ADMIN">
        {withWidget(AdminHome)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/socios", 
    element: (
      <ProtectedRoute roleRequired="ADMIN">
        {withWidget(Socios)}
      </ProtectedRoute>
    ) 
  },
  // RUTA AGREGADA DE TU VERSIÓN (HEAD)
  { 
    path: "/chatbot-analytics", 
    element: (
      <ProtectedRoute roleRequired="ADMIN">
        {withWidget(ChatbotAnalytics)}
      </ProtectedRoute>
    ) 
  },

  // --- Rutas de SOCIO ---
  { 
    path: "/home", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(Home)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/pagos", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(Pagos)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/disciplinas", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(Disciplinas)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/perfil", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(InfoPersonal)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/acceso", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(Acceso)}
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/certificados", 
    element: (
      <ProtectedRoute roleRequired="SOCIO">
        {withWidget(Certificados)}
      </ProtectedRoute>
    ) 
  },

  // Redirección
  { path: "/socio", element: <Navigate to="/home" replace /> },
]);