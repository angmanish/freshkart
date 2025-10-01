import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBars,
  FaTimes,
  FaHome,
  FaBoxOpen,
  FaShoppingCart,
  FaTags,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from 'react-icons/fa';

// Sidebar for E-Mart
// - Uses TailwindCSS for styling
// - Uses framer-motion for smooth animations
// - Uses react-icons for icons
// - Responsive: collapses to mini icons and hidden on small screens (toggleable)

export default function Sidebar({ className = '' }) {
  const [isOpen, setIsOpen] = useState(true); // full width vs collapsed
  const [isMobileOpen, setIsMobileOpen] = useState(false); // for small screens

  const links = [
    { to: '/', label: 'Home', icon: <FaHome /> },
    { to: '/products', label: 'Products', icon: <FaBoxOpen /> },
    { to: '/cart', label: 'Cart', icon: <FaShoppingCart /> },
    { to: '/deals', label: 'Deals', icon: <FaTags /> },
    { to: '/customers', label: 'Customers', icon: <FaUsers /> },
    { to: '/settings', label: 'Settings', icon: <FaCog /> },
  ];

  const sidebarVariants = {
    open: { width: '16rem', transition: { type: 'spring', stiffness: 220, damping: 20 } },
    collapsed: { width: '4.5rem', transition: { type: 'spring', stiffness: 220, damping: 20 } },
  };

  const mobileSidebarVariants = {
    hidden: { x: '-100%' },
    visible: { x: 0 },
  };

  return (
    <>
      {/* top-left mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-40">
        <button
          aria-label="Open sidebar"
          className="p-2 rounded-md shadow-md bg-white/90 backdrop-blur"
          onClick={() => setIsMobileOpen(true)}
        >
          <FaBars size={20} />
        </button>
      </div>

      {/* Desktop / tablet sidebar */}
      <motion.aside
        className={`hidden md:flex flex-col h-screen bg-white border-r select-none ${className}`}
        animate={isOpen ? 'open' : 'collapsed'}
        variants={sidebarVariants}
        initial={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <motion.div
              layout
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              onClick={() => setIsOpen(true)}
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">EM</div>
              {isOpen && (
                <motion.h1
                  layout
                  className="text-lg font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  E‑Mart
                </motion.h1>
              )}
            </motion.div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
              title={isOpen ? 'Collapse' : 'Expand'}
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-auto pt-2">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-md p-2 text-sm transition-colors duration-150 $`
                    + (isActive
                      ? ' bg-indigo-50 text-indigo-600 font-medium'
                      : ' text-gray-700 hover:bg-gray-50')
                  }
                >
                  <motion.span
                    className="w-9 h-9 rounded-md grid place-items-center text-lg"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.icon}
                  </motion.span>

                  {/* label shows only when open */}
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

        {/* Footer actions */}
        <div className="p-3 border-t">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 grid place-items-center">G</div>
            {isOpen ? (
              <div className="flex-1">
                <div className="text-sm font-medium">Guest User</div>
                <div className="text-xs text-gray-500">guest@emart.local</div>
              </div>
            ) : (
              <div className="sr-only">Guest User</div>
            )}
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex">
            <motion.div
              className="fixed inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
            />

            <motion.aside
              className="relative w-64 h-full bg-white shadow-lg"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={mobileSidebarVariants}
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-indigo-600 text-white grid place-items-center font-bold">EM</div>
                  <h2 className="text-lg font-semibold">E‑Mart</h2>
                </div>

                <button className="p-2" onClick={() => setIsMobileOpen(false)} aria-label="Close sidebar">
                  <FaTimes />
                </button>
              </div>

              <nav className="p-4">
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.to}>
                      <NavLink
                        to={link.to}
                        onClick={() => setIsMobileOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-md p-2 text-sm ` +
                          (isActive ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50')
                        }
                      >
                        <span className="w-8 h-8 grid place-items-center">{link.icon}</span>
                        <span className="flex-1">{link.label}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
