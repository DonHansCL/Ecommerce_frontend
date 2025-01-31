import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiChevronDown, FiChevronUp, FiPackage, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import { formatPrice } from '../utils/formatPrice';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AdminOrdersList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/pedidos/all`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await fetch(`${API_URL}/api/pedidos/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ estado: newStatus }),
      });
      if (!res.ok) throw new Error('Error al actualizar el estado');

      const updatedOrder = await res.json();
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, estado: newStatus } : order
      ));
      toast.success('Estado actualizado correctamente');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Calculate order counts
  const orderCounts = {
    pendiente: orders.filter(o => o.estado === 'pendiente').length,
    enviado: orders.filter(o => o.estado === 'enviado').length,
    entregado: orders.filter(o => o.estado === 'entregado').length
  };

  const toggleOrderExpansion = (orderId) => {
    const newExpandedOrders = new Set(expandedOrders);
    if (newExpandedOrders.has(orderId)) {
      newExpandedOrders.delete(orderId);
    } else {
      newExpandedOrders.add(orderId);
    }
    setExpandedOrders(newExpandedOrders);
  };

  const orderStats = {
    total: orders.length,
    pendiente: orders.filter(o => o.estado === 'pendiente').length,
    enviado: orders.filter(o => o.estado === 'enviado').length,
    entregado: orders.filter(o => o.estado === 'entregado').length,
    cancelado: orders.filter(o => o.estado === 'cancelado').length,
    totalVentas: orders.reduce((sum, order) => sum + parseFloat(order.total), 0)
  };

 
  const statusLabels = {
    'pendiente': 'Pendiente',
    'enviado': 'Enviado',
    'entregado': 'Entregado',
    'cancelado': 'Cancelado'
  };

  const statusIcons = {
    'Pendiente': <FiPackage className="w-4 h-4" />,
    'Enviado': <FiTruck className="w-4 h-4" />,
    'Entregado': <FiCheck className="w-4 h-4" />,
    'Cancelado': <FiX className="w-4 h-4" />
  };

  const statusOptions = ['pendiente', 'enviado', 'entregado', 'cancelado'];

  return (
    <div className="space-y-6">
       {/* Dashboard Stats */}
       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-gray-500">Total Pedidos</h4>
          <p className="text-2xl font-bold text-gray-900">{orderStats.total}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-yellow-700">Pendientes</h4>
          <p className="text-2xl font-bold text-yellow-900">{orderStats.pendiente}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-blue-700">Enviados</h4>
          <p className="text-2xl font-bold text-blue-900">{orderStats.enviado}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-green-700">Entregados</h4>
          <p className="text-2xl font-bold text-green-900">{orderStats.entregado}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-red-700">Cancelados</h4>
          <p className="text-2xl font-bold text-red-900">{orderStats.cancelado}</p>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <h4 className="text-sm font-medium text-indigo-700">Total Ventas</h4>
          <p className="text-2xl font-bold text-indigo-900">${formatPrice(orderStats.totalVentas)}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleOrderExpansion(order.id)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900"
                      >
                        {expandedOrders.has(order.id) ? <FiChevronUp className="mr-2" /> : <FiChevronDown className="mr-2" />}
                        #{order.id}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.User?.nombre}</div>
                      <div className="text-sm text-gray-500">{order.User?.correo}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${parseFloat(order.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                          order.estado === 'enviado' ? 'bg-blue-100 text-blue-800' :
                          order.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'}`}>
                        {order.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.estado}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        disabled={updatingOrderId === order.id}
                      >
                        {['pendiente', 'enviado', 'entregado', 'cancelado'].map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                  {expandedOrders.has(order.id) && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-medium text-gray-900">Detalles de Envío</h4>
                              <p className="text-sm text-gray-600">Dirección: {order.direccionEnvio}</p>
                              <p className="text-sm text-gray-600">Método de Pago: {order.metodoPago}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Productos</h4>
                            <div className="space-y-2">
                              {order.items && order.items.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-2 bg-white rounded-lg shadow-sm">
                                  <img
                                    src={`${API_URL}/${item.product.imagenes[0]}`}
                                    alt={item.product.nombre}
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.product.nombre}</p>
                                    <p className="text-sm text-gray-600">
                                      Cantidad: {item.cantidad} x {formatPrice(item.precio)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                      {formatPrice(item.cantidad * item.precio)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersList;