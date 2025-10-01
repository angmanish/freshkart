// src/components/BestSellingProductCard.jsx
import React from "react";
import { FaHeart, FaStar, FaShoppingCart } from "react-icons/fa";

const BestSellingProductCard = ({ product }) => {
  return (
    <div className="relative flex items-center max-w-2xl p-5 mx-auto text-white shadow-lg bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl">
      {/* Wishlist Icon */}
      <button className="absolute text-gray-300 top-3 right-3 hover:text-red-500">
        <FaHeart size={20} />
      </button>

      {/* Left Side - Image */}
      <div className="flex justify-center w-1/3">
        <img
          src={product.image}
          alt={product.name}
          className="object-contain w-32 h-32 rounded-lg"
        />
      </div>

      {/* Right Side - Content */}
      <div className="w-2/3 pl-5">
        {/* Name */}
        <h2 className="mb-2 text-xl font-semibold">{product.name}</h2>

        {/* Description */}
        <p className="mb-3 text-sm text-gray-300">{product.description}</p>

        {/* Rating */}
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < product.rating ? "text-yellow-400" : "text-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Price Section */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-pink-400">
            ₹{product.discountPrice}
          </span>
          <span className="text-sm text-gray-400 line-through">
            ₹{product.originalPrice}
          </span>
        </div>

        {/* Add to Cart */}
        <button className="flex items-center gap-2 px-5 py-2 text-white transition bg-pink-500 rounded-full hover:bg-pink-600">
          <FaShoppingCart /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BestSellingProductCard;
