import React, { useState, useEffect } from "react";
import { FaCreditCard, FaHeart, FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import axios from "axios"; // Import axios
import toast from 'react-hot-toast'; // Import toast

export default function ShoppingPreferences() {
  const { userId } = useAuth(); // Get userId from AuthContext
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [defaultAddress, setDefaultAddress] = useState(""); // This will store the display string of the default address
  const [defaultAddressId, setDefaultAddressId] = useState(null); // This will store the ID of the default address
  const [addresses, setAddresses] = useState([]); // To store all addresses for dropdown
  const [wishlistEnabled, setWishlistEnabled] = useState(true);
  const [cartReminder, setCartReminder] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch user preferences and addresses
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!userId) {
        toast.error("User not logged in or user ID not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
        if (res.data) {
          setPaymentMethod(res.data.preferredPaymentMethod || "UPI");
          setWishlistEnabled(res.data.wishlistEnabled || true);
          setCartReminder(res.data.cartReminder || false);
          setAddresses(res.data.addresses || []);

          const defaultAddr = res.data.addresses.find(addr => addr.isDefault);
          if (defaultAddr) {
            setDefaultAddressId(defaultAddr._id);
            setDefaultAddress(`${defaultAddr.addressLine1}, ${defaultAddr.city}, ${defaultAddr.state}`);
          } else {
            setDefaultAddressId(null);
            setDefaultAddress("");
          }
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch preferences.");
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Saving preferences...");
    try {
      const updateData = {
        preferredPaymentMethod: paymentMethod,
        defaultAddressId: defaultAddressId, // Send the ID
        wishlistEnabled,
        cartReminder,
      };

      const res = await axios.put(`${API_BASE_URL}/user/${userId}`, updateData);
      toast.success(res.data.message || "Preferences saved successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save preferences.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-center">Loading preferences...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      
      <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">
        Shopping Preferences
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
        <p className="text-gray-600 text-center mb-6">
          Customize your shopping experience to match your style.
        </p>

        {/* Preferred Payment Method */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaCreditCard className="text-blue-500" /> Preferred Payment Method
          </label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>

        {/* Default Address */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaMapMarkerAlt className="text-green-500" /> Default Address
          </label>
          <select
            value={defaultAddressId || ""}
            onChange={(e) => setDefaultAddressId(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            <option value="">Select a default address</option>
            {addresses.map((addr) => (
              <option key={addr._id} value={addr._id}>
                {`${addr.addressLine1}, ${addr.city}, ${addr.state}`}
              </option>
            ))}
          </select>
        </div>

        {/* Wishlist Toggle */}
        <div className="flex items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <FaHeart className="text-red-500" />
            <span className="font-semibold text-gray-700">Enable Wishlist</span>
          </div>
          <input
            type="checkbox"
            checked={wishlistEnabled}
            onChange={() => setWishlistEnabled(!wishlistEnabled)}
            className="w-5 h-5 accent-blue-600"
            disabled={loading}
          />
        </div>

        {/* Cart Reminder */}
        <div className="flex items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <FaShoppingCart className="text-purple-500" />
            <span className="font-semibold text-gray-700">Cart Reminder Notifications</span>
          </div>
          <input
            type="checkbox"
            checked={cartReminder}
            onChange={() => setCartReminder(!cartReminder)}
            className="w-5 h-5 accent-blue-600"
            disabled={loading}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 font-semibold"
          disabled={loading}
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
}
