import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaBoxOpen, FaCalendarAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import io from 'socket.io-client';
import socket from '../../utils/socket';

export default function MyOrders() {
  const { user, userId } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyOrders = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setError("User not logged in.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const activeOrders = data.filter(order => order.orderStatus !== 'Delivered');
      setOrders(activeOrders);
    } catch (err) {
      console.error("Error fetching my orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchMyOrders();

    socket.on('order_status_updated', (updatedOrder) => {
      if (updatedOrder.userId === userId) {
        fetchMyOrders();
      }
    });

    return () => {
      socket.off('order_status_updated');
    };
  }, [fetchMyOrders, userId]);

  if (loading) {
    return <div className="text-center py-8">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">You haven't placed any orders yet.</p>
          <Link to="/shop" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Order ID: {order._id}</h2>
                <div className="flex items-center text-gray-600 text-sm mb-1">
                  <FaCalendarAlt className="mr-2" />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600 text-sm">
                  <span>Total: ₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Items:</h3>
                <ul className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <li key={item._id} className="flex justify-between items-center text-sm text-gray-600">
                      <span>{item.name} (x{item.quantity})</span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between items-center text-md font-semibold">
                  <span className="text-gray-700">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.orderStatus === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
