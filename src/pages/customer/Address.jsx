import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Address() {
  const { userId } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const initialFormState = {
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    landmark: "",
    isDefault: false,
  };
  const [form, setForm] = useState(initialFormState);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
        if (res.data?.addresses) {
          setAddresses(res.data.addresses);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch addresses.");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!userId) return setError("User not logged in.");
    if (!form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country) {
      return toast.error("Please fill all required fields.");
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading("Adding address...");
      const res = await axios.post(`${API_BASE_URL}/user/${userId}/address`, form);
      setAddresses(res.data.addresses || []);
      toast.success("Address added successfully!", { id: loadingToast });
      setForm(initialFormState);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add address.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddressId(address._id);
    setForm(address);
    document.getElementById("address-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    if (!userId || !editingAddressId) return setError("User not logged in or no address selected.");
    if (!form.addressLine1 || !form.city || !form.state || !form.postalCode || !form.country) {
      return toast.error("Please fill all required fields.");
    }

    try {
      setLoading(true);
      const loadingToast = toast.loading("Updating address...");
      const res = await axios.put(`${API_BASE_URL}/user/${userId}/address/${editingAddressId}`, form);
      setAddresses(res.data.addresses || []);
      toast.success("Address updated successfully!", { id: loadingToast });
      setEditingAddressId(null);
      setForm(initialFormState);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update address.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!userId) return toast.error("User not logged in.");
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      setLoading(true);
      const loadingToast = toast.loading("Deleting address...");
      const res = await axios.delete(`${API_BASE_URL}/user/${userId}/address/${addressId}`);
      setAddresses(res.data.addresses || []);
      toast.success("Address deleted successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete address.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    if (!userId) return toast.error("User not logged in.");

    try {
      setLoading(true);
      const loadingToast = toast.loading("Setting default address...");
      const res = await axios.put(`${API_BASE_URL}/user/${userId}/address/${addressId}/default`);
      setAddresses(res.data.addresses || []);
      toast.success("Default address set successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to set default address.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8 text-center">Loading addresses...</div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8 text-center text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">
        Address Information
      </h1>

      {/* Form */}
      <div
        id="address-form"
        className="bg-white p-6 rounded-2xl shadow-xl max-w-2xl mx-auto mb-8 relative"
      >
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-2xl">
            Loading...
          </div>
        )}
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {editingAddressId ? "Edit Address" : "Add New Address"}
        </h2>
        <form
          onSubmit={editingAddressId ? handleUpdateAddress : handleAddAddress}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold mb-1">Address Line 1 *</label>
            <input
              type="text"
              name="addressLine1"
              value={form.addressLine1}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Address Line 2</label>
            <input
              type="text"
              name="addressLine2"
              value={form.addressLine2}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={form.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Postal Code *</label>
              <input
                type="text"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Country *</label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Landmark</label>
            <input
              type="text"
              name="landmark"
              value={form.landmark}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
              id="defaultCheckbox"
            />
            <label htmlFor="defaultCheckbox">Set as default</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-105 text-white py-2 rounded-lg shadow-md transition transform"
            disabled={loading}
          >
            {editingAddressId ? "Update Address" : "Save Address"}
          </button>
          {editingAddressId && (
            <button
              type="button"
              onClick={() => {
                setEditingAddressId(null);
                setForm(initialFormState);
              }}
              className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg shadow-md transition mt-2"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      {/* Saved Addresses */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-gray-500">No addresses added yet.</p>
        ) : (
          <AnimatePresence>
            <div className="grid gap-4">
              {addresses.map((addr) => (
                <motion.div
                  key={addr._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-4 bg-white rounded-xl shadow hover:shadow-lg transition relative"
                >
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                  <p className="font-semibold text-gray-800">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                  <p>
                    {addr.city}, {addr.state} - {addr.postalCode}
                  </p>
                  <p>{addr.country}</p>
                  {addr.landmark && (
                    <p className="text-gray-500 text-sm">Landmark: {addr.landmark}</p>
                  )}
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleEditAddress(addr)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 hover:scale-105 transition transform text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 hover:scale-105 transition transform text-sm"
                    >
                      Delete
                    </button>
                    {!addr.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(addr._id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 hover:scale-105 transition transform text-sm"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
