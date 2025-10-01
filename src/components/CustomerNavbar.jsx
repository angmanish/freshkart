import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaUserCircle, FaMapMarkerAlt, FaShoppingCart, FaCog, FaSignOutAlt, FaHistory, FaHeart, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function CustomerNavbar({ isCollapsed, setIsCollapsed }) {
  const { logout } = useAuth();

  const navLinks = [
    { name: 'Information', path: '/customer-profile', icon: FaUserCircle },
    { name: 'Address', path: '/customer-profile/address', icon: FaMapMarkerAlt },
    { name: 'Shopping Preferences', path: '/customer-profile/preferences', icon: FaShoppingCart },
    { name: 'My Orders', path: '/customer-profile/my-orders', icon: FaHistory },
    { name: 'Wishlist', path: '/customer-profile/wishlist', icon: FaHeart },
    { name: 'History', path: '/customer-profile/history', icon: FaHistory },
    { name: 'Account Settings', path: '/customer-profile/settings', icon: FaCog },
    { name: 'Logout', icon: FaSignOutAlt, action: logout },
  ];

  const containerVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 20 } },
  };

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`fixed top-16 right-0 bg-white shadow-lg flex flex-col rounded-l-2xl transition-width duration-300 ${isCollapsed ? 'w-24' : 'w-64'}`}
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && <h2 className="text-lg font-semibold">My Account</h2>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-gray-700 focus:outline-none">
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <div className="flex flex-col flex-grow gap-4 p-2">
        {navLinks.map((link) =>
          link.path ? (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center py-3 px-4 rounded-xl transition-all duration-300 transform
                 ${isActive ? 'bg-gradient-to-r from-blue-100 to-blue-50 shadow-md text-blue-600 scale-105' : 'text-gray-700 hover:bg-blue-50 hover:scale-105 hover:shadow-lg'}
                 ${isCollapsed ? 'justify-center' : ''}`
              }
            >
              {React.createElement(link.icon, { className: `h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}` })}
              {!isCollapsed && <span className="font-medium">{link.name}</span>}
            </NavLink>
          ) : (
            <button
              key={link.name}
              onClick={link.action}
              className={`flex items-center w-full py-3 px-4 rounded-xl text-red-600 transition-all duration-300 transform hover:bg-red-50 hover:scale-105 hover:shadow-lg ${isCollapsed ? 'justify-center' : ''}`}
            >
              {React.createElement(link.icon, { className: `h-6 w-6 ${!isCollapsed ? 'mr-3' : ''}` })}
              {!isCollapsed && <span className="font-medium">{link.name}</span>}
            </button>
          )
        )}
      </div>
    </motion.nav>
  );
}
