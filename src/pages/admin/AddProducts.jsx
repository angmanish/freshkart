import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
export default function AddProducts() {
  const [name, setName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [likes, setLikes] = useState(0);
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [weight, setWeight] = useState("");
  const [selectedSubCategoryName, setSelectedSubCategoryName] = useState(""); // New state for selected subCategory name
  const [categories, setCategories] = useState([]); // All categories, including their subcategories
  const [newCategory, setNewCategory] = useState("");
  const [newSubCategoryName, setNewSubCategoryName] = useState(""); // New state for new subcategory name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api"; // Adjust if your backend is on a different port/URL

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/categories`);
      setCategories(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to fetch categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

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
    if (selectedSubCategoryName) {
      formData.append("subCategory", selectedSubCategoryName); // Use selectedSubCategoryName
    }
    if (image) {
      formData.append("image", image);
    }

    try {
      const loadingToast = toast.loading("Adding product...");
      const response = await axios.post(`${API_BASE_URL}/products`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(response.data.message || "Product added successfully!", { id: loadingToast });
      // Reset form
      setName("");
      setOriginalPrice("");
      setDiscountPrice("");
      setCategoryId("");
      setImage(null);
      setLikes(0);
      setRating(0);
      setDescription("");
      setQuantity("");
      setWeight("");
      setSelectedSubCategoryName(""); // Reset selectedSubCategoryName
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error(err.response?.data?.message || "Failed to add product.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (categoryName, parentId = null) => {
    if (categoryName.trim() === "") return;
    setLoading(true);
    setError(null);
    setSuccess(null);

    const loadingToast = toast.loading("Adding category...");
    try {
      let response;
      if (parentId) {
        // Add subcategory to an existing category
        response = await axios.put(`${API_BASE_URL}/categories/${parentId}/subcategory`, { subCategoryName: categoryName });
        setNewSubCategoryName("");
      } else {
        // Add main category
        response = await axios.post(`${API_BASE_URL}/categories`, { name: categoryName });
        setNewCategory("");
      }
      toast.success(response.data.message || "Category added successfully!", { id: loadingToast });
      fetchCategories(); // Refresh categories list
    } catch (err) {
      console.error("Error adding category/subcategory:", err);
      toast.error(err.response?.data?.message || "Failed to add category/subcategory.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-6 py-8 mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">📦 Add New Product</h1>

      {loading && <div className="mb-4 text-center text-blue-500">Loading...</div>}
      {error && <div className="mb-4 text-center text-red-500">{error}</div>}
      {success && <div className="mb-4 text-center text-green-500">{success}</div>}

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Product Form */}
        <div className="p-8 bg-white shadow-lg rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
                Product Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Original & Discount Price */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="originalPrice" className="block mb-2 font-semibold text-gray-700">
                  Original Price
                </label>
                <input
                  type="number"
                  id="originalPrice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label htmlFor="discountPrice" className="block mb-2 font-semibold text-gray-700">
                  Discount Price
                </label>
                <input
                  type="number"
                  id="discountPrice"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  required
                  step="0.01"
                />
              </div>
            </div>

            {/* Quantity & Weight */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="quantity" className="block mb-2 font-semibold text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div>
                <label htmlFor="weight" className="block mb-2 font-semibold text-gray-700">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  placeholder="e.g. 500g, 1kg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block mb-2 font-semibold text-gray-700">
                Category
              </label>
              <select
                id="category"
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {/* SubCategory Dropdown */}
              {categoryId && (
                <div className="mt-4">
                  <label htmlFor="subCategory" className="block mb-2 font-semibold text-gray-700">
                    SubCategory
                  </label>
                  <select
                    id="subCategory"
                    className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                    value={selectedSubCategoryName}
                    onChange={(e) => setSelectedSubCategoryName(e.target.value)}
                  >
                    <option value="">Select SubCategory (Optional)</option>
                    {categories.find(cat => cat._id === categoryId)?.subcategories.map((subCatName) => (
                      <option key={subCatName} value={subCatName}>
                        {subCatName}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Add new category */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddCategory(newCategory, null)} // Add main category
                  className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                >
                  Add Category
                </button>
              </div>

              {/* Add new subcategory */}
              {categoryId && (
                <div className="flex gap-2 mt-4">
                  <input
                    type="text"
                    placeholder="New subcategory name"
                    value={newSubCategoryName}
                    onChange={(e) => setNewSubCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCategory(newSubCategoryName, categoryId)} // Add subcategory
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Add Subcategory
                  </button>
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block mb-2 font-semibold text-gray-700">
                Product Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            {/* Likes & Rating */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="likes" className="block mb-2 font-semibold text-gray-700">
                  Likes
                </label>
                <input
                  type="number"
                  id="likes"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  min="0"
                />
              </div>
              <div>
                <label htmlFor="rating" className="block mb-2 font-semibold text-gray-700">
                  Rating (1–5)
                </label>
                <input
                  type="number"
                  id="rating"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block mb-2 font-semibold text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-2 font-bold text-white transition duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Adding Product..." : "Save Product"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center justify-start p-6 shadow-md bg-gray-50 rounded-2xl">
          <h2 className="mb-4 text-xl font-bold text-gray-700">Live Preview</h2>
          <div className="w-full max-w-sm overflow-hidden bg-white shadow-lg rounded-xl">
            {image ? (
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="object-cover w-full h-48"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-48 text-gray-500 bg-gray-200">
                No Image
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">{name || "Product Name"}</h3>
              <p className="text-sm text-gray-500">
                {categories.find((c) => c._id === categoryId)?.name || "Category"}
                {selectedSubCategoryName && ` / ${selectedSubCategoryName}`}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {discountPrice ? (
                  <>
                    <span className="font-bold text-red-600">₹{discountPrice}</span>
                    <span className="text-gray-400 line-through">₹{originalPrice || "0"}</span>
                  </>
                ) : (
                  <span className="font-bold text-gray-800">₹{originalPrice || "0"}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600">{description || "Product description..."}</p>
              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>📦 {quantity || 0}</span>
                <span>⚖️ {weight || "0g"}</span>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500">
                <span>❤️ {likes}</span>
                <span>⭐ {rating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}