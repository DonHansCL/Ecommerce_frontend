import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


function Cart() {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useContext(CartContext);

  const handleQuantityChange = (productId, cantidad) => {
    if (cantidad >= 1) {
      updateQuantity(productId, cantidad);
    }
  };

  const handleRemove = (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto del carrito?')) {
      removeFromCart(productId);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar el carrito?')) {
      clearCart();
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.precio * item.cantidad, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-4xl font-semibold mb-8">Tu Carrito</h2>
        <p>No tienes productos en el carrito.</p>
        <Link to="/catalog" className="text-blue-500 hover:underline">
          Explorar Productos
        </Link>
      </div>
    );
  }

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    removed: { opacity: 0, x: 100, transition: { duration: 0.3 } },
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-semibold mb-8">Tu Carrito</h2>
      <motion.div
        className="overflow-x-auto"
        variants={tableVariants}
        initial="hidden"
        animate="visible"
      >
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-left">Producto</th>
              <th className="py-3 px-6">Precio</th>
              <th className="py-3 px-6">Cantidad</th>
              <th className="py-3 px-6">Subtotal</th>
              <th className="py-3 px-6">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {cartItems.map(item => (
                <motion.tr
                  key={item.product.id}
                  className="border-b hover:bg-gray-50"
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="removed"
                >
                  <td className="py-4 px-6 flex items-center">
                    {item.product.imagenes && item.product.imagenes.length > 0 ? (
                      <img
                        src={`${API_URL}/${item.product.imagenes[0]}`}
                        alt={item.product.nombre}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center rounded mr-4">
                        No Image
                      </div>
                    )}
                    <span className="font-medium">{item.product.nombre}</span>
                  </td>
                  <td className="py-4 px-6 text-center">{formatPrice(item.product.precio)}</td>
                  <td className="py-4 px-6 text-center">
                    <input
                      type="number"
                      value={item.cantidad}
                      min="1"
                      onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                      className="w-20 text-center border rounded-md"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">{formatPrice(item.product.precio * item.cantidad)}</td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash size={20} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>
      <div className="flex justify-end mt-8">
        <div className="w-full md:w-1/3 bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between mb-4">
            <span className="text-xl font-semibold">Total:</span>
            <span className="text-xl font-semibold">{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <button
              onClick={handleClearCart}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition w-full md:w-auto flex items-center justify-center"
            >
              Limpiar Carrito
            </button>
            <Link
              to="/checkout"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition w-full md:w-auto flex items-center justify-center"
            >
              Proceder al Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;