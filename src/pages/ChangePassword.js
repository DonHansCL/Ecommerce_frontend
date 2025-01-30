import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ChangePassword() {
  const { token } = useContext(AuthContext);
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para mostrar/ocultar contraseñas
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  // Reset on mount and cleanup on unmount
  useEffect(() => {   
    setContraseñaActual('');
    
    return () => {
      setContraseñaActual('');
    };
  }, []);

  // Check if browser is autofilling
  useEffect(() => {
    const input = document.querySelector('input[type="password"]');
    if (input) {
      // Force clear any autofill
      input.value = '';
    }
  }, []);

  // Clear any stored password data
  useEffect(() => {
    localStorage.removeItem('currentPassword');
    sessionStorage.removeItem('currentPassword');
  }, []);


  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!contraseñaActual || !nuevaContraseña || !confirmarContraseña) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (!validatePassword(nuevaContraseña)) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (nuevaContraseña !== confirmarContraseña) {
      setError('Las nuevas contraseñas no coinciden.');
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ contraseñaActual, nuevaContraseña }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message);
        setError('');
        setContraseñaActual('');
        setNuevaContraseña('');
        setConfirmarContraseña('');
        toast.success(data.message);
      } else {
        setError(data.error || 'Error al actualizar la contraseña.');
        setSuccess('');
      }
    } catch (err) {
      setError('Error de red');
      setSuccess('');
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4">
    <div className="max-w-md w-full bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Cambiar Contraseña</h2>
      {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
      {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
      <form onSubmit={handleChangePassword} className="space-y-6">
        {/* Contraseña Actual */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Contraseña Actual:</label>
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={contraseñaActual}
            onChange={(e) => setContraseñaActual(e.target.value)}
            required
            className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 pr-10"
          />
          <span 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Nueva Contraseña */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Nueva Contraseña:</label>
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={nuevaContraseña}
            onChange={(e) => setNuevaContraseña(e.target.value)}
            required
            className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 pr-10"
          />
          <span 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirmar Nueva Contraseña */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Confirmar Nueva Contraseña:</label>
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
            className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3 pr-10"
          />
          <span 
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
          Actualizar Contraseña
        </button>
      </form>
    </div>
  </div>
  );
}

export default ChangePassword;