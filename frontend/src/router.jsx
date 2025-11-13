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
import ChatbotAnalytics from "./pages/ChatbotAnalytics";

// Chat IA (widget global excepto en login/register)
import ChatWidget from "./components/ChatWidget/ChatWidget";

// Función envoltorio para añadir el widget a las páginas donde debe mostrarse
function withWidget(Component) {
  return (
    <>
      <Component />
      <ChatWidget />
    </>
  );
}

export const router = createBrowserRouter([
  // Login / Registro
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Admin
  { path: "/admin", element: withWidget(AdminHome) },
  { path: "/chatbot-analytics", element: withWidget(ChatbotAnalytics) },

  // Socio (canon = /home)
  { path: "/home", element: withWidget(Home) },

  // Redirección por si algo todavía navega a /socio
  { path: "/socio", element: <Navigate to="/home" replace /> },

  // Secciones del portal
  { path: "/pagos", element: withWidget(Pagos) },
  { path: "/disciplinas", element: withWidget(Disciplinas) },
  { path: "/perfil", element: withWidget(InfoPersonal) },
  { path: "/acceso", element: withWidget(Acceso) },
  { path: "/certificados", element: withWidget(Certificados) },

  // Admin: gestión de socios
  { path: "/socios", element: withWidget(Socios) },
]);
