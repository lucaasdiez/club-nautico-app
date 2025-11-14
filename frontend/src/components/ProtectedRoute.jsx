import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../services/api';

function ProtectedRoute({ children, roleRequired }) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    const validateToken = async () => {
      // Si no hay token, no está autenticado
      if (!token) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      try {
        // Intentar hacer una petición autenticada para validar el token
        if (userRole === 'ADMIN') {
          // Para admin, validar con el endpoint de listar socios
          await api.get('/socios');
        } else if (userRole === 'SOCIO') {
          // Para socio, validar con su propio perfil
          const username = localStorage.getItem('userUsername');
          if (!username) {
            throw new Error('Username no encontrado');
          }
          await api.get(`/socios/socio/${username}`);
        } else {
          // Si el rol no es reconocido, no está autenticado
          throw new Error('Rol no reconocido');
        }
        
        // Si llegamos aquí, el token es válido
        setIsAuthenticated(true);
      } catch (error) {
        console.error('❌ Token inválido, expirado o rol incorrecto:', error);
        // Token inválido o expirado - limpiar localStorage
        localStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, [token, userRole]);

  // Mientras se valida el token, mostrar loading
  if (isValidating) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p>Validando sesión...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si se requiere un rol específico, verificar
  if (roleRequired && userRole !== roleRequired) {
    const redirectTo = userRole === 'SOCIO' ? '/home' : '/admin';
    return <Navigate to={redirectTo} replace />;
  }
  
  return children;
}

export default ProtectedRoute;