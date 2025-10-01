// src/pages/Admin/ManageProducts.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from 'react-hot-toast';
import EditProductModal from "../../components/EditProductModal";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // You can make this configurable
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch products
  const loadProducts = async (page = currentPage) => {
    try {
      setLoading(true);
      const apiUrl = `http://localhost:5000/api/products?page=${page}&limit=${productsPerPage}&search=${searchTerm}`;
      console.log("Fetching products from:", apiUrl);
      const res = await axios.get(apiUrl);
      console.log("API Response Data:", res.data);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalProducts);
      setCurrentPage(page); // Update current page after successful fetch
      setLoading(false);
    } catch (err) {
      setError("Failed to load products");
      setLoading(false);
      console.error("Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage, searchTerm]); // Add searchTerm to dependency array

  // ✅ Handle Edit
  const handleEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // ✅ Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    const loadingToast = toast.loading("Deleting product...");
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      toast.success("Product deleted successfully!", { id: loadingToast });
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err.response?.data || err);
      toast.error("Failed to delete product.", { id: loadingToast });
    }
  };



  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold text-indigo-600">
        Manage Products
      </h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products by name..."
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <p className="p-6 text-center">Loading products...</p>}
      {error && <p className="p-6 text-center text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-white border rounded shadow-md">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-white bg-indigo-600">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="px-4 py-2">
                    <img
                      src={product.imageUrl ? `http://localhost:5000${product.imageUrl}` : 'https://via.placeholder.com/48'}
                      alt={product.name}
                      className="object-cover w-12 h-12 rounded"
                    />
                  </td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">
                    {product.categoryId?.name || "—"}
                  </td>
                  <td className="px-4 py-2">₹{product.discountPrice}</td>
                  <td className="px-4 py-2">{product.quantity}</td>
                  <td className="flex justify-end gap-3 px-4 py-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-3 py-1 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button
            onClick={() => loadProducts(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => loadProducts(index + 1)}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium border border-gray-300 ${
                currentPage === index + 1
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={() => loadProducts(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
          >
            Next
          </button>
        </nav>
      </div>

      {/* ✅ Edit Modal */}
      {isModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setIsModalOpen(false)}
          onUpdate={loadProducts}
        />
      )}
    </div>
  );
}
