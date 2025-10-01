import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { userId } = useAuth();

  const fetchCart = async () => {
    if (!userId) return;
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setCart(data);
      } else if (response.status === 404) {
        setCart({ items: [] }); // Set cart to an empty array if 404 (cart not found)
      } else {
        console.error('Failed to fetch cart', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    }
  };

  const updateCartItemQuantity = async (productId, quantity) => {
    if (!userId) return;
    const loadingToast = toast.loading("Updating cart...");
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });
      if (response.ok) {
        fetchCart();
        toast.success('Cart updated', { id: loadingToast });
      } else {
        toast.error('Failed to update cart', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to update cart', error);
      toast.error('Failed to update cart', { id: loadingToast });
    }
  };

  const removeCartItem = async (productId) => {
    if (!userId) return;
    const loadingToast = toast.loading("Removing item...");
    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCart();
        toast.success('Item removed from cart', { id: loadingToast });
      } else {
        toast.error('Failed to remove item from cart', { id: loadingToast });
      }
    } catch (error) {
      console.error('Failed to remove item from cart', error);
      toast.error('Failed to remove item from cart', { id: loadingToast });
    }
  };


  useEffect(() => {
    fetchCart();
  }, [userId]);

  const value = {
    cart,
    fetchCart,
    updateCartItemQuantity,
    removeCartItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};