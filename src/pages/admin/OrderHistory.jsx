import React, { useEffect, useState, useMemo } from "react";
import OrderDetailsModal from "../../components/OrderDetailsModal";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrdersAndStatuses = async () => {
      try {
        const ordersResponse = await fetch("http://localhost:5000/api/orders");
        if (!ordersResponse.ok) throw new Error(`HTTP error! status: ${ordersResponse.status}`);
        const ordersData = await ordersResponse.json();

        const historicalOrders = ordersData.orders.filter(
          order => order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
        );
        setOrders(historicalOrders);

        const statusesResponse = await fetch("http://localhost:5000/api/orders/statuses");
        if (!statusesResponse.ok) throw new Error(`HTTP error! status: ${statusesResponse.status}`);
        const statusesData = await statusesResponse.json();
        setAvailableStatuses(statusesData.filter(status => status === "Delivered" || status === "Cancelled"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndStatuses();
  }, []);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderIdMatch = order._id.toLowerCase().includes(search.toLowerCase());
      const productNameMatch = order.items.some(item =>
        item.productId?.name?.toLowerCase().includes(search.toLowerCase())
      );
      return (orderIdMatch || productNameMatch) && (filterStatus ? order.orderStatus === filterStatus : true);
    });
  }, [orders, search, filterStatus]);

  // Pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="py-8 text-center">Loading order history...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container p-2 mx-auto sm:p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800">📜 Order History</h1>

      {/* Search & Filter */}
      <div className="flex flex-col justify-between gap-2 mb-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search by Order ID or Product Name"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 border rounded sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
          className="w-full px-3 py-2 border rounded sm:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Status</option>
          {availableStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {currentOrders.length === 0 ? (
        <p className="text-center text-gray-600">No historical orders found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">#</th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Order ID</th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User ID</th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Products</th>
                <th className="px-6 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Total Amount</th>
                <th className="px-3 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{indexOfFirstOrder + index + 1}</td>
                  <td className="px-3 py-2 text-sm font-medium text-gray-900 truncate max-w-[120px]">{order._id}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-[100px]">{order.userId}</td>
                  <td className="px-3 py-2 text-sm text-gray-500 truncate max-w-[150px]">
                    {order.items.length > 0
                      ? <>
                          {order.items[0].productId ? order.items[0].productId.name : "Product Not Found"}
                          {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                        </>
                      : "N/A"}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-500">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === "Delivered" ? "bg-green-100 text-green-800" :
                      order.orderStatus === "Cancelled" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="flex justify-start px-6 py-2 text-sm sm:justify-end">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-3 py-1 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-wrap justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          order={selectedOrder}
        />
      )}
    </div>
  );
}
