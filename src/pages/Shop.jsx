import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/products?all=true`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

        setProducts(productsResponse.data.products || []);
        setAllCategories(categoriesResponse.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load products or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = products.filter((product) => {
    const term = searchTerm.toLowerCase();
    const matchesName = product.name.toLowerCase().includes(term);
    const matchesCategory = allCategories
      .find((cat) => cat._id === product.categoryId?._id)
      ?.name.toLowerCase()
      .includes(term);
    const matchesSubCategory = product.subCategory?.toLowerCase().includes(term);
    return matchesName || matchesCategory || matchesSubCategory;
  });

  // Filter by selected category
  const filterByCategory = (productsList) => {
    if (!selectedCategory) return productsList;
    return productsList.filter((p) => p.categoryId?._id === selectedCategory);
  };

  // Render category circles
  const renderCategoryCircles = () => {
    if (!allCategories.length) return null;

    const categoriesWithProducts = allCategories.filter((cat) =>
      products.some((p) => p.categoryId?._id === cat._id)
    );

    return (
      <div className="mb-12">
        <SectionHeading title="Browse by Category" />
        <div className="flex flex-wrap justify-center gap-6">
          {categoriesWithProducts.map((cat) => {
            const firstProduct = products.find((p) => p.categoryId?._id === cat._id);
            return (
              <div
                key={cat._id}
                className={`flex flex-col items-center cursor-pointer transform transition duration-300 hover:scale-110 ${
                  selectedCategory === cat._id ? "ring-4 ring-blue-400 rounded-full" : ""
                }`}
                onClick={() =>
                  setSelectedCategory(selectedCategory === cat._id ? null : cat._id)
                }
              >
                <div className="w-24 h-24 overflow-hidden border-2 border-blue-300 rounded-full shadow-lg">
                  <img
                    src={
                      firstProduct?.imageUrl
                        ? `http://localhost:5000${firstProduct.imageUrl}`
                        : "https://via.placeholder.com/150"
                    }
                    alt={firstProduct?.name || cat.name}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-700">{cat.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProductGrid = (productsToRender, renderedProductIds) => {
    const uniqueProducts = productsToRender.filter(
      (product) => !renderedProductIds.has(product._id)
    );
    uniqueProducts.forEach((product) => renderedProductIds.add(product._id));

    if (uniqueProducts.length === 0) {
      return <p className="text-center text-gray-500 col-span-full">No products found.</p>;
    }

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {uniqueProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="container py-8 mx-auto text-center">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="container py-8 mx-auto text-center text-red-500">Error: {error}</div>
    );
  }

  const renderedProductIds = new Set();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen px-4 py-8 bg-gray-100"
    >
      {/* Header + Search */}
      <div className="flex flex-col items-center justify-between gap-4 mb-8 md:flex-row">
        <SectionHeading title="Our Products" />
        <div className="w-full max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search product, category, or subcategory"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Category filter */}
      {renderCategoryCircles()}

      {/* Sections */}
      <section className="mb-12">
        <SectionHeading title="Top Rated Products" />
        {renderProductGrid(
          filterByCategory(filteredProducts)
            .filter((p) => p.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Most Liked Products" />
        {renderProductGrid(
          filterByCategory(filteredProducts)
            .sort((a, b) => b.likes - a.likes)
            .slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="New Arrivals" />
        {renderProductGrid(
          filterByCategory(filteredProducts)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Best Deals" />
        {renderProductGrid(
          filterByCategory(filteredProducts)
            .filter((p) => p.discountPrice && p.originalPrice > p.discountPrice)
            .sort(
              (a, b) =>
                b.originalPrice - b.discountPrice - (a.originalPrice - a.discountPrice)
            )
            .slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Featured Products" />
        {renderProductGrid(
          filterByCategory(filteredProducts).filter((p) => p.likes > 0).slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Products with Discount" />
        {renderProductGrid(
          filterByCategory(filteredProducts).filter((p) => p.discountPrice > 0).slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Popular Products" />
        {renderProductGrid(
          filterByCategory(filteredProducts)
            .filter((p) => p.likes > 0 && p.rating > 0)
            .sort((a, b) => b.likes + b.rating - (a.likes + a.rating))
            .slice(0, 8),
          renderedProductIds
        )}
      </section>

      <section className="mb-12">
        <SectionHeading title="Explore Our Collection" />
        {renderProductGrid(filterByCategory(filteredProducts), renderedProductIds)}
      </section>
    </motion.div>
  );
}
