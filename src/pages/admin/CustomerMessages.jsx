import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaEnvelopeOpen, FaEnvelope, FaTrash } from "react-icons/fa";

export default function CustomerMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/messages`);
      setMessages(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages.");
      toast.error("Failed to load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkAsRead = async (id) => {
    try {
      const loadingToast = toast.loading("Marking as read...");
      await axios.put(`${API_BASE_URL}/messages/${id}/read`);
      toast.success("Message marked as read!", { id: loadingToast });
      fetchMessages(); // Refresh messages
    } catch (err) {
      console.error("Error marking message as read:", err);
      toast.error("Failed to mark message as read.", { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      const loadingToast = toast.loading("Deleting message...");
      try {
        await axios.delete(`${API_BASE_URL}/messages/${id}`);
        toast.success("Message deleted successfully!", { id: loadingToast });
        fetchMessages(); // Refresh messages
      } catch (err) {
        console.error("Error deleting message:", err);
        toast.error("Failed to delete message.", { id: loadingToast });
      }
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading messages...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container p-4 mx-auto bg-white rounded-lg shadow-md sm:p-6">
      <h1 className="mb-6 text-3xl font-bold text-gray-800">✉️ Customer Messages</h1>

      {messages.length === 0 ? (
        <p className="text-gray-600">No customer messages found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Sender</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Email</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Subject</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Message</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((message) => (
                <tr key={message._id} className={`${message.isRead ? 'bg-gray-50 text-gray-500' : 'bg-white font-semibold text-gray-800'} hover:bg-gray-100`}>
                  <td className="px-3 py-2 text-sm">
                    {message.isRead ? (
                      <FaEnvelopeOpen className="text-green-500" title="Read" />
                    ) : (
                      <FaEnvelope className="text-blue-500" title="Unread" />
                    )}
                  </td>
                  <td className="px-3 py-2 text-sm">{message.senderName}</td>
                  <td className="px-3 py-2 text-sm">{message.senderEmail}</td>
                  <td className="px-3 py-2 text-sm">{message.subject}</td>
                  <td className="px-3 py-2 text-sm max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">{message.message}</td>
                  <td className="px-3 py-2 text-sm">{new Date(message.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-sm flex gap-2">
                    {!message.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(message._id)}
                        className="p-1 text-blue-600 hover:text-blue-800" title="Mark as Read"
                      >
                        <FaEnvelopeOpen />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(message._id)}
                      className="p-1 text-red-600 hover:text-red-800" title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
