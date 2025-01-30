// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import AdminProductsList from '../components/AdminProductsList';
import AdminCategoriesList from '../components/AdminCategoriesList';
import AdminOrdersList from '../components/AdminOrdersList';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';
import { FaBox, FaList, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';

function AdminPanel() {
  const [activeTab, setActiveTab] = useState('productos');
  
  // Estado para Productos
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    setLoadingProducts(true);
    setErrorProducts('');
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) {
        throw new Error('No se pudieron cargar los productos.');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setErrorProducts(err.message);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para manejar la eliminación de un producto
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Producto eliminado exitosamente.');
        fetchProducts();
      } else {
        toast.error(data.error || 'Error al eliminar el producto.');
      }
    } catch (err) {
      toast.error('Error al eliminar el producto.');
    }
  };

  // Funciones para manejar añadir y editar productos
  const handleAddProductSuccess = () => {
    setIsAddingProduct(false);
    fetchProducts();
  };

  const handleEditProductSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'productos':
        return (
          <div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              Añadir Nuevo Producto
            </button>
  
            {isAddingProduct && (
              <Modal 
                isOpen={isAddingProduct}
                closeModal={() => setIsAddingProduct(false)}
                title="Añadir Nuevo Producto"
              >
                <AddProduct
                  onSuccess={handleAddProductSuccess}
                  onCancel={() => setIsAddingProduct(false)}
                />
              </Modal>
            )}
  
            {editingProduct && (
              <Modal
                isOpen={!!editingProduct}
                closeModal={() => setEditingProduct(null)}
                title="Editar Producto"
              >
                <EditProduct
                  product={editingProduct}
                  onSuccess={handleEditProductSuccess}
                  onCancel={() => setEditingProduct(null)}
                />
              </Modal>
            )}
  
            {loadingProducts ? (
              <div>Cargando productos...</div>
            ) : errorProducts ? (
              <div className="text-red-500">{errorProducts}</div>
            ) : (
              <AdminProductsList
                products={products}
                onEdit={(product) => setEditingProduct(product)}
                onDelete={handleDeleteProduct}
              />
            )}
          </div>
        );
      case 'categorias':
        return <AdminCategoriesList />;
      case 'pedidos':
        return <AdminOrdersList />;
      default:
        return <AdminProductsList />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100  admin-panel relative">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
        </div>
        <nav className="mt-10">
          <button
            onClick={() => setActiveTab('productos')}
            className={`w-full text-left px-6 py-2 mt-2 flex items-center hover:bg-blue-100 ${
              activeTab === 'productos' ? 'bg-blue-200' : ''
            }`}
          >
            <FaBox className="w-5 h-5 mr-3 text-blue-500" />
            Productos
          </button>
          <button
            onClick={() => setActiveTab('categorias')}
            className={`w-full text-left px-6 py-2 mt-2 flex items-center hover:bg-green-100 ${
              activeTab === 'categorias' ? 'bg-green-200' : ''
            }`}
          >
            <FaList className="w-5 h-5 mr-3 text-green-500" />
            Categorías
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`w-full text-left px-6 py-2 mt-2 flex items-center hover:bg-yellow-100 ${
              activeTab === 'pedidos' ? 'bg-yellow-200' : ''
            }`}
          >
            <FaShoppingCart className="w-5 h-5 mr-3 text-yellow-500" />
            Pedidos
          </button>
        </nav>
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 p-6">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default AdminPanel;