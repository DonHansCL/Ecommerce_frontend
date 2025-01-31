// src/pages/Checkout.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';


function Checkout() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [direccion, setDireccion] = useState('');
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null); 
  const [error, setError] = useState('');

  // Calculate total
  const total = cartItems.reduce((sum, item) => 
    sum + (item.product.precio * item.cantidad), 0
  ).toFixed(2);

  // Verificar carrito vacío
  useEffect(() => {
    if ((!cartItems || cartItems.length === 0) && !order) {
      navigate('/cart'); // Redirigir a la página del carrito si está vacío y no hay Pedido
    }
  }, [cartItems, navigate, order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!direccion.trim()) {
        throw new Error('La dirección es requerida');
      }

      const res = await fetch(`${API_URL}/api/pedidos/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          direccionEnvio: direccion,
          metodoPago
        })
      });

      const data = await res.json();
    
      if (!res.ok) {
        throw new Error(data.error || 'Error al procesar el pedido');
      }

      // Set the order details for confirmation
      setOrder(data.order);
      clearCart(); // Clear the cart after successful order
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // 1. First priority - Order confirmation
  if (order) {
    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">¡Pedido Confirmado!</h2>
        <p className="mb-4">Gracias por tu compra. Aquí tienes un resumen de tu pedido:</p>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-4">Detalles del Pedido</h3>
          <p><strong>ID del Pedido:</strong> {order.id}</p>
          <p><strong>Dirección de Envío:</strong> {order.direccionEnvio}</p>
          <p><strong>Método de Pago:</strong> {order.metodoPago}</p>
          <p><strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}</p>
          <p><strong>Estado:</strong> {order.estado}</p>
          <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        <h3 className="text-xl font-semibold mb-4">Resumen de Productos</h3>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            {order.items && order.items.length > 0 ? (
              order.items.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center">
                    <img
                      src={`${API_URL}/${item.product.imagenes[0]}`}
                      alt={item.product.nombre}
                      className="w-12 h-12 object-cover rounded mr-4"
                    />
                    <div>
                      <p className="font-medium">{item.product.nombre}</p>
                      <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.precio * item.cantidad)}</p>
                </div>
              ))
            ) : (
              <p>No hay ítems en este pedido.</p>
            )}
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/orders')}
          className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Ver Mis Pedidos
        </button>
      </div>
    );
  }

  // 2. Second priority - Empty cart message
  if ((!cartItems || cartItems.length === 0) && !order) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Tu carrito está vacío</h2>
        <p className="text-gray-600 mb-8">¿Qué tal si agregas algunos productos?</p>
        <button
          onClick={() => navigate('/products')}
          className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200 text-lg"
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  // 3. Default - Checkout form
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Finalizar Compra</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Información de Envío</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Dirección de Envío</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Ingresa tu dirección completa"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="tarjeta">Tarjeta de Crédito</option>
                <option value="paypal">PayPal</option>
                <option value="efectivo">Efectivo</option>
              </select>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
            >
              {loading ? 'Procesando...' : 'Confirmar Pedido'}
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Resumen del Pedido</h3>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center">
                  <img
                    src={`${API_URL}/${item.product.imagenes[0]}`}
                    alt={item.product.nombre}
                    className="w-12 h-12 object-cover rounded mr-4"
                  />
                  <div>
                    <p className="font-medium">{item.product.nombre}</p>
                    <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                  </div>
                </div>
                <p className="font-medium">{formatPrice(item.product.precio * item.cantidad)}</p>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;