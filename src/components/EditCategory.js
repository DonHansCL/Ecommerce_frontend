// src/components/EditCategory.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EditCategory({ category, onSuccess, onCancel }) {
  const [nombre, setNombre] = useState(category ? category.nombre : '');
  const [descripcion, setDescripcion] = useState(category ? category.descripcion : '');
  const [imagen, setImagen] = useState(null); // Nuevo estado para la imagen
  const [error, setError] = useState('');

  if (!category) return null;

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
      const res = await fetch(`${API_URL}/api/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData, // Enviar FormData
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Categoría actualizada exitosamente.');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al actualizar la categoría.');
      }
    } catch (err) {
      setError('Error al actualizar la categoría.');
      console.error('Error al actualizar la categoría:', err);
    }
  };

  return (
    <div className="border p-4 rounded mt-8">
      <h3 className="text-lg font-semibold mb-4">Editar Categoría</h3>
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
        {category.imagen && (
          <div>
            <p>Imagen Actual:</p>
            <img 
              src={`${API_URL}/uploads/categories/${category.imagen}`} 
              alt={category.nombre} 
              className="w-32 h-32 object-cover mb-2 rounded" 
            />
          </div>
        )}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Actualizar Categoría
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditCategory;