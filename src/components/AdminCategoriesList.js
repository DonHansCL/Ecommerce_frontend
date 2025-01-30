// src/components/AdminCategoriesList.js
import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import { toast } from 'react-toastify';
import Modal from './Modal';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminCategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        throw new Error('No se pudieron cargar las categorías.');
      }
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return;

    try {
      const res = await fetch(`${API_URL}/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Categoría eliminada exitosamente.');
        fetchCategories();
      } else {
        toast.error(data.error || 'Error al eliminar la categoría.');
      }
    } catch (err) {
      toast.error('Error al eliminar la categoría.');
    }
  };

  const handleAddCategorySuccess = () => {
    setIsAdding(false);
    fetchCategories();
  };

  const handleEditCategorySuccess = () => {
    setEditingCategory(null);
    fetchCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Categorías</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
          <FiPlus className="w-5 h-5 mr-2" />
          Añadir Nueva Categoría
        </button>
      </div>

      {/* Modals */}
      <Modal isOpen={isAdding} closeModal={() => setIsAdding(false)} title="Añadir Nueva Categoría">
        <AddCategory
          onSuccess={handleAddCategorySuccess}
          onCancel={() => setIsAdding(false)}
        />
      </Modal>

      <Modal isOpen={!!editingCategory} closeModal={() => setEditingCategory(null)} title="Editar Categoría">
        <EditCategory
          category={editingCategory}
          onSuccess={handleEditCategorySuccess}
          onCancel={() => setEditingCategory(null)}
        />
      </Modal>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Imagen
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.length > 0 ? (
                  categories.map(category => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.nombre}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{category.descripcion}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.imagen ? (
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              src={`${API_URL}/uploads/categories/${category.imagen}`}
                              alt={category.nombre}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <FiEdit className="w-4 h-4 mr-1" />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FiTrash2 className="w-4 h-4 mr-1" />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay categorías disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCategoriesList;