// src/pages/Register.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarker, FaLock, FaUserPlus } from 'react-icons/fa';
import logo from '../images/logo.png';


function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    // Al menos 6 caracteres
    return password.length >= 6;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nombre || !correo || !contraseña|| !telefono || !direccion) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (!validateEmail(correo)) {
      setError('Formato de correo inválido.');
      return;
    }

    if (!validatePassword(contraseña)) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contraseña, telefono, direccion }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setError('');
        // Opcional: Iniciar sesión automáticamente o redirigir al usuario
      } else {
        setError(data.error);
        setSuccess('');
      }
    } catch (err) {
      setError('Error de red');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Contenedor del formulario */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl transform transition-all hover:scale-105 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo de la ecommerce" className="w-20 h-20 sm:w-24 sm:h-24" />
        </div>

        {/* Título */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">Registro</h2>

        {/* Mensajes de error y éxito */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            {success}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
          {/* Campo de nombre */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <div className="relative">
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu nombre"
              />
              <FaUser className="absolute left-3 top-2.5 sm:top-3 text-gray-400" />
            </div>
          </div>

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

          {/* Campo de teléfono */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <div className="relative">
              <input
                type="text"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu teléfono"
              />
              <FaPhone className="absolute left-3 top-2.5 sm:top-3 text-gray-400" />
            </div>
          </div>

          {/* Campo de dirección */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <div className="relative">
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ingresa tu dirección"
              />
              <FaMapMarker className="absolute left-3 top-2.5 sm:top-3 text-gray-400" />
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

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 sm:py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Registrarse
            </button>
          </div>
        </form>

        {/* Enlace de inicio de sesión */}
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-500 flex items-center justify-center"
            >
              <FaUserPlus className="mr-2" /> Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;