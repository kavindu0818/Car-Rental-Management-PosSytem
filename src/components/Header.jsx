import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiBell, FiUser, FiSearch } from 'react-icons/fi';

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
      <header className="bg-white shadow-sm z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Sidebar Toggle Button */}
              <button
                  type="button"
                  className="text-gray-500 hover:text-gray-600 lg:hidden"
                  onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <FiMenu className="h-6 w-6" />
              </button>

              {/* Search Input */}
              <div className="hidden md:block ml-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      placeholder="Search"
                      type="search"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              {/* Notifications Button */}
              <div className="relative">
                <button
                    type="button"
                    className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <span className="sr-only">View notifications</span>
                  <FiBell className="h-6 w-6" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <p className="font-medium">New booking</p>
                          <p className="text-xs text-gray-500">Toyota Camry booked by John Doe</p>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <p className="font-medium">Payment received</p>
                          <p className="text-xs text-gray-500">$250 received for booking #1234</p>
                        </div>
                        <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          <p className="font-medium">Car returned</p>
                          <p className="text-xs text-gray-500">Honda Civic returned by Jane Smith</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <Link to="/notifications" className="text-xs font-medium text-primary-600 hover:text-primary-500">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                )}
              </div>

              {/* User Menu */}
              <div className="ml-3 relative">
                <div>
                  <button
                      type="button"
                      className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                      <FiUser />
                    </div>
                  </button>
                </div>

                {/* User Menu Dropdown */}
                {userMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-700">Admin User</p>
                        <p className="text-xs text-gray-500">admin@example.com</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Your Profile
                      </Link>
                      <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Settings
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </button>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
