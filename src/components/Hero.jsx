import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Hero({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageSlide, setCurrentImageSlide] = useState(0);
  const navigate = useNavigate();

  const imageSlides = [
    "/images/b1.jfif",
    "/images/p1.jfif",
  ];

  // Automatic slider change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSlide((prev) => (prev + 1) % imageSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imageSlides.length]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-between px-4 py-16 bg-gray-50 md:px-8 md:flex-row"
      style={{
        backgroundImage: 'url(/backgrounds/bg1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Left content */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-lg text-left"
      >
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-2 text-sm font-medium text-white md:text-base"
        >
          Your Daily Essentials
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-6 text-3xl font-bold leading-snug text-white md:text-5xl"
        >
          Your One-Stop Shop <br /> for Daily Needs
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          onClick={() => navigate('/about-us')}
          className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-full shadow-lg hover:bg-blue-700"
        >
          More
        </motion.button>
      </motion.div>

      {/* Right image slider */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="relative flex justify-center w-full mt-10 md:mt-0 md:w-auto"
      >
        <div className="relative w-64 h-48 overflow-hidden shadow-2xl rounded-xl md:w-96 md:h-64">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageSlide}
              src={imageSlides[currentImageSlide]}
              alt="Hero Slider"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 object-cover w-full h-full"
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}
