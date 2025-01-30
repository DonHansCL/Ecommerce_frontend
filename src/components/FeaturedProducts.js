// src/components/FeaturedProducts.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { CartContext } from '../context/CartContext';
import { FaHeart } from 'react-icons/fa';
import ProductCard from '../components/ProductCard';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products?featured=true`);
      const data = await res.json();
      if (res.ok) {
        setProducts(Array.isArray(data) ? data : []);
      } else {
        console.error('Error al cargar productos destacados:', data.error);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error al cargar productos destacados:', err);
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} size="small" />
          ))
        ) : (
          <div className="text-center text-gray-500 col-span-full">No hay productos destacados disponibles.</div>
        )}
      </div>
    </div>
  );
}

export default FeaturedProducts;