// frontend/src/services/orderService.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const createOrder = async (pedido, token) => {
  const res = await fetch(`${API_URL}/pedidos/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(pedido),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al crear el pedido.');
  }
  return data;
};

export const getOrders = async (token) => {
  const res = await fetch(`${API_URL}/pedidos`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al obtener los pedidos.');
  }
  return data;
};