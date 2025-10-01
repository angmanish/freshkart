import React, { useState } from "react";
import { FaTimes, FaBars, FaBell } from "react-icons/fa";
import { useNotifications } from '../../context/NotificationContext'; // Import useNotifications

const AdminNavbar = ({ isOpen, setIsOpen }) => {
  const { newOrderCount, notifications, clearNewOrderCount, markAllNotificationsAsRead } = useNotifications(); // Use the notification context
  const [showNotifications, setShowNotifications] = useState(false);

  const handleNotificationClick = () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications) {
      clearNewOrderCount(); // Clear count when opening the dropdown
      markAllNotificationsAsRead(); // Mark all as read
    }
  };
  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-indigo-800 to-indigo-900 shadow-lg px-4 py-3 flex items-center justify-between transition-all duration-300">
      {/* Sidebar toggle button with 3D + gradient */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-white 
                   bg-gradient-to-br from-purple-500 to-indigo-600 
                   shadow-[0_4px_0_0_rgba(0,0,0,0.25)] 
                   active:shadow-[0_1px_0_0_rgba(0,0,0,0.3)] 
                   active:translate-y-[3px] 
                   transition-all duration-150"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
      >
        {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg sm:text-xl font-semibold tracking-wide text-white">
          Admin Dashboard
        </h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 relative">
        {/* Notification Icon */}
        <button
          onClick={handleNotificationClick}
          className="relative p-2 rounded-lg text-white 
                     bg-gradient-to-br from-blue-500 to-cyan-600 
                     shadow-[0_4px_0_0_rgba(0,0,0,0.25)] 
                     active:shadow-[0_1px_0_0_rgba(0,0,0,0.3)] 
                     active:translate-y-[3px] 
                     transition-all duration-150"
          title="Notifications"
        >
          <FaBell size={18} />
          {newOrderCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2">
              {newOrderCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 top-full">
            <h3 className="text-lg font-semibold px-4 py-2 border-b">Notifications</h3>
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div
                  key={notification.id || index} // Use index as fallback key if id is not unique
                  className={`px-4 py-2 text-sm border-b last:border-b-0 ${notification.read ? 'text-gray-500' : 'font-medium text-gray-900'}`}
                >
                  <p>{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.timestamp}</p>
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-sm text-gray-500">No new notifications.</p>
            )}
          </div>
        )}


      </div>
    </nav>
  );
};

export default AdminNavbar;


