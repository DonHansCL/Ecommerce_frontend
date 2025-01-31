import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { formatPrice } from '../utils/formatPrice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ProductCard({ product, size = 'large' }) {
  const { addToCart, updateQuantity, removeFromCart } = useContext(CartContext);
  const [cantidad, setCantidad] = useState(1);

  const handleAgregarAlCarrito = () => {
    addToCart(product, cantidad);
  };

  const incrementarCantidad = () => {
    if (cantidad < product.cantidadEnStock) {
      setCantidad(cantidad + 1);
    }
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  // Define estilos basados en el tamaño
  const cardClasses =
    size === 'small'
      ? 'bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300'
      : 'bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300';

  const imageClasses =
    size === 'small' ? 'w-full h-40 object-cover rounded-t-lg' : 'w-full h-64 object-cover rounded-t-lg';

  const titleClasses =
    size === 'small' ? 'text-xl font-semibold text-gray-800 mb-2' : 'text-2xl font-semibold text-gray-800 mb-2';

  const descriptionClasses =
    size === 'small'
      ? 'text-gray-500 mb-2 text-sm'
      : 'text-gray-500 mb-4 text-sm flex-1';

  const priceClasses =
    size === 'small'
      ? 'text-lg font-bold text-gray-800'
      : 'text-xl font-bold text-gray-800';

  return (
    <div className={cardClasses}>
      <Link to={`/product/${product.id}`} className="relative">
        <img
          src={`${API_URL}/${product.imagenes[0]}`}
          alt={product.nombre}
          className={imageClasses}
        />
        {/* Icono de Me Gusta */}
        {/* <button
          className="absolute top-2 right-2 bg-white bg-opacity-75 rounded-full p-1 hover:bg-opacity-100 transition"
          onClick={() => {
            // Funcionalidad para me gusta
            // Puedes agregar lógica aquí o pasar una función como prop
            //console.log(`Producto ${product.id} marcado como favorito`);
          }}
        >
          <FaHeart className="h-5 w-5 text-red-500" />
        </button> */}
      </Link>
      <div className="mt-4 px-5 pb-5 flex-1 flex flex-col">
        <Link to={`/product/${product.id}`}>
          <h2 className={titleClasses}>{product.nombre}</h2>
        </Link>
        <p className={descriptionClasses}>
          {product.descripcion
            ? product.descripcion.length > 100
              ? `${product.descripcion.substring(0, 100)}...`
              : product.descripcion
            : 'Descripción breve del producto.'}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className={priceClasses}>{formatPrice(product.precio)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleAgregarAlCarrito}
            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            <FaShoppingCart className="mr-2" />
            Añadir
          </button>
        </div>
        {/* Selector de Cantidad */}
        <div className="flex items-center justify-center mt-4">
          <button
            onClick={decrementarCantidad}
            className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
            disabled={cantidad <= 1}
          >
            <FiMinus />
          </button>
          <span className="mx-3 px-4 py-2 border border-gray-300 rounded-md text-center w-12 bg-gray-50">
            {cantidad}
          </span>
          <button
            onClick={incrementarCantidad}
            className="bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-colors duration-200"
            disabled={cantidad >= product.cantidadEnStock}
          >
            <FiPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;