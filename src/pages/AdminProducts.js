// src/pages/AdminProducts.js
import React, { useEffect, useState } from 'react';
import AdminProductsList from '../components/AdminProductsList';
import AddProduct from '../components/AddProduct';
import EditProduct from '../components/EditProduct';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Función para obtener todos los productos
  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/products`);
      if (!res.ok) {
        throw new Error('No se pudieron cargar los productos.');
      }
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Función para manejar la eliminación de un producto
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Asegúrate de manejar el token adecuadamente
        },
      });
      const data = await res.json();
      if (res.ok) {
        fetchProducts();
      } else {
        alert(data.error || 'Error al eliminar el producto.');
      }
    } catch (err) {
      alert('Error al eliminar el producto.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Gestionar Productos</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {isAdding ? (
        <AddProduct onSuccess={() => { setIsAdding(false); fetchProducts(); }} onCancel={() => setIsAdding(false)} />
      ) : editingProduct ? (
        <EditProduct
          product={editingProduct}
          onSuccess={() => { setEditingProduct(null); fetchProducts(); }}
          onCancel={() => setEditingProduct(null)}
        />
      ) : (
        <>
          <button
            onClick={() => setIsAdding(true)}
            className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Añadir Nuevo Producto
          </button>
          {loading ? (
            <div>Cargando productos...</div>
          ) : (
            <AdminProductsList
              products={products}
              onEdit={(product) => setEditingProduct(product)}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default AdminProducts;