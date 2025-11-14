import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, roleRequired }) {
  
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); 

  if (!token) {
    return <Navigate to="/" replace />; 
  }

  if (roleRequired) {
    if (userRole !== roleRequired) {
      const redirectTo = userRole === 'SOCIO' ? '/home' : '/admin';
      return <Navigate to={redirectTo} replace />;
    }
  }
  
  return children;
}

export default ProtectedRoute;