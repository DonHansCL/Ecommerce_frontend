import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

function AdminProductsList({ products, onEdit, onDelete }) {

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Obtener categorías para el filtro
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/categories');
        if (!res.ok) throw new Error('No se pudieron cargar las categorías.');
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    // Filtrar y ordenar productos
    let updatedProducts = [...products];

    if (selectedCategory) {
      updatedProducts = updatedProducts.filter(
        (product) => product.categoriaId === parseInt(selectedCategory)
      );
    }

    if (sortOption === 'name_asc') {
      updatedProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortOption === 'name_desc') {
      updatedProducts.sort((a, b) => b.nombre.localeCompare(a.nombre));
    } else if (sortOption === 'price_asc') {
      updatedProducts.sort((a, b) => parseFloat(a.precio) - parseFloat(b.precio));
    } else if (sortOption === 'price_desc') {
      updatedProducts.sort((a, b) => parseFloat(b.precio) - parseFloat(a.precio));
    }

    setFilteredProducts(updatedProducts);
  }, [products, sortOption, selectedCategory]);

  const renderSpecifications = (specs) => {
    if (!specs || Object.keys(specs).length === 0) return 'N/A';
    
    return (
      <div className="space-y-1">
        {Object.entries(specs).map(([key, value]) => (
          <div key={key} className="flex items-center text-sm">
            <span className="font-medium text-gray-600 min-w-[100px]">{key}:</span>
            <span className="text-gray-800">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Filtros y Ordenamiento */}
      <div className="p-4 flex justify-between items-center">
        {/* Filtrado por Categoría */}
        <div>
          <label htmlFor="category" className="mr-2 font-medium text-gray-700">
            Filtrar por Categoría:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Todas</option>
            {categories.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenamiento */}
        <div>
          <label htmlFor="sort" className="mr-2 font-medium text-gray-700">
            Ordenar por:
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="">Seleccionar</option>
            <option value="name_asc">Nombre Ascendente</option>
            <option value="name_desc">Nombre Descendente</option>
            <option value="price_asc">Precio Ascendente</option>
            <option value="price_desc">Precio Descendente</option>
          </select>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Producto
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Detalles
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Especificaciones
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-16 w-16 flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        src={`http://localhost:5000/${product.imagenes?.[0] || 'default.jpg'}`}
                        alt={product.nombre}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.nombre}</div>
                      <div className="text-sm text-gray-500">ID: {product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    <div>Precio: ${product.precio}</div>
                    <div>Stock: {product.cantidadEnStock}</div>
                    <div className="text-sm text-gray-500">
                      Categoría: {product.Category?.nombre || 'N/A'}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-xs overflow-hidden">
                    {renderSpecifications(product.especificaciones)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                    >
                      <FiEdit className="w-4 h-4 mr-1" />
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(product.id)}
                      className="text-red-600 hover:text-red-900 flex items-center"
                    >
                      <FiTrash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductsList;