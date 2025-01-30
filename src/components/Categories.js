// src/components/Categories.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null); // Estado para manejar errores

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/categories`);
      const data = await res.json();
      if (res.ok) {        
        setCategories(data);
      } else {
        console.error('Error al obtener las categorías:', data.error);
        setError(data.error);
      }
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError('Error al cargar categorías');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="py-12 bg-gray-50">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">Categorías</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/catalog?category=${category.id}`}
            className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <div className="relative">
              <img
                src={`${process.env.REACT_APP_API_URL}/uploads/categories/${category.imagen}`}
                alt={category.nombre}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <FiArrowRight className="text-white text-3xl" />
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{category.nombre}</h3>
              <button className="mt-auto text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                Ver más
                <FiArrowRight className="ml-1" />
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>

    {/* Loader Styles */}
    <style jsx>{`
      .loader {
        border-top-color: #3498db;
        animation: spinner 1.5s linear infinite;
      }

      @keyframes spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </section>
  );
}

export default Categories;