import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import { Toaster } from "react-hot-toast";

// ✅ Page imports
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ShopDetail from "./pages/ShopDetail";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

// ✅ Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AddProducts from "./pages/admin/AddProducts";
import ManageProducts from "./pages/admin/ManageProducts";
import ManageOrders from "./pages/admin/ManageOrders";
import OrderHistory from "./pages/admin/OrderHistory";
import ManageUsers from "./pages/admin/ManageUsers";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProfile from "./pages/admin/AdminProfile";
import CustomerMessages from "./pages/admin/CustomerMessages";

// ✅ Customer pages
import CustomerProfile from "./pages/customer/Profile";
import Address from "./pages/customer/Address";
import ShoppingPreferences from "./pages/customer/ShoppingPreferences";
import AccountSettings from "./pages/customer/AccountSettings";
import History from "./pages/customer/History";
import MyOrders from "./pages/customer/MyOrders";
import Wishlist from "./pages/customer/Wishlist";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/shop-detail" element={<Layout><ShopDetail /></Layout>} />
          <Route path="/about-us" element={<Layout><AboutUs /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />

          {/* Admin Routes (inside AdminLayout) */}
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AddProducts /></AdminLayout>} />
          <Route path="/admin/manage-products" element={<AdminLayout><ManageProducts /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><ManageOrders /></AdminLayout>} />
          <Route path="/admin/order-history" element={<AdminLayout><OrderHistory /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><ManageUsers /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />
          <Route path="/admin/profile" element={<AdminLayout><AdminProfile /></AdminLayout>} />
          <Route path="/admin/messages" element={<AdminLayout><CustomerMessages /></AdminLayout>} />

          {/* Customer Profile Routes */}
          <Route path="/customer-profile" element={<Layout><CustomerProfile /></Layout>} />
          <Route path="/customer-profile/address" element={<Layout><Address /></Layout>} />
          <Route path="/customer-profile/preferences" element={<Layout><ShoppingPreferences /></Layout>} />
          <Route path="/customer-profile/settings" element={<Layout><AccountSettings /></Layout>} />
          <Route path="/customer-profile/history" element={<Layout><History /></Layout>} />
          <Route path="/customer-profile/my-orders" element={<Layout><MyOrders /></Layout>} />
          <Route path="/customer-profile/wishlist" element={<Layout><Wishlist /></Layout>} />

          {/* Optional 404 Page */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
