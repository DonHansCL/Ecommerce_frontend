import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    id: 1,
    name: 'Carlos Pérez',
    title: 'Gerente de Ventas',
    comment: 'El servicio de atención al cliente es excepcional. Siempre responden mis dudas rápidamente.',
    avatar: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'María Gómez',
    title: 'Diseñadora Gráfica',
    comment: 'Las entregas son puntuales y los productos de alta calidad. Sin duda, una excelente experiencia.',
    avatar: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 3,
    name: 'Juan Rodríguez',
    title: 'Desarrollador Web',
    comment: 'La plataforma es muy fácil de usar y la variedad de productos es impresionante.',
    avatar: 'https://i.pravatar.cc/150?img=3',
  },
  // Agrega más testimonios según sea necesario
];

function Testimonials() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">Testimonios de Clientes</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Conoce lo que nuestros clientes tienen que decir sobre sus experiencias con nosotros.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map(testimonial => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
            >
              <FaQuoteLeft className="w-8 h-8 text-indigo-500 mb-4" />
              <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{testimonial.comment}"</p>
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{testimonial.name}</h3>
              <p className="text-gray-500 dark:text-gray-400">{testimonial.title}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;