// src/context/CartContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { token } = useContext(AuthContext);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    if (!token) {
      try {
        const stored = localStorage.getItem('cart');
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.map(item => ({
            ...item,
            product: {
              ...item.product,
              precio: parseFloat(item.product.precio)
            },
            cantidad: parseInt(item.cantidad)
          }));
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
    return [];
  });


  // Función mejorada para actualizar localStorage
  const updateLocalStorage = (items) => {
    try {
      if (!token && items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(items));
      } else if (!token) {
        localStorage.removeItem('cart');
      }
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Función para obtener el carrito del backend o localStorage
  const fetchCart = async () => {
    if (!token) return;
    
    try {
      const res = await fetch(`${API_URL}/api/carts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Error fetching cart');

      const data = await res.json();
      const backendItems = data.cartItems || [];
      
      setCartItems(backendItems.map(item => ({
        id: item.product.id,
        product: {
          ...item.product,
          precio: parseFloat(item.product.precio)
        },
        cantidad: parseInt(item.cantidad)
      })));

    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al obtener el carrito');
    }
  };


  // Función para sincronizar el carrito local con el backend
  const syncWithBackend = async () => {
    if (!token || cartItems.length === 0) return;
    
    setIsSyncing(true);
    try {
      // Obtener el carrito actual del backend
      const res = await fetch(`${API_URL}/api/carts`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await res.json();
      const backendItems = data.cartItems || [];
      
      // Sincronizar cada item del localStorage
      for (const localItem of cartItems) {
        const backendItem = backendItems.find(
          item => item.product.id === localItem.product.id
        );
        
        if (backendItem) {
          // Si existe, actualizar cantidad
          await fetch(`${API_URL}/api/carts/update`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              productoId: localItem.product.id,
              cantidad: backendItem.cantidad + localItem.cantidad
            })
          });
        } else {
          // Si no existe, agregar nuevo
          await fetch(`${API_URL}/api/carts/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              productoId: localItem.product.id,
              cantidad: localItem.cantidad
            })
          });
        }
      }

      localStorage.removeItem('cart');
      await fetchCart();
      toast.success('Carrito sincronizado correctamente', { toastId: 'ok-sync' });
    } catch (error) {
      console.error('Error syncing cart:', error);
      toast.error('Error al sincronizar el carrito');
    } finally {
      setIsSyncing(false);
    }
  };


   // Efecto para sincronización inicial
   useEffect(() => {
    const initializeCart = async () => {
      if (token && !isInitialized) {
        await fetchCart();
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          await syncWithBackend();
        }
        setIsInitialized(true);
      }
    };

    initializeCart();
  }, [token]);

  // Efecto para mantener localStorage actualizado
  useEffect(() => {
    if (!token && !isSyncing) {
      if (cartItems.length > 0) {
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('cart');
      }
    }
  }, [cartItems, token, isSyncing]);


  // Función mejorada para agregar al carrito
  const addToCart = async (product, cantidad = 1) => {
    if (cantidad < 1) {
      toast.error('La cantidad debe ser mayor a 0', { toastId: 'invalid-quantity' });
      return;
    }

    try {
      if (token) {
        const res = await fetch(`${API_URL}/api/carts/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productoId: product.id,
            cantidad
          })
        });

        if (!res.ok) throw new Error('Error adding to cart');
        
        await fetchCart();
      } else {
        setCartItems(prev => {
          const existing = prev.find(item => item.product.id === product.id);
          
          if (existing) {
            return prev.map(item =>
              item.product.id === product.id
                ? { ...item, cantidad: item.cantidad + cantidad }
                : item
            );
          }
          
          return [...prev, {
            id: product.id,
            product: {
              ...product,
              precio: parseFloat(product.precio)
            },
            cantidad
          }];
        });
      }
      
      toast.success('Producto agregado al carrito', { toastId: 'add-success' });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error al agregar al carrito', { toastId: 'add-error' });
    }
  };

  // Función mejorada para actualizar cantidad
  const updateQuantity = async (productId, newCantidad) => {
    if (newCantidad < 1) {
      toast.error('La cantidad debe ser mayor a 0');
      return;
    }

    try {
      if (token) {
        const res = await fetch(`${API_URL}/api/carts/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productoId: productId,
            cantidad: newCantidad
          })
        });

        if (!res.ok) throw new Error('Error updating quantity');
        
        await fetchCart();
      } else {
        setCartItems(prev =>
          prev.map(item =>
            item.product.id === productId
              ? { ...item, cantidad: newCantidad }
              : item
          )
        );
      }
      
      toast.success('Cantidad actualizada', { toastId: 'updated-quantity' });
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Error al actualizar cantidad');
    }
  };

  // Función mejorada para eliminar del carrito
  const removeFromCart = async (productId) => {
    try {
      if (token) {
        const res = await fetch(`${API_URL}/api/carts/remove/${productId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error('Error removing from cart');
        
        await fetchCart();
      } else {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
      }
      
      toast.success('Producto eliminado del carrito', { toastId: 'remove-success' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Error al eliminar del carrito');
    }
  };

  // Función mejorada para limpiar carrito
  const clearCart = async () => {
    try {
      if (token) {
        const res = await fetch(`${API_URL}/api/carts/clear`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Error al limpiar el carrito en el backend.');
        }

        setCartItems([]);
        toast.success('Carrito limpiado correctamente.', { toastId: 'clear-success' });
      } else {
        setCartItems([]);
        updateLocalStorage([]);
        toast.success('Carrito limpiado correctamente.', { toastId: 'clear-success' });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Error al limpiar el carrito.', { toastId: 'clear-error' });
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isSyncing
    }}>
      {children}
    </CartContext.Provider>
  );
}