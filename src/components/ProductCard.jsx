import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { userId } = useAuth();
  const { fetchCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  // Check wishlist
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`);
        if (response.ok) {
          const data = await response.json();
          setIsWishlisted(
            data.wishlist.some((item) => item._id === product._id)
          );
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
      }
    };
    checkWishlistStatus();
  }, [userId, product._id]);

  const handleToggleWishlist = async (e) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
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

  return (
   <motion.div
  whileHover={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
  className="flex flex-col w-full max-w-xs mx-auto overflow-hidden text-center transition-all duration-300 shadow-md bg-gradient-to-b from-purple-200 via-white to-purple-300 rounded-2xl"
>
  {/* Image Section */}
  <div className="relative p-6 bg-white">
    <img
      src={`http://localhost:5000${product.imageUrl}`}
      alt={product.name}
      className="object-contain w-full h-48 mx-auto"
    />
    {product.isNew && (
      <span className="absolute px-2 py-1 text-xs text-white bg-green-500 rounded-full shadow top-2 left-2">
        New
      </span>
    )}
    {product.discount && (
      <span className="absolute px-2 py-1 text-xs text-white bg-red-500 rounded-full shadow top-2 right-2">
        -{product.discount}%
      </span>
    )}
    {/* Wishlist Button */}
    <button
      onClick={handleToggleWishlist}
      className="absolute p-2 text-gray-600 transition bg-white rounded-full shadow-md bottom-2 right-2 hover:text-red-500"
    >
      <FaHeart className={isWishlisted ? "text-red-500" : "text-gray-600"} />
    </button>
  </div>

  {/* Product Info */}
  <div className="flex flex-col flex-1 p-4">
    <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
    <p className="mt-2 text-sm text-gray-500 line-clamp-3">
      {product.description || "No description available."}
    </p>

    {/* Rating */}
    <div className="flex flex-wrap items-center justify-center gap-1 mt-3">
      {[...Array(5)].map((_, i) => (
        <FaStar
          key={i}
          size={14}
          className={i < product.rating ? "text-yellow-400" : "text-gray-300"}
        />
      ))}
      <span className="ml-2 text-xs text-gray-500">
        ({product.reviews} reviews)
      </span>
    </div>

    {/* Spacer to push button to bottom */}
    <div className="flex flex-col mt-auto">
      {/* Price */}
      <p className="text-2xl font-bold text-indigo-600">
        ₹{product.discountPrice}
      </p>
      {product.originalPrice && (
        <p className="text-sm text-gray-400 line-through">
          ₹{product.originalPrice}
        </p>
      )}

      {/* Add to Cart */}
      {product.quantity > 0 ? (
        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-sm text-white transition bg-indigo-600 rounded-full shadow-md hover:bg-indigo-700 hover:shadow-lg"
        >
          <FaShoppingCart /> Add to Cart
        </button>
      ) : (
        <button
          disabled
          className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 text-sm text-white bg-red-500 rounded-full shadow-md cursor-not-allowed"
        >
          Out of Stock
        </button>
      )}
    </div>
  </div>
</motion.div>
  

  );
};

export default ProductCard;
