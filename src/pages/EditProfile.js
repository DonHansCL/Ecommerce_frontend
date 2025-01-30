// src/pages/EditProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function EditProfile() {
  const { token } = useContext(AuthContext);
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
          setNombre(data.user.nombre);
          setTelefono(data.user.telefono || '');
          setDireccion(data.user.direccion || '');
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, telefono, direccion }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Perfil actualizado exitosamente.');
      } else {
        setError(data.error || 'Error al actualizar el perfil.');
      }
    } catch (err) {
      setError('Error de red');
    }
  };

  if (loading) return <div className="text-center mt-8">Cargando...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="w-full p-4">
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 dark:text-white text-center">Editar Perfil</h2>
        {success && <div className="mb-4 text-green-500 text-center">{success}</div>}
        {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Teléfono:</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-2">Dirección:</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-3"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
            Actualizar Perfil
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;