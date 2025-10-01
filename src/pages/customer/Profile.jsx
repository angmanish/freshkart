import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FaUser, FaCamera, FaTimes, FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function CustomerProfile() {
  const { userId } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch profile
  useEffect(() => {
    if (!userId) {
      toast.error("User not logged in or ID not available.");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/user/${userId}`);
        setUser(res.data);
        setProfileImage(res.data.profileImage || "");
        setEditName(res.data.name || "");
        setEditEmail(res.data.email || "");
        setEditPhone(res.data.phone || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!userId) {
      toast.error("User not logged in.");
      return;
    }

    let loadingToast;
    try {
      setLoading(true);
      loadingToast = toast.loading("Updating profile...");
      const res = await axios.put(`${API_BASE_URL}/user/${userId}`, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        profileImage,
      });
      toast.success(res.data.message || "Profile updated successfully!", { id: loadingToast });
      setIsModalOpen(false);

      // Refresh profile
      const refreshed = await axios.get(`${API_BASE_URL}/user/${userId}`);
      setUser(refreshed.data);
      setProfileImage(refreshed.data.profileImage || "");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="py-10 text-lg font-semibold text-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-extrabold text-center text-blue-600">
        My Profile
      </h1>

      {/* Cards layout */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          className="flex flex-col items-center p-6 transition shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl hover:shadow-2xl"
        >
          <div className="relative w-32 h-32 mb-4 overflow-hidden border-4 border-blue-200 rounded-full shadow-lg">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white bg-gradient-to-tr from-blue-500 to-indigo-600">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <h2 className="text-xl font-semibold text-blue-700">{user?.name}</h2>
          <p className="text-gray-500">{user?.email}</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2 mt-6 text-white transition transform rounded-lg shadow bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-lg hover:scale-105"
          >
            <FaCamera /> Update Profile
          </button>
        </motion.div>

        {/* Info Card with mini fields */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.03 }}
          className="flex flex-col gap-4 p-6 transition shadow-lg bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-2xl hover:shadow-2xl"
        >
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            Account Information
          </h2>

          <ProfileField icon={<FaUserCircle className="text-purple-600" />} label="Name" value={user?.name} />
          <ProfileField icon={<FaEnvelope className="text-green-600" />} label="Email" value={user?.email} />
          <ProfileField icon={<FaPhone className="text-pink-600" />} label="Phone" value={user?.phone} />
          <ProfileField icon={<FaCalendarAlt className="text-yellow-600" />} label="Member Since" value={new Date(user?.registrationDate).toLocaleDateString()} />
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              className="relative w-full max-w-md p-8 bg-white shadow-2xl rounded-3xl"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute text-gray-400 transition top-4 right-4 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>

              <h2 className="flex items-center gap-2 mb-6 text-3xl font-bold text-gray-800">
                <FaUser className="text-blue-500" /> Update Profile
              </h2>

              <form onSubmit={handleUpdate} className="space-y-5">
                <InputField label="Name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                <InputField label="Email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} />
                <InputField label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />

                <div className="flex flex-col items-center">
                  <label className="flex items-center gap-2 mb-2 font-semibold text-gray-700">
                    <FaCamera className="text-blue-500" /> Profile Picture
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProfileImage(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-gray-500 shadow-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-indigo-600 file:text-white hover:file:from-blue-600 hover:file:to-indigo-700"
                  />
                  <input
                    type="text"
                    placeholder="Or paste image URL"
                    value={profileImage}
                    onChange={(e) => setProfileImage(e.target.value)}
                    className="w-full px-3 py-2 mt-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2 text-white transition rounded-lg shadow-md bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50">
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mini field card
function ProfileField({ icon, label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0px 0px 12px rgba(0,0,0,0.2)" }}
      className="flex items-center gap-4 p-4 transition bg-white shadow cursor-pointer rounded-xl"
    >
      <div className="p-2 bg-gray-100 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
      </div>
    </motion.div>
  );
}

// Input field component
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
