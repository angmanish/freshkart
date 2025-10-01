import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditProductModal({ product, onClose, onProductUpdated }) {
  const [name, setName] = useState(product.name);
  const [originalPrice, setOriginalPrice] = useState(product.originalPrice);
  const [discountPrice, setDiscountPrice] = useState(product.discountPrice);
  const [categoryId, setCategoryId] = useState(product.categoryId._id);
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(product.imageUrl);
  const [likes, setLikes] = useState(product.likes);
  const [rating, setRating] = useState(product.rating);
  const [description, setDescription] = useState(product.description);
  const [quantity, setQuantity] = useState(product.quantity);
  const [weight, setWeight] = useState(product.weight);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to fetch categories.");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("originalPrice", originalPrice);
    formData.append("discountPrice", discountPrice);
    formData.append("categoryId", categoryId);
    formData.append("likes", likes);
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("quantity", quantity);
    formData.append("weight", weight);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("imageUrl", currentImageUrl);
    }

    try {
      const loadingToast = toast.loading("Updating product...");
      const response = await axios.put(`${API_BASE_URL}/products/${product._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message || "Product updated successfully!", { id: loadingToast });
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error(err.response?.data?.message || "Failed to update product.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black/50">
      <div className="relative w-full max-w-5xl p-6 bg-white shadow-2xl rounded-3xl md:p-10 animate-fadeIn">
        {/* Close Button */}
        <button onClick={onClose} className="absolute text-2xl font-bold text-gray-500 top-5 right-5 hover:text-red-500">
          &times;
        </button>

        <h2 className="mb-8 text-3xl font-bold text-center text-blue-600">Edit Product</h2>

        {error && <div className="mb-4 text-center text-red-500">{error}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <Input label="Product Name" value={name} setValue={setName} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Original Price" type="number" value={originalPrice} setValue={setOriginalPrice} step="0.01" />
              <Input label="Discount Price" type="number" value={discountPrice} setValue={setDiscountPrice} step="0.01" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Quantity" type="number" value={quantity} setValue={setQuantity} min="0" />
              <Input label="Weight" value={weight} setValue={setWeight} placeholder="e.g. 500g, 1kg" />
            </div>
            <Select label="Category" options={categories} value={categoryId} setValue={setCategoryId} />
            <FileUpload currentImageUrl={currentImageUrl} setImage={setImage} />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Likes" type="number" value={likes} setValue={setLikes} min="0" />
              <Input label="Rating" type="number" value={rating} setValue={setRating} min="1" max="5" step="0.1" />
            </div>
            <Textarea label="Description" value={description} setValue={setDescription} rows={8} />
            <button
              type="submit"
              className="w-full py-3 font-semibold text-white transition duration-300 bg-blue-600 shadow-lg hover:bg-blue-700 rounded-xl"
              disabled={loading}
            >
              {loading ? "Updating Product..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* --------------------- Helper Components --------------------- */
function Input({ label, value, setValue, type = "text", placeholder = "", min, max, step }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  );
}

function Select({ label, options, value, setValue }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      >
        <option value="">Select Category</option>
        {options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, value, setValue, rows }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={rows}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
    </div>
  );
}

function FileUpload({ currentImageUrl, setImage }) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">Product Image</label>
      {currentImageUrl && (
        <div className="mb-2">
          <img src={`http://localhost:5000${currentImageUrl}`} alt="Current Product" className="object-cover w-24 h-24 rounded-md" />
          <p className="text-sm text-gray-500">Current Image</p>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <p className="mt-1 text-xs text-gray-500">Leave blank to keep current image.</p>
    </div>
  );
}
