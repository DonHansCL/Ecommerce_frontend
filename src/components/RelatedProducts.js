import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
function RelatedProducts({ categoriaId, currentProductId }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoriaId) {
      fetchRelated();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriaId]);

  const fetchRelated = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/categories/${categoriaId}/products?limit=4&exclude=${currentProductId}`);
      if (!res.ok) throw new Error('Error al cargar productos relacionados.');
      const data = await res.json();
      setRelated(data);
    } catch (err) {
      console.error(err);
      setError('No se pudieron cargar los productos relacionados.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mt-12 text-center text-gray-700 ">
        Cargando productos relacionados...
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-12 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-lg mx-auto" role="alert">
        {error}
      </div>
    );
  }

  if (related.length === 0) {
    return (
      <div className="mt-12 text-center text-gray-700 ">
        No hay productos relacionados disponibles.
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Productos Relacionados</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((producto) => (
          <ProductCard key={producto.id} product={producto} size="small" />
        ))}
      </div>
    </div>
  );
}

export default RelatedProducts;