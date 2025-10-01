import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CustomerNavbar from './CustomerNavbar';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Layout({ children }) {
  const { isLoggedIn, userRole } = useAuth();
  const [isCustomerNavbarCollapsed, setIsCustomerNavbarCollapsed] = useState(false);

  // Calculate right padding for main & footer
  const rightPadding = isLoggedIn && userRole === 'customer' 
    ? isCustomerNavbarCollapsed ? 'pr-24' : 'pr-64' 
    : '';

  return (
    <div className="relative flex flex-col min-h-screen">
      <Navbar />
      {isLoggedIn && userRole === 'customer' && 
        <CustomerNavbar 
          isCollapsed={isCustomerNavbarCollapsed} 
          setIsCollapsed={setIsCustomerNavbarCollapsed} 
        />
      }

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`flex-grow pt-16 transition-all duration-300 ${rightPadding}`}
      >
        {children}
      </motion.main>

      <motion.div
        className={`transition-all duration-300 ${rightPadding}`}
      >
        <Footer />
      </motion.div>
    </div>
  );
}
