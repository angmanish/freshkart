import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import SectionHeading from "../components/SectionHeading";
import { motion } from "framer-motion";

export default function Contact() {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const loadingToast = toast.loading("Sending message...");
    try {
      const response = await axios.post("http://localhost:5000/api/messages", formData);
      setSuccess(response.data.message);
      setFormData({ senderName: "", senderEmail: "", subject: "", message: "" });
      toast.success("Message sent successfully!", { id: loadingToast });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
      toast.error(err.response?.data?.message || "Failed to send message.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container px-4 py-12 mx-auto"
    >
      <SectionHeading title="Contact Us" />
      <p className="max-w-2xl mx-auto mb-12 text-center text-gray-600">
        Have a question or feedback? Reach out to us and we'll get back to you as soon as possible.
      </p>

      {/* Contact Info */}
      <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-3">
        <div className="flex items-center p-6 transition bg-white shadow rounded-xl hover:shadow-lg">
          <MapPin className="mr-4 text-indigo-600" size={28} />
          <div>
            <h3 className="font-semibold text-gray-800">Address</h3>
            <p className="text-sm text-gray-500">123 DMart Street, City, State, 12345</p>
          </div>
        </div>
        <div className="flex items-center p-6 transition bg-white shadow rounded-xl hover:shadow-lg">
          <Phone className="mr-4 text-green-600" size={28} />
          <div>
            <h3 className="font-semibold text-gray-800">Phone</h3>
            <p className="text-sm text-gray-500">+91 98765 43210</p>
          </div>
        </div>
        <div className="flex items-center p-6 transition bg-white shadow rounded-xl hover:shadow-lg">
          <Mail className="mr-4 text-red-600" size={28} />
          <div>
            <h3 className="font-semibold text-gray-800">Email</h3>
            <p className="text-sm text-gray-500">support@dmart.com</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl p-8 mx-auto bg-white shadow-lg rounded-xl">
        <SectionHeading title="Send Us a Message" />
        {error && <div className="mb-4 text-center text-red-500">{error}</div>}
        {success && <div className="mb-4 text-center text-green-500">{success}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="senderName" value={formData.senderName} onChange={handleChange} placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input type="email" name="senderEmail" value={formData.senderEmail} onChange={handleChange} placeholder="Your Email" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Your Message" rows={5} className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          <button type="submit" className="w-full py-3 font-semibold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
