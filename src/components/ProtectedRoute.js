import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false }) {
  const { token, user } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user?.rol !== 'administrador') {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;