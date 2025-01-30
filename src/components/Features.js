import React from 'react';
import { FaShippingFast, FaHeadset, FaUndo } from 'react-icons/fa';

function Features() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white">¿Por qué elegirnos?</h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ofrecemos servicios de primera clase para garantizar tu mejor experiencia de compra.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Envío Rápido */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg transition-transform transform hover:scale-105">
            <FaShippingFast className="w-16 h-16 text-teal-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Envío Rápido</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Recibe tus productos en tiempo récord con nuestro servicio de envío exprés, garantizando la satisfacción inmediata.
            </p>
          </div>
          
          {/* Atención 24/7 */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg transition-transform transform hover:scale-105">
            <FaHeadset className="w-16 h-16 text-blue-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Atención 24/7</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Nuestro equipo de soporte está disponible las 24 horas del día para asistirte en cualquier consulta o inconveniente.
            </p>
          </div>
          
          {/* Devoluciones Gratis */}
          <div className="flex flex-col items-center p-8 bg-white dark:bg-gray-700 rounded-xl shadow-lg transition-transform transform hover:scale-105">
            <FaUndo className="w-16 h-16 text-red-500 mb-6" />
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">Devoluciones Gratis</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Cambia o devuelve tus productos sin costo alguno dentro del plazo establecido, garantizando tu tranquilidad.
            </p>
          </div>
          
        </div>
      </div>
    </section>
  );
}

export default Features;