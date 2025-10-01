import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import BestSellingProductCard from "../components/BestSellingProductCard";
import AnimatedNumber from "../components/AnimatedNumber";
import AutoSlider from "../components/AutoSlider";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaShippingFast, FaLock, FaUndo, FaHeadset, FaUsers, FaAward, FaCheckCircle, FaBoxOpen } from "react-icons/fa";
import SectionHeading from "../components/SectionHeading";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:5000/api";

  const bannerImages = [
    "/discount_banners/b1.jpg",
    "/discount_banners/b2.jpg",
    "/discount_banners/b3.jpg",
    "/discount_banners/b4.jpg",
    "/discount_banners/6975292.jpg",
    "/discount_banners/mega_sale_social_media_banner_template_up_to_50_off.jpg",
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data.products);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch products.");
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const featureCards = [
    { icon: <FaShippingFast />, title: "Free Shipping", description: "On all orders over ₹50" },
    { icon: <FaLock />, title: "Secured Payment", description: "100% secure online payment" },
    { icon: <FaUndo />, title: "7 Day Return", description: "Hassle-free returns & exchanges" },
    { icon: <FaHeadset />, title: "24/7 Support", description: "Dedicated customer assistance" },
  ];

  const [filtered, setFiltered] = useState([]); // Initialize with empty array

  useEffect(() => {
    setFiltered(products); // Set filtered products once products are fetched
  }, [products]);

  const testimonials = [
    { quote: "This is the best online store ever! The products are fresh and delivery is super fast.", name: "Alice Smith", title: "Happy Customer", image: "https://via.placeholder.com/100/FF5733/FFFFFF?text=AS" },
    { quote: "I love the variety of products and the excellent customer service. Highly recommended!", name: "Bob Johnson", title: "Regular Shopper", image: "https://via.placeholder.com/100/33FF57/FFFFFF?text=BJ" },
    { quote: "Fresh produce delivered right to my door. It makes my life so much easier.", name: "Charlie Brown", title: "Busy Parent", image: "https://via.placeholder.com/100/3357FF/FFFFFF?text=CB" },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(nextTestimonial, 5000); // Auto-advance every 5 seconds
    return () => clearInterval(timer);
  }, []);



  return (
    <>
      <Hero />

      <section className="py-8 px-4 md:py-12 md:px-6 bg-white">
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center p-8 rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-indigo-600 text-7xl mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      

      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4 md:py-12 md:px-6 bg-gray-50"
      >
        <SectionHeading title="Featured Products" />
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.slice(0, 4).map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center text-gray-500"
          >
            No results found.
          </motion.p>
        )}
      </motion.section>

      {/* Promotion Banners Section */}
      <section className="my-8">
        <AutoSlider images={bannerImages} height="72vh" />
      </section>

      {/* Top Rated Products Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4 md:py-12 md:px-6 bg-gray-50"
      >
        <SectionHeading title="Top Rated Products" />
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.filter(p => p.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 4).map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center text-gray-500"
          >
            No products found.
          </motion.p>
        )}
      </motion.section>

      {/* Festive Offers Section */}
      <section className="my-8 w-full h-[50vh]">
        <img src="/discount_banners/f1.png" alt="Festive Offers" className="w-full h-full object-cover" />
      </section>

      {/* Most Liked Products Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-8 px-4 md:py-12 md:px-6 bg-gray-50"
      >
        <SectionHeading title="Most Liked Products" />
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.sort((a, b) => b.likes - a.likes).slice(0, 4).map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center text-gray-500"
          >
            No products found.
          </motion.p>
        )}
      </motion.section>

      <section className="w-full h-[50vh] bg-blue-200 flex items-center justify-center text-center p-4"
        style={{ backgroundImage: 'url(/backgrounds/bg2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Limited Time Offer!
          </h2>
          <p className="text-lg md:text-xl text-blue-700 mb-8">
            Get 20% off on all groceries this week. Don't miss out!
          </p>
          <button onClick={() => navigate('/shop')} className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Shop Now
          </button>
        </div>
      </section>





      {/* Testimonial Section */}
      <section className="py-12 px-4 md:py-16 md:px-6 bg-white">
        <div className="container mx-auto text-center">
          <SectionHeading title="What Our Customers Say" />
          <div className="relative max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 p-8 rounded-lg shadow-lg flex flex-col justify-between h-72"
              >
                <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  "{testimonials[currentTestimonial].quote}"
                </p>
                <p className="font-semibold text-blue-600">
                  - {testimonials[currentTestimonial].name}
                </p>
                <p className="text-sm text-gray-500">
                  {testimonials[currentTestimonial].title}
                </p>
              </motion.div>
            </AnimatePresence>
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition"
            >
              &lt;
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600 transition"
            >
              &gt;
            </button>
          </div>
        </div>
      </section>

      <section className="py-8 px-4 md:py-12 md:px-6 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <FaUsers />, title: "Satisfied Customers", value: "10,000+" },
              { icon: <FaAward />, title: "Quality of Service", value: "98%" },
              { icon: <FaCheckCircle />, title: "Quality Service", value: "99%" },
              { icon: <FaBoxOpen />, title: "Available Products", value: "5,000+" },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center text-center p-8 rounded-lg shadow-md bg-gray-50 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="text-indigo-600 text-7xl mb-4">
                  {card.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-900">
                  <AnimatedNumber value={parseInt(card.value.replace(/\D/g, ""))} />
                  {card.value.includes("+") ? "+" : card.value.includes("%") ? "%" : ""}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}