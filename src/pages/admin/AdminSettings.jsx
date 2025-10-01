import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch store settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/store-settings`);
      setSettings(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle settings update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loadingToast = toast.loading("Saving settings...");
      const res = await axios.put(`${API_BASE_URL}/store-settings`, settings);
      toast.success(res.data.message || 'Settings updated successfully!', { id: loadingToast });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update settings.', { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  if (loading && !settings.storeName) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800">⚙️ Admin Settings</h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block font-semibold text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              id="storeName"
              name="storeName"
              value={settings.storeName || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="address" className="block font-semibold text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={settings.address || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-semibold text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={settings.phone || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={settings.email || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105 font-semibold disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
}