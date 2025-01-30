// frontend/src/pages/Orders.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Orders() {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/pedidos`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data);
      } else {
        throw new Error(data.error || 'Error al cargar los pedidos.');
      }
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-500';
      case 'Enviado':
        return 'bg-blue-500';
      case 'Entregado':
        return 'bg-green-500';
      case 'Cancelado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="w-full p-4 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Tus Pedidos</h2>
      {loading ? (
        <div className="text-center text-gray-500">Cargando pedidos...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-500">No has realizado ningún pedido.</div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-white shadow-xl rounded-lg overflow-hidden">
              {/* Encabezado del Pedido */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-indigo-100 px-6 py-4">
                <div>
                  <h3 className="text-2xl font-semibold text-indigo-700">Pedido #{order.id}</h3>
                  <p className="text-gray-600 mt-1">Fecha: {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
                </div>
                <span className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-white text-sm ${getStatusColor(order.estado)}`}>
                  {order.estado}
                </span>
              </div>

              {/* Detalles del Pedido */}
              <div className="px-4 sm:px-6 py-2 sm:py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700"><strong>Dirección de Envío:</strong> {order.direccionEnvio}</p>
                    <p className="text-gray-700"><strong>Método de Pago:</strong> {order.metodoPago}</p>
                    <p className="text-gray-700"><strong>Total:</strong> <span className="text-indigo-600">${order.total}</span></p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700"><strong>Cliente:</strong> {order.User ? order.User.nombre : 'N/A'}</p>
                    {/* Puedes agregar más información del cliente si es necesario */}
                  </div>
                </div>
                <div className="mt-6">
                  <h4 className="text-xl font-semibold mb-3 text-indigo-600">Productos:</h4>
                  <div className="space-y-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map(item => (
                        <div key={item.id} className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 border-b pb-4">
                          <img
                            src={item.product && item.product.imagenes.length > 0
                              ? `${API_URL}/${item.product.imagenes[0]}`
                              : '/default-product.png'}
                            alt={item.product ? item.product.nombre : 'Producto'}
                            className="w-16 h-16 object-cover rounded shadow-md"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{item.product ? item.product.nombre : 'N/A'}</p>
                            <p className="text-gray-600">Cantidad: {item.cantidad}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-indigo-600">${item.precio}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No hay productos en este pedido.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;