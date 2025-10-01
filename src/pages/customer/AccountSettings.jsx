import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaTrashAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import axios from "axios"; // Import axios
import toast from 'react-hot-toast'; // Import toast

export default function AccountSettings() {
  const { userId, logout } = useAuth(); // Get userId from AuthContext
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFA, setTwoFA] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        toast.error("User not logged in or user ID not available.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
        if (res.data) {
          setEmail(res.data.email || "");
          setPhone(res.data.phone || "");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleSave = async () => {
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Saving settings...");
    try {
      const updateData = { email, phone };

      if (newPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("New password and confirm password do not match.", { id: loadingToast });
          setLoading(false);
          return;
        }
        // In a real app, you'd send oldPassword for verification
        updateData.password = newPassword;
      }

      const res = await axios.put(`${API_BASE_URL}/user/${userId}`, updateData);
      toast.success(res.data.message || "Account settings updated successfully!", { id: loadingToast });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    setLoading(true);

    const loadingToast = toast.loading("Deleting account...");
    try {
      await axios.delete(`${API_BASE_URL}/user/${userId}`);
      toast.success("Account deleted successfully!", { id: loadingToast });
      // Redirect to home or login page after deletion
      // For now, just alert and log out
      // Assuming logout is available from AuthContext
      logout();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-8 text-center">Loading account settings...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      
      <h1 className="text-3xl font-extrabold text-blue-600 mb-8 text-center">
        Account Settings
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto space-y-6">
        <p className="text-gray-600 text-center mb-6">
          Manage your account settings and keep your profile secure.
        </p>

        {/* Email */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaEnvelope className="text-blue-500" /> Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaPhone className="text-green-500" /> Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Change Password */}
        <div className="space-y-2">
          <label className="block font-semibold text-gray-700 mb-1 flex items-center gap-2">
            <FaLock className="text-purple-500" /> Change Password
          </label>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-2 focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Two Factor Authentication */}
        <div className="flex items-center justify-between border border-gray-200 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2">
            <FaShieldAlt className="text-red-500" />
            <span className="font-semibold text-gray-700">
              Two-Factor Authentication
            </span>
          </div>
          <input
            type="checkbox"
            checked={twoFA}
            onChange={() => setTwoFA(!twoFA)}
            className="w-5 h-5 accent-blue-600"
            disabled={loading}
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 font-semibold"
        >
          Save Settings
        </button>

        {/* Danger Zone */}
        <div className="mt-8 border-t pt-6">
          <h2 className="text-lg font-bold text-red-600 mb-3 flex items-center gap-2">
            <FaTrashAlt /> Danger Zone
          </h2>
          <p className="text-gray-600 mb-4">
            Once you delete your account, all your data will be permanently
            removed. This action cannot be undone.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg shadow transition font-semibold"
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-red-600 mb-4">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}