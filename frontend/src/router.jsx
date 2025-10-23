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

// Admin
import AdminHome from "./pages/AdminHome";

export const router = createBrowserRouter([
  // Login / Registro
  { path: "/", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Admin
  { path: "/admin", element: <AdminHome /> },

  // Socio (canon = /home)
  { path: "/home", element: <Home /> },

  // Redirección por si algo todavía navega a /socio
  { path: "/socio", element: <Navigate to="/home" replace /> },

  // Secciones del portal
  { path: "/pagos", element: <Pagos /> },
  { path: "/disciplinas", element: <Disciplinas /> },
  { path: "/perfil", element: <InfoPersonal /> },
  { path: "/acceso", element: <Acceso /> },

  // Admin: gestión de socios
  { path: "/socios", element: <Socios /> },
]);
