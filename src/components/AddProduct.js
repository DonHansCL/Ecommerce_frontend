import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AddProduct({ onSuccess, onCancel }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState(''); 
  const [precio, setPrecio] = useState('');
  const [cantidadEnStock, setCantidadEnStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [featured, setFeatured] = useState(false); 
  const [error, setError] = useState('');
  const [previewImages, setPreviewImages] = useState([]);
  const [especificaciones, setEspecificaciones] = useState([{ key: '', value: '' }]);

  // Obtener las categorías disponibles
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`);
      if (!res.ok) {
        throw new Error('No se pudieron cargar las categorías.');
      }
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
    // Crear URLs de previsualización
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleAddSpecification = () => {
    setEspecificaciones([...especificaciones, { key: '', value: '' }]);
  };

  const handleSpecificationChange = (index, field, value) => {
    const newSpecs = [...especificaciones];
    newSpecs[index][field] = value;
    setEspecificaciones(newSpecs);
  };

  const handleRemoveSpecification = (index) => {
    const newSpecs = [...especificaciones];
    newSpecs.splice(index, 1);
    setEspecificaciones(newSpecs);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!nombre || !descripcion || !precio || !cantidadEnStock || !categoriaId) {
      setError('Todos los campos son requeridos.');
      return;
    }

    if (isNaN(precio) || parseFloat(precio) <= 0) {
      setError('El precio debe ser un número positivo.');
      return;
    }

    if (!Number.isInteger(parseFloat(cantidadEnStock)) || parseInt(cantidadEnStock) < 0) {
      setError('La cantidad en stock debe ser un número entero no negativo.');
      return;
    }

     // Filtrar especificaciones válidas
     const filteredSpecs = especificaciones.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {});

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion); // Usar el estado de descripción
    formData.append('precio', parseFloat(precio));
    formData.append('cantidadEnStock', parseInt(cantidadEnStock));
    formData.append('categoriaId', parseInt(categoriaId));
    formData.append('especificaciones', JSON.stringify(filteredSpecs));
    formData.append('featured', featured);

    for (let i = 0; i < imagenes.length; i++) {
      formData.append('imagenes', imagenes[i]);
    }

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Producto añadido exitosamente.');
        onSuccess();
      } else {
        toast.error(data.error || 'Error al añadir el producto.');
      }
    } catch (err) {
      setError('Error al añadir el producto.');
    }
    previewImages.forEach(url => URL.revokeObjectURL(url));
  };


  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Añadir Nuevo Producto</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Campos de Producto */}
        <div className="mb-4">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descripción:</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Precio:</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Cantidad en Stock:</label>
          <input
            type="number"
            value={cantidadEnStock}
            onChange={(e) => setCantidadEnStock(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Categoría:</label>
          <select
            value={categoriaId}
            onChange={(e) => setCategoriaId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Selecciona una Categoría</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="form-checkbox h-5 w-5 text-indigo-600"
            />
            <span className="ml-2 text-gray-700">Producto Destacado</span>
          </label>
        </div>

        {/* Especificaciones del Producto */}
        <div className="mb-4">
          <label className="block text-gray-700">Especificaciones:</label>
          {especificaciones.map((spec, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                placeholder="Clave"
                value={spec.key}
                onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded mr-2"
              />
              <input
                type="text"
                placeholder="Valor"
                value={spec.value}
                onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                className="w-1/2 p-2 border border-gray-300 rounded mr-2"
              />
              {especificaciones.length > 1 && (
                <button type="button" onClick={() => handleRemoveSpecification(index)} className="text-red-500">
                  X
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddSpecification} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
            Añadir Especificación
          </button>
        </div>

        {/* Subir Imágenes */}
        <div className="mb-4">
          <label className="block text-gray-700">Imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>
        {/* Previsualización de Imágenes */}
        <div className="mb-4 flex flex-wrap">
          {previewImages.map((src, index) => (
            <img key={index} src={src} alt={`Preview ${index}`} className="w-24 h-24 object-cover mr-2 mb-2" />
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <button type="button" onClick={onCancel} className="mr-4 bg-gray-500 text-white px-4 py-2 rounded">
            Cancelar
          </button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Añadir Producto
          </button>
        </div>
      </form>
    </div>
  );
}


export default AddProduct;