// src/pages/Profile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Profile() {
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
        } else {
          setError(data.error || 'Error al obtener el perfil.');
        }
      } catch (err) {
        setError('Error de red');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) return <div className="text-center mt-8">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Perfil de Usuario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Nombre:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200">{user.nombre}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Correo:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200">{user.correo}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Teléfono:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200">{user.telefono || 'No proporcionado'}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Dirección:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200">{user.direccion || 'No proporcionado'}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Rol:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200 capitalize">{user.rol}</p>
          </div>
          <div>
            <span className="block text-sm font-medium text-gray-500 dark:text-gray-300">Fecha de Registro:</span>
            <p className="mt-1 text-lg text-gray-700 dark:text-gray-200">{new Date(user.fechaRegistro).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link to="/dashboard/edit-profile" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md shadow hover:bg-indigo-700 transition">
            Editar Perfil
          </Link>
        </div>
      </div>
    </div>
);
}

export default Profile;