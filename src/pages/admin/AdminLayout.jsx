import React, { useState } from 'react';
import AdminSidebar from './Sidebar'; // Sidebar component
import AdminNavbar from './AdminNavbar'; // Navbar component
import { useAuth } from '../../context/AuthContext';
import { NotificationProvider } from '../../context/NotificationContext';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { logout } = useAuth();

  return (
    <NotificationProvider>
      <div className="flex min-h-screen bg-gray-100">
        {/* Sidebar */}
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} logout={logout} />

        {/* Main Content */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 overflow-x-hidden ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>

          {/* Navbar */}
          <AdminNavbar
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
          />

          {/* Page Content */}
          <main className="flex-1 p-4 overflow-auto bg-gray-50">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white shadow p-4 text-center text-gray-600 text-sm">
            <p>&copy; 2023 DMart Admin. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </NotificationProvider>
  );
}
