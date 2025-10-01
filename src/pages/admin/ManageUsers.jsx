import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaIdBadge } from 'react-icons/fa';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/user`);
      setUsers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return <div className="py-10 text-center">Loading users...</div>;
  }

  return (
    <div className="container px-2 py-8 mx-auto sm:px-6">
      <h1 className="text-3xl font-bold text-gray-800">👥 Manage Users</h1>

      {/* Search */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border rounded sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden p-6 overflow-x-auto bg-white shadow-xl sm:block rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sr.</th>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">User ID</th>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Email</th>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Phone</th>
              <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentUsers.map((user, index) => (
              <tr key={user._id} className="transition hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{indexOfFirstUser + index + 1}</td>
                <td className="px-4 py-2 text-sm text-purple-600 truncate max-w-[120px] flex items-center gap-1"><FaIdBadge className="text-lg" />{user._id}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800 truncate max-w-[200px]">{user.email}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{user.phone}</td>
                <td className="px-4 py-2 text-sm text-gray-600">{new Date(user.registrationDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentUsers.length === 0 && <p className="py-4 text-center text-gray-500">No users found.</p>}
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 sm:hidden">
        {currentUsers.map((user, index) => (
          <div key={user._id} className="flex flex-col gap-2 p-4 bg-white shadow rounded-xl">
            <p className="text-sm text-gray-500">Sr. {indexOfFirstUser + index + 1}</p>
            <p className="text-sm text-purple-600 flex items-center gap-1"><FaIdBadge className="text-lg" />{user._id}</p>
            <p className="font-semibold text-gray-800 truncate">{user.name}</p>
            <p className="text-sm text-gray-800 truncate">{user.email}</p>
            <p className="text-sm text-gray-800">{user.phone}</p>
            <p className="text-xs text-gray-600">Registered: {new Date(user.registrationDate).toLocaleDateString()}</p>
          </div>
        ))}
        {currentUsers.length === 0 && <p className="py-4 text-center text-gray-500">No users found.</p>}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center gap-2 mt-6">
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
    </div>
  );
}
