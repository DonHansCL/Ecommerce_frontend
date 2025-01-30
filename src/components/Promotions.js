// src/components/Promotions.js
import React from 'react';
import { Link } from 'react-router-dom';

function Promotions() {
  const promotions = [
    {
      id: 1,
      title: '50% de Descuento en Electrónicos',
      image: '/uploads/promo1.jpg',
      link: '/categoria/electronica',
    },
    {
      id: 2,
      title: 'Compra 2 y Obtén 1 Gratis en Ropa',
      image: '/uploads/promo2.jpg',
      link: '/categoria/ropa',
    },
    // Agrega más promociones según sea necesario
  ];

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold mb-4 text-center">Ofertas Especiales</h2>
      <div className="flex overflow-x-auto space-x-4 p-4">
        {promotions.map(promo => (
          <Link to={promo.link} key={promo.id} className="min-w-[300px] bg-gray-100 rounded shadow hover:shadow-lg transition-shadow duration-300">
            <img src={`${process.env.REACT_APP_API_URL}${promo.image}`} alt={promo.title} className="w-full h-40 object-cover rounded-t" loading="lazy" />
            <div className="p-4">
              <h3 className="text-lg font-medium">{promo.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Promotions;