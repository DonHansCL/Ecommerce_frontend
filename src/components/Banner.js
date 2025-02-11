// src/components/Banner.js
import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Link from 'react-router-dom';

function Banner() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-center w-full h-auto p-6 bg-gray-100">
      <div className="md:w-1/2 text-center md:text-left">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">¡Bienvenido a Nuestra Tienda!</h1>
        <p className="text-xl md:text-2xl mb-6">Descubre las mejores ofertas y productos exclusivos.</p>
        <Link
          to="/catalog"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
        >
          Explorar Productos
        </Link>
      </div>
      <div className="md:w-1/2 mt-6 md:mt-0">
        <img
          src="/images/banner1.jpg"
          alt="Hero Banner"
          className="w-full h-auto object-cover rounded-md shadow-lg"
        />
      </div>
    </div>
  );
}

export default Banner;