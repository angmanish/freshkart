import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('new_order', (order) => {
      console.log('New order received:', order);
      const newNotification = {
        id: order._id,
        message: `New Order: ${order.items.length} items, Total: ₹${order.totalAmount.toFixed(2)}`, // More descriptive message
        timestamp: new Date().toLocaleString(),
        orderData: order, // Store the full order object if needed elsewhere
        read: false, // Add read status
      };
      setNewOrderCount((prevCount) => prevCount + 1);
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
      // Optionally, show a toast notification
      // toast.success(`New Order: ${order._id}`);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const clearNewOrderCount = () => {
    setNewOrderCount(0);
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => ({ ...n, read: true }))
    );
  };

  const value = {
    newOrderCount,
    notifications,
    clearNewOrderCount,
    markAllNotificationsAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
