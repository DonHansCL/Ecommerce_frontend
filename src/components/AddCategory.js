import React, { useState } from 'react';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AddCategory({ onSuccess, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState(null); 
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre || !descripcion) {
      setError('Todos los campos son requeridos.');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    if (imagen) {
      formData.append('imagen', imagen);
    }

    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData, // Enviar FormData en lugar de JSON
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Categoría añadida exitosamente.');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al añadir la categoría.');
      }
    } catch (err) {
      setError('Error al añadir la categoría.');
      console.error('Error al añadir la categoría:', err);
    }
  };

  return (
    <div className="border p-4 rounded mt-8">
      <h3 className="text-lg font-semibold mb-4">Añadir Nueva Categoría</h3>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block">Imagen:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Añadir Categoría
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;