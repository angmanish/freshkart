import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";
import { FaUsers, FaShoppingCart, FaBox, FaClipboardList, FaDollarSign } from 'react-icons/fa';
import { useNotifications } from '../../context/NotificationContext';
import socket from '../../utils/socket';

export default function Dashboard() {
  const { notifications } = useNotifications();

  const [totalUsers, setTotalUsers] = useState('...');
  const [totalProducts, setTotalProducts] = useState('...');
  const [totalOrders, setTotalOrders] = useState('...');
  const [totalRevenue, setTotalRevenue] = useState('...');
  const [pendingOrdersCount, setPendingOrdersCount] = useState('...');
  const [confirmedOrdersCount, setConfirmedOrdersCount] = useState('...');
  const [shippedOrdersCount, setShippedOrdersCount] = useState('...');
  const [deliveredOrdersCount, setDeliveredOrdersCount] = useState('...');
  const [cancelledOrdersCount, setCancelledOrdersCount] = useState('...');
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState(null);

  // Chart data states
  const [salesChartData, setSalesChartData] = useState([]);
  const [ordersByCategoryData, setOrdersByCategoryData] = useState([]);
  const [revenueSourcesData, setRevenueSourcesData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [mostBuyingProducts, setMostBuyingProducts] = useState([]);

  // Filter state for charts
  const [monthsFilter, setMonthsFilter] = useState(12);

  const fetchStats = useCallback(async (months) => {
    setLoadingStats(true);
    try {
      // Fetch Total Users
      const usersResponse = await fetch('http://localhost:5000/api/user/count');
      const usersData = await usersResponse.json();
      setTotalUsers(usersData.count);

      // Fetch Total Products
      const productsResponse = await fetch('http://localhost:5000/api/products');
      const productsData = await productsResponse.json();
      setTotalProducts(productsData.totalProducts);

      // Fetch Total Orders
      const ordersResponse = await fetch('http://localhost:5000/api/orders/count');
      const ordersData = await ordersResponse.json();
      setTotalOrders(ordersData.count);

      // Fetch Total Revenue
      const revenueResponse = await fetch('http://localhost:5000/api/orders/revenue');
      const revenueData = await revenueResponse.json();
      setTotalRevenue(revenueData.totalRevenue.toFixed(2));

      // Fetch Order Status Counts
      const statusCountsResponse = await fetch('http://localhost:5000/api/orders/status-counts');
      const statusCountsData = await statusCountsResponse.json();
      setPendingOrdersCount(statusCountsData.Pending || 0);
      setConfirmedOrdersCount(statusCountsData.Processing || 0);
      setShippedOrdersCount(statusCountsData.Shipped || 0);
      setDeliveredOrdersCount(statusCountsData.Delivered || 0);
      setCancelledOrdersCount(statusCountsData.Cancelled || 0);

      // Fetch chart data
      const salesChartResponse = await fetch(`http://localhost:5000/api/analytics/sales-over-time?months=${months}`);
      const salesChartJson = await salesChartResponse.json();
      setSalesChartData(salesChartJson);
      console.log("Sales Chart Data:", salesChartJson);

      const ordersByCategoryResponse = await fetch(`http://localhost:5000/api/analytics/orders-by-category?months=${months}`);
      const ordersByCategoryJson = await ordersByCategoryResponse.json();
      setOrdersByCategoryData(ordersByCategoryJson);
      console.log("Orders By Category Data:", ordersByCategoryJson);

      const revenueSourcesResponse = await fetch(`http://localhost:5000/api/analytics/revenue-sources?months=${months}`);
      const revenueSourcesJson = await revenueSourcesResponse.json();
      setRevenueSourcesData(revenueSourcesJson);
      console.log("Revenue Sources Data:", revenueSourcesJson);

      const userGrowthResponse = await fetch(`http://localhost:5000/api/analytics/user-growth?months=${months}`);
      const userGrowthJson = await userGrowthResponse.json();
      setUserGrowthData(userGrowthJson);
      console.log("User Growth Data:", userGrowthJson);

      // Fetch most buying products
      const mostBuyingProductsResponse = await fetch(`http://localhost:5000/api/analytics/most-buying-products?months=${months}`);
      const mostBuyingProductsJson = await mostBuyingProductsResponse.json();
      setMostBuyingProducts(mostBuyingProductsJson);
      console.log("Most Buying Products Data:", mostBuyingProductsJson);

    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setErrorStats('Failed to load stats');
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(monthsFilter);

    socket.on('new_order', () => {
      fetchStats(monthsFilter);
    });
    socket.on('order_status_updated', () => {
      fetchStats(monthsFilter);
    });

    return () => {
      socket.off('new_order');
      socket.off('order_status_updated');
    };
  }, [fetchStats, monthsFilter]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="min-h-screen p-6 space-y-6 bg-gray-50">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">📊 Admin Dashboard</h1>
          <p className="text-gray-500">Analytics & insights at a glance</p>
        </div>
        {/* Filter for charts */}
        <select
          value={monthsFilter}
          onChange={(e) => setMonthsFilter(parseInt(e.target.value))}
          className="p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={3}>Last 3 Months</option>
          <option value={6}>Last 6 Months</option>
          <option value={12}>Last 12 Months</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={<FaUsers />} label="Total Users" value={loadingStats ? '...' : totalUsers} />
        <StatCard icon={<FaBox />} label="Products" value={loadingStats ? '...' : totalProducts} />
        <StatCard icon={<FaShoppingCart />} label="Total Orders" value={loadingStats ? '...' : totalOrders} />
        <StatCard icon={<FaDollarSign />} label="Total Revenue" value={loadingStats ? '...' : `₹${totalRevenue}`} />
        <StatCard icon={<FaShoppingCart />} label="Pending Orders" value={loadingStats ? '...' : pendingOrdersCount} />
        <StatCard icon={<FaShoppingCart />} label="Confirmed Orders" value={loadingStats ? '...' : confirmedOrdersCount} />
        <StatCard icon={<FaShoppingCart />} label="Shipped Orders" value={loadingStats ? '...' : shippedOrdersCount} />
        <StatCard icon={<FaShoppingCart />} label="Delivered Orders" value={loadingStats ? '...' : deliveredOrdersCount} />
        <StatCard icon={<FaShoppingCart />} label="Cancelled Orders" value={loadingStats ? '...' : cancelledOrdersCount} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        {/* Sales Line Chart */}
        <Card className="transition-all bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Sales Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis dataKey="month" stroke="#6b7280"/>
                <YAxis stroke="#6b7280"/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Bar Chart */}
        <Card className="transition-all bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Orders by Category</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersByCategoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis dataKey="category" stroke="#6b7280"/>
                <YAxis stroke="#6b7280"/>
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Pie Chart */}
        <Card className="transition-all bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Revenue Sources</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={revenueSourcesData}
                  dataKey="value"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {revenueSourcesData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Active Users Area Chart */}
        <Card className="transition-all bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Active Users Growth</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#6b7280"/>
                <YAxis stroke="#6b7280"/>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#6366f1" fill="url(#colorUsers)" fillOpacity={1} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Most Buying Products Section */}
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <Card className="transition-all bg-white shadow-lg rounded-2xl hover:shadow-2xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Most Buying Products</h2>
            {mostBuyingProducts.length > 0 ? (
              <div className="space-y-4">
                {mostBuyingProducts.map((product) => (
                  <div key={product.name} className="flex items-center gap-4">
                    <div className="text-xl font-bold text-gray-600">{product.rank}.</div>
                    <img src={`http://localhost:5000${product.imageUrl}`} alt={product.name} className="object-cover w-16 h-16 rounded-lg" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.buyingPercentage}% of total sales</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No data available for most buying products.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <Card className="transition-all transform bg-white shadow-md rounded-2xl hover:shadow-xl hover:-translate-y-1">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="text-3xl text-blue-600">{icon}</div>
        <div>
          <p className="text-sm text-gray-400">{label}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
