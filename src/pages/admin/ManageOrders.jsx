import React, { useEffect, useState, useMemo } from "react";
import toast from 'react-hot-toast';
import OrderDetailsModal from "../../components/OrderDetailsModal";

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [availableStatuses, setAvailableStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrdersAndStatuses = async () => {
      setLoading(true);
      try {
        const ordersResponse = await fetch(`http://localhost:5000/api/orders?page=${currentPage}&limit=${ordersPerPage}`);
        if (!ordersResponse.ok) throw new Error(`HTTP error! status: ${ordersResponse.status}`);
        const ordersData = await ordersResponse.json();
        
        const activeOrders = ordersData.orders.filter(order => order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled');
        setOrders(activeOrders);
        setTotalPages(ordersData.totalPages);

        if (availableStatuses.length === 0) {
          const statusesResponse = await fetch("http://localhost:5000/api/orders/statuses");
          if (!statusesResponse.ok) throw new Error(`HTTP error! status: ${statusesResponse.status}`);
          const statusesData = await statusesResponse.json();
          setAvailableStatuses(statusesData.filter(status => status !== 'Delivered' && status !== 'Cancelled'));
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrdersAndStatuses();
  }, [currentPage]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const loadingToast = toast.loading("Updating order status...");
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to update order status: ${response.statusText}`);

      setOrders(prev =>
        prev.map(order => (order._id === orderId ? { ...order, orderStatus: newStatus } : order))
      );
      toast.success("Order status updated successfully!", { id: loadingToast });
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Error updating order status.', { id: loadingToast });
    }
  };

  const handleDelete = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      const loadingToast = toast.loading("Deleting order...");
      setOrders(prev => prev.filter(order => order._id !== orderId));
      toast.success("Order deleted successfully!", { id: loadingToast });
      // TODO: delete from backend
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderIdMatch = order._id.toLowerCase().includes(search.toLowerCase());
      const productNameMatch = order.items.some(item =>
        item.productId?.name?.toLowerCase().includes(search.toLowerCase())
      );
      return (orderIdMatch || productNameMatch) && (filterStatus ? order.orderStatus === filterStatus : true);
    });
  }, [orders, search, filterStatus]);

  const currentOrders = filteredOrders;

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleNext = () => { if (currentPage < totalPages) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };

  if (loading) return <div className="py-4 text-center">Loading orders...</div>;
  if (error) return <div className="py-4 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container p-4 mx-auto bg-white rounded-lg shadow-md sm:p-6">
      <h1 className="text-3xl font-bold text-gray-800">📋 Manage Orders</h1>

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
          {availableStatuses.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      {currentOrders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-full border border-gray-200">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Sr No.</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Order ID</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">User ID</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Products</th>
                <th className="px-6 py-2 text-xs font-medium text-left text-gray-500 uppercase">Total Amount</th>
                <th className="px-3 py-2 text-xs font-medium text-left text-gray-500 uppercase">Status</th>
                <th className="px-6 py-2 text-xs font-medium text-left text-gray-500 uppercase">Date</th>
                <th className="px-6 py-2 text-xs font-medium text-left text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentOrders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{(currentPage - 1) * ordersPerPage + index + 1}</td>
                  <td className="py-2 px-3 text-sm font-medium text-gray-900 truncate max-w-[120px]">{order._id}</td>
                  <td className="py-2 px-3 text-sm text-gray-500 truncate max-w-[100px]">{order.userId}</td>
                  <td className="py-2 px-3 text-sm text-gray-500 truncate max-w-[150px]">
                    {order.items.length > 0 ? (
                      <>
                        {order.items[0].productId ? order.items[0].productId.name : "Product Not Found"}
                        {order.items.length > 1 && ` (+${order.items.length - 1} more)`}
                      </>
                    ) : "N/A"}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-500">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-3 py-2 text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.orderStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.orderStatus === 'Confirmed' ? 'bg-blue-100 text-blue-800' :
                      order.orderStatus === 'Shipped' ? 'bg-indigo-100 text-indigo-800' :
                      order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                    }`}>{order.orderStatus}</span>
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="relative flex flex-col flex-wrap justify-end gap-1 px-6 py-2 text-sm font-medium sm:flex-nowrap">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-2 py-1 text-xs text-indigo-600 border border-indigo-200 rounded hover:text-indigo-900"
                    >
                      View
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === order._id ? null : order._id)}
                        className="px-2 py-1 mt-1 text-xs text-gray-600 border border-gray-200 rounded hover:text-gray-900"
                        disabled={order.orderStatus === 'Delivered'}
                      >
                        Change Status
                      </button>
                      {openDropdownId === order._id && (
                        <div className="absolute right-0 z-10 w-32 py-1 mt-1 bg-white rounded-md shadow-lg">
                          {order.orderStatus === 'Pending' && (
                            <button
                              onClick={() => { handleStatusChange(order._id, 'Confirmed'); setOpenDropdownId(null); }}
                              className="block w-full px-4 py-2 text-sm text-left text-blue-600 hover:bg-gray-100"
                            >
                              Confirm
                            </button>
                          )}
                          {order.orderStatus !== 'Shipped' && order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                            <button
                              onClick={() => { handleStatusChange(order._id, 'Shipped'); setOpenDropdownId(null); }}
                              className="block w-full px-4 py-2 text-sm text-left text-indigo-600 hover:bg-gray-100"
                            >
                              Ship
                            </button>
                          )}
                          {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                            <button
                              onClick={() => { handleStatusChange(order._id, 'Delivered'); setOpenDropdownId(null); }}
                              className="block w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-gray-100"
                            >
                              Deliver
                            </button>
                          )}
                          {order.orderStatus !== 'Cancelled' && (
                            <button
                              onClick={() => { handleStatusChange(order._id, 'Cancelled'); setOpenDropdownId(null); }}
                              className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-2 py-1 mt-1 text-xs text-red-600 border border-red-200 rounded hover:text-red-900"
                    >
                      Delete
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
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
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
