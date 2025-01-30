// src/components/AdminRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { token } = useContext(AuthContext);

  // Lógica para verificar si el usuario es administrador
  const isAdmin = () => {
    if (!token) return false;
    // Decodificar el token para obtener el rol (asumiendo que el token contiene el rol)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol === 'administrador';
  };

  return isAdmin() ? children : <Navigate to="/login" />;
}

export default AdminRoute;