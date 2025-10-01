import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import SectionHeading from "../components/SectionHeading";

export default function ShopDetail() {
  const { productId } = useParams();
  const { userId } = useAuth();
  const { fetchCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId || !product) return;
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`);
        if (response.ok) {
          const data = await response.json();
          setIsWishlisted(data.wishlist.some((item) => item._id === product._id));
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    checkWishlistStatus();
  }, [userId, product]);

  const handleToggleWishlist = async () => {
    if (!userId) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
    if (!product) return;

    try {
      const loadingToast = toast.loading(isWishlisted ? "Removing from wishlist..." : "Adding to wishlist...");
      let response;
      if (isWishlisted) {
        response = await fetch(
          `${API_BASE_URL}/user/${userId}/wishlist/${product._id}`,
          { method: "DELETE" }
        );
      } else {
        response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
      }

      if (response.ok) {
        setIsWishlisted(!isWishlisted);
        toast.success(
          isWishlisted ? "Removed from wishlist!" : "Added to wishlist!",
          { id: loadingToast }
        );
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to update wishlist.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Error updating wishlist.", { id: loadingToast });
    }
  };

  const handleAddToCart = async () => {
    if (!userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    if (!product) return;

    const loadingToast = toast.loading("Adding to cart...");
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
          price: product.discountPrice || product.originalPrice,
          name: product.name,
          imageUrl: product.imageUrl,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Item added to cart!", { id: loadingToast });
        fetchCart();
      } else {
        toast.error(data.message || "Failed to add item to cart.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Error adding to cart.", { id: loadingToast });
    }
  };

  if (loading) return <div className="text-center py-8">Loading product details...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (!product) return <div className="text-center py-8">Product not found.</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Product Title */}
      <SectionHeading title={product.name} />

      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg">
            <img
              src={`http://localhost:5000${product.imageUrl}`}
              alt={product.name}
              className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <p className="text-xl font-semibold text-gray-700">
            ₹{product.discountPrice || product.originalPrice}
          </p>
          {product.discountPrice && (
            <p className="text-sm text-gray-400 line-through">
              ₹{product.originalPrice}
            </p>
          )}
          <p className="text-gray-600">
            {product.description || "No description available."}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={18}
                className={i < product.rating ? "text-yellow-400" : "text-gray-300"}
              />
            ))}
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviews || 0} reviews)
            </span>
          </div>

          {/* Add to Cart & Wishlist Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            {product.quantity > 0 ? (
              <button
                onClick={handleAddToCart}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
              >
                <FaShoppingCart className="inline-block mr-2" /> Add to Cart
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md cursor-not-allowed"
              >
                Out of Stock
              </button>
            )}
            <button
              onClick={handleToggleWishlist}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 shadow-md"
            >
              <FaHeart className={isWishlisted ? "text-red-500 inline-block mr-2" : "inline-block mr-2"} />
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Extra Info */}
          <div className="mt-6 text-gray-500 text-sm">
            <p><span className="font-semibold">Category:</span> {product.categoryId?.name || 'N/A'}</p>
            <p><span className="font-semibold">Stock:</span> {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
            <p><span className="font-semibold">SKU:</span> {product._id}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
