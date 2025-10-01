import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

export default function Wishlist() {
  const { userId } = useAuth();
  const { fetchCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchWishlist = async () => {
    if (!userId) {
      setLoading(false);
      setError("User not logged in.");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setWishlistItems(data.wishlist);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const handleRemoveFromWishlist = async (productId) => {
    if (!userId) {
      toast.error("Please log in to manage your wishlist.");
      return;
    }
    try {
      const loadingToast = toast.loading("Removing from wishlist...");
      const response = await fetch(`${API_BASE_URL}/user/${userId}/wishlist/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      toast.success("Product removed from wishlist!", { id: loadingToast });
      fetchWishlist(); // Re-fetch wishlist after removal
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove product from wishlist.", { id: loadingToast });
    }
  };

  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error('Please log in to add items to your cart.');
      return;
    }
    const loadingToast = toast.loading("Adding to cart...");
    try {
      const response = await fetch(`${API_BASE_URL}/cart/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        toast.success('Item added to cart!', { id: loadingToast });
        fetchCart(); // Update cart context
        handleRemoveFromWishlist(product._id); // Optionally remove from wishlist after adding to cart
      } else {
        toast.error(data.message || 'Failed to add item to cart.', { id: loadingToast });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Error adding to cart.', { id: loadingToast });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading wishlist...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
          <Link to="/shop" className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
              <Link to={`/shop-detail/${product._id}`}>
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-3">₹{product.discountPrice || product.originalPrice}</p>
                <div className="flex justify-between items-center mt-auto">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
