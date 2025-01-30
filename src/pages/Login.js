// src/pages/Login.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaUserPlus } from 'react-icons/fa';
import logo from '../images/logo.png';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


function Login() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!correo || !contraseña) {
      setError('Ambos campos son requeridos.');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contraseña }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        login(data.token);
        navigate('/');
      } else {
        setError(data.error || 'Error al iniciar sesión.');
      }
    } catch (err) {
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo sutil y elegante */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-200 opacity-75"></div>

      {/* Contenedor del formulario */}
      <div className="relative w-full max-w-md px-6 py-6 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo de la ecommerce" className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">Iniciar Sesión</h2>

        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
          {/* Campo de correo */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <div className="relative">
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu correo"
              />
              <FaEnvelope className="absolute left-3 top-2.5 sm:top-3 text-gray-400" />
            </div>
          </div>

          {/* Campo de contraseña */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
              <input
                type="password"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu contraseña"
              />
              <FaLock className="absolute left-3 top-2.5 sm:top-3 text-gray-400" />
            </div>
          </div>

          {/* Botón de inicio de sesión */}
          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        {/* Enlace de registro */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿No tienes una cuenta?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-500 flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" /> Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;