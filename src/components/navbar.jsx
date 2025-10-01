// src/components/Navbar.jsx
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaUser,
  FaBars,
  FaHome,
  FaInfoCircle,
  FaQuestionCircle,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LoginModal from "./LoginModal";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../assets/logo.png";

export default function Navbar({ isAdmin }) {
  const { isLoggedIn, userRole, logout, user } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileBtnRef = useRef(null);

  const cartItemCount = cart ? cart.items.length : 0;

  const handleProfileClick = () => {
    if (isLoggedIn) {
      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/customer-profile");
      }
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Floating gradient background */}
      <div className="fixed top-0 left-0 z-40 w-full h-24 pointer-events-none">
        <div className="absolute rounded-full w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-600 opacity-30 blur-3xl -top-10 -left-20 animate-pulse-slow"></div>
        <div className="absolute w-56 h-56 rounded-full opacity-25 bg-gradient-to-r from-pink-400 to-orange-400 blur-2xl -top-5 right-10 animate-pulse-slow"></div>
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
        className={`flex justify-between items-center py-3 px-4 md:px-8 ${
          isAdmin ? "" : "fixed top-0 w-full"
        } bg-white/80 backdrop-blur-md shadow-md z-50`}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="DMart Logo" className="h-8 md:h-10" />
          <h1 className="text-xl font-bold text-blue-600 transition md:text-2xl hover:text-blue-700">
            DMart
          </h1>
        </motion.div>

        {/* Hamburger + Icons (Mobile) */}
        <div className="flex items-center gap-4 md:hidden">
          <FaBars
            className="text-2xl text-gray-700 transition cursor-pointer hover:text-blue-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
          <Link to="/cart" className="relative">
            <FaShoppingBag className="text-2xl text-blue-600 transition cursor-pointer hover:text-blue-700" />
            {cartItemCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full shadow-md -top-2 -right-2 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>
          <div>
            {isLoggedIn && user ? (
              <img
                src={user.profileImage}
                className="w-10 h-10 transition transform rounded-full shadow-md cursor-pointer hover:scale-105"
                onClick={handleProfileClick}
                alt="Profile"
              />
            ) : (
              <FaUser
                className="text-2xl text-blue-600 transition cursor-pointer hover:text-blue-700"
                onClick={handleProfileClick}
              />
            )}
          </div>
        </div>

        {/* Desktop Menu */}
        <motion.ul
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="hidden gap-10 font-medium text-gray-600 md:flex"
        >
          {["Home", "Shop", "About Us", "FAQ", "Contact"].map((item) => (
            <li key={item}>
              <Link
                to={
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(/\s+/g, "-")}`
                }
                className="relative transition group hover:text-blue-600"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-blue-600 transition-all group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </motion.ul>

        {/* Desktop Icons */}
        <div className="relative items-center hidden gap-6 md:flex">
          <Link to="/cart" className="relative">
            <FaShoppingBag className="text-2xl text-blue-600 transition cursor-pointer hover:text-blue-700" />
            {cartItemCount > 0 && (
              <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full shadow-md -top-2 -right-2 animate-pulse">
                {cartItemCount}
              </span>
            )}
          </Link>

          <div ref={profileBtnRef}>
            {isLoggedIn && user ? (
              <img
                src={user.profileImage}
                className="w-10 h-10 transition transform rounded-full shadow-md cursor-pointer hover:scale-105"
                onClick={handleProfileClick}
                alt="Profile"
              />
            ) : (
              <FaUser
                className="text-2xl text-blue-600 transition cursor-pointer hover:text-blue-700"
                onClick={handleProfileClick}
              />
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="fixed top-0 left-0 z-[60] h-full w-72 bg-white shadow-2xl md:hidden"
          >
            {/* Header with Close */}
            <div className="flex items-center justify-between px-4 py-4 border-b">
              <h2
                className="text-xl font-bold text-blue-600 cursor-pointer"
                onClick={() => {
                  navigate("/");
                  setIsMenuOpen(false);
                }}
              >
                DMart
              </h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-500 hover:text-blue-600"
              >
                ✕
              </button>
            </div>

            {/* Menu Links (No Border) */}
            <ul className="flex flex-col p-4 space-y-3">
              {[
                { name: "Home", path: "/", icon: <FaHome /> },
                { name: "Shop", path: "/shop", icon: <FaShoppingBag /> },
                { name: "About Us", path: "/about-us", icon: <FaInfoCircle /> },
                { name: "FAQ", path: "/faq", icon: <FaQuestionCircle /> },
                { name: "Contact", path: "/contact", icon: <FaEnvelope /> },
              ].map((item, index) => (
                <motion.li
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 p-4 text-gray-700 transition transform shadow-sm rounded-xl hover:shadow-lg hover:scale-105 hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-lg text-blue-600">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>

            {/* Social Icons */}
            <div className="absolute left-0 flex justify-center w-full gap-6 text-gray-500 bottom-6">
              <FaFacebookF className="cursor-pointer hover:text-blue-600" />
              <FaTwitter className="cursor-pointer hover:text-blue-400" />
              <FaLinkedinIn className="cursor-pointer hover:text-blue-700" />
              <FaYoutube className="cursor-pointer hover:text-red-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      {isModalOpen && (
        <LoginModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          navigate={navigate}
          top={
            profileBtnRef.current
              ? profileBtnRef.current.getBoundingClientRect().bottom + 10
              : 0
          }
          right={
            profileBtnRef.current
              ? window.innerWidth -
                profileBtnRef.current.getBoundingClientRect().right
              : 0
          }
        />
      )}
    </>
  );
}
