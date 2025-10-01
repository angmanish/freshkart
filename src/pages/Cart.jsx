import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

export default function Cart() {
  const { cart, updateCartItemQuantity, removeCartItem } = useCart();
  const cartItems = cart ? cart.items : [];

  const handleQuantityChange = (productId, delta) => {
    const item = cartItems.find((item) => item.productId._id === productId);
    if (item) {
      const newQuantity = item.quantity + delta;
      if (newQuantity > 0) {
        updateCartItemQuantity(productId, newQuantity);
      } else {
        removeCartItem(productId);
      }
    }
  };

  const handleRemoveItem = (productId) => {
    removeCartItem(productId);
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!cart) {
    return <div>Loading cart...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 text-center"
      >
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <p className="text-xl">Your cart is empty.</p>
        <Link to="/shop">
          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Go to Shop
          </button>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left">Sr.</th>
              <th className="py-3 px-4 text-left">Image</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Quantity</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.productId._id} className="border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">
                  <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
                </td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, -1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-l"
                    >
                      -
                    </button>
                    <span className="py-1 px-4 bg-gray-100">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, 1)}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded-r"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4">₹{item.price * item.quantity}</td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleRemoveItem(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 flex justify-end">
        <div className="w-full md:w-1/3">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Total:</span>
              <span className="font-bold text-lg">₹{total}</span>
            </div>
            <Link to="/checkout">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
                Checkout
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
