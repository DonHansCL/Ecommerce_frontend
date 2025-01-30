// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
//import { CartContext } from './CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch('http://localhost:5000/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
    
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const data = await res.json();
            if (res.ok) {
              setUser(data.user);
              
            } else {
              throw new Error(data.error || 'Error al obtener los datos del usuario.');
            }
          } else {
            throw new Error('Respuesta no válida del servidor.');
          }
        } catch (err) {
          console.error(err);
          logout();
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  const logout = () => {
    setToken('');
    setUser(null);
    //clearCart();
    localStorage.removeItem('token');
    navigate('/'); // Redirigir al inicio u otra página
    toast.success('Has cerrado sesión.');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}