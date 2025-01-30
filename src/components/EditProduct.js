import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function EditProduct({ product, onSuccess, onCancel }) {
  const [nombre, setNombre] = useState(product.nombre);
  const [descripcion, setDescripcion] = useState(product.descripcion);
  const [featured, setFeatured] = useState(product.featured || false);
  const [precio, setPrecio] = useState(product.precio);
  const [cantidadEnStock, setCantidadEnStock] = useState(product.cantidadEnStock);
  const [categoriaId, setCategoriaId] = useState(product.categoriaId);
  const [categorias, setCategorias] = useState([]);
  const [nuevasImagenes, setNuevasImagenes] = useState([]);
  const [error, setError] = useState('');
  const [imagenesExistentes, setImagenesExistentes] = useState(product.imagenes || []);
  const [imagenesAEliminar, setImagenesAEliminar] = useState([]);
  const [especificaciones, setEspecificaciones] = useState(
    product.especificaciones
      ? Object.entries(product.especificaciones).map(([key, value]) => ({ key, value }))
      : [{ key: '', value: '' }]
  );
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Obtener las categorías disponibles
  const fetchCategorias = async () => {
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('No se pudieron cargar las categorías.');
      const data = await res.json();
      setCategorias(data);
    } catch (err) {
      setError('Error al cargar las categorías.');
    }
  };

  useEffect(() => {
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNuevasImagenes((prev) => [...prev, ...files]);
  };

  const handleEliminarImagen = (imagenPath) => {
    setImagenesAEliminar((prev) => [...prev, imagenPath]);
    setImagenesExistentes((prev) => prev.filter((img) => img !== imagenPath));
  };

  const handleAddSpecification = () => {
    setEspecificaciones((prev) => [...prev, { key: '', value: '' }]);
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

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // Si no hay destino, salir
    if (!destination) return;

    // Si la posición no ha cambiado, salir
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Reordenar las imágenes
    const reorderedImages = Array.from(imagenesExistentes);
    const [movedImage] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedImage);

    setImagenesExistentes(reorderedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio || !cantidadEnStock || !categoriaId) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    setIsAddingProduct(true);
    setError('');

    // Filtrar especificaciones válidas y convertir a objeto
    const filteredSpecs = especificaciones.reduce((acc, spec) => {
      if (spec.key && spec.value) {
        acc[spec.key] = spec.value;
      }
      return acc;
    }, {});

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('precio', precio);
    formData.append('cantidadEnStock', cantidadEnStock);
    formData.append('categoriaId', categoriaId);
    formData.append('especificaciones', JSON.stringify(filteredSpecs)); // Enviar como string JSON
    formData.append('featured', featured);
    formData.append('imagenesAEliminar', JSON.stringify(imagenesAEliminar)); // Enviar imágenes a eliminar
    // Añadir el orden de las imágenes existentes
    formData.append('imagenesExistentes', JSON.stringify(imagenesExistentes));
    nuevasImagenes.forEach((img) => {
      formData.append('imagenes', img);
    });

    try {
      const res = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          // No se debe establecer 'Content-Type' cuando se usa FormData
          // el navegador lo hace automáticamente
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Asegúrate de manejar el token adecuadamente
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || 'Error al actualizar el producto.');
        toast.error(errorData.error || 'Error al actualizar el producto.');
        setIsAddingProduct(false);
        return;
      }

      const data = await res.json();
      toast.success('Producto editado exitosamente.');
      onSuccess();
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setIsAddingProduct(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Editar Producto</h2>
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
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
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
                <button
                  type="button"
                  onClick={() => handleRemoveSpecification(index)}
                  className="text-red-500"
                >
                  X
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpecification}
            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Añadir Especificación
          </button>
        </div>

        {/* Imágenes Existentes con Ordenamiento */}
        <div className="mb-4">
          <label className="block text-gray-700">Imágenes Existentes:</label>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="imagenes" direction="horizontal">
              {(provided) => (
                <div
                  className="mt-2 flex space-x-4 overflow-x-auto"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {imagenesExistentes.map((img, index) => {
                    // Genera un ID único sin backslashes
                    const safeDraggableId = `img-${index}-${img.replace(/\\/g, '/')}`;
                    return (
                      <Draggable key={safeDraggableId} draggableId={safeDraggableId} index={index}>
                        {(provided) => (
                          <div
                            className="relative"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <img
                              src={`${API_URL}/${img}`}
                              alt={`Imagen ${index + 1}`}
                              className="w-32 h-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleEliminarImagen(img)}
                              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                            >
                              &times;
                            </button>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Subir Nuevas Imágenes */}
        <div className="mb-4">
          <label className="block text-gray-700">Añadir Nuevas Imágenes:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full"
          />
        </div>
        {/* Previsualización de Nuevas Imágenes */}
        <div className="mb-4 flex flex-wrap">
          {nuevasImagenes.map((file, index) => (
            <div key={index} className="relative mr-2 mb-2">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="w-24 h-24 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() =>
                  setNuevasImagenes((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="mr-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isAddingProduct}
          >
            {isAddingProduct ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;