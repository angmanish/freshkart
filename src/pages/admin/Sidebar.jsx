import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSignOutAlt,
  FaShoppingCart,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaCog,
  FaHistory,
  FaChevronLeft,
  FaChevronRight,
  FaEnvelope
} from 'react-icons/fa';

const links = [
  { to: '/admin/dashboard', icon: <FaChartBar />, label: 'Dashboard' },
  { to: '/admin/products', icon: <FaShoppingCart />, label: 'Add Products' },
  { to: '/admin/manage-products', icon: <FaClipboardList />, label: 'Manage Products' },
  { to: '/admin/orders', icon: <FaClipboardList />, label: 'Manage Orders' },
  { to: '/admin/order-history', icon: <FaHistory />, label: 'Order History' },
  { to: '/admin/users', icon: <FaUsers />, label: 'Manage Users' },
  { to: '/admin/settings', icon: <FaCog />, label: 'Store Settings' },
  { to: '/admin/messages', icon: <FaEnvelope />, label: 'Customer Messages' },
];

export default function AdminSidebar({ isOpen, setIsOpen, logout }) {
  const containerVariants = {
    collapsed: { width: '5rem' },
    expanded: { width: '16rem' },
  };

  return (
    <motion.aside
      initial="expanded"
      animate={isOpen ? 'expanded' : 'collapsed'}
      variants={containerVariants}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className="fixed top-0 left-0 h-full z-40 flex flex-col bg-gradient-to-b from-indigo-800 via-indigo-900 to-black shadow-xl"
    >
      <div className="flex items-center justify-between p-4 border-b border-indigo-700">
        {isOpen && <h2 className="text-lg font-semibold text-white">DMart</h2>}
        <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
          {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>

      <nav className="flex-1 overflow-auto pt-2">
        <ul className="space-y-1 px-2">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-md p-2 text-sm transition-colors duration-150 
                  ${isActive
                    ? 'bg-indigo-600/40 text-white font-medium'
                    : 'text-gray-300 hover:bg-indigo-700/40 hover:text-white'
                  } ${!isOpen ? 'justify-center' : ''}`
                }
              >
                <motion.span
                  className="w-9 h-9 rounded-md grid place-items-center text-lg"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.span>
                {isOpen && (
                  <motion.span
                    className="flex-1"
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-indigo-700">
        <button
          onClick={logout}
          className={`group flex items-center gap-3 rounded-md p-2 text-sm w-full transition-colors duration-150 text-red-500 hover:bg-red-600/40 hover:text-white ${!isOpen ? 'justify-center' : ''}`}>
          <motion.span
            className="w-9 h-9 rounded-md grid place-items-center text-lg"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt />
          </motion.span>
          {isOpen && (
            <motion.span
              className="flex-1"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
