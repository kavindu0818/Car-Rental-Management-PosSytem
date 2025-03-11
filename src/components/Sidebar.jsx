import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiX,
  FiHome,
  FiTruck,
  FiCalendar,
  FiUsers,
  FiClock,
  FiZap,
  FiSettings
} from 'react-icons/fi';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: FiHome },
    { name: 'Cars', href: '/cars', icon: FiTruck },
    { name: 'Bookings', href: '/bookings', icon: FiCalendar },
    { name: 'Booking History', href: '/booking-history', icon: FiClock },
    { name: 'Customers', href: '/customers', icon: FiUsers },
    { name: 'Instant Booking', href: '/instant-booking', icon: FiZap },
    { name: 'Settings', href: '/settings', icon: FiSettings },
  ];

  return (
      <>
        {/* Mobile sidebar */}
        <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-900 text-white shadow-lg">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
                  onClick={() => setSidebarOpen(false)}
              >
                <FiX className="h-6 w-6 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center px-4">
              <h1 className="text-2xl font-bold text-white">Car Rental POS</h1>
            </div>

            <div className="mt-5 flex-1 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition duration-200 ease-in-out ${
                            location.pathname === item.href
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      <item.icon
                          className={`mr-3 h-6 w-6 ${
                              location.pathname === item.href
                                  ? 'text-white'
                                  : 'text-gray-400 group-hover:text-white'
                          }`}
                      />
                      {item.name}
                    </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Desktop sidebar */}
        <div className="hidden lg:flex lg:flex-shrink-0">
          <div className="flex flex-col w-64 bg-gray-900 text-white h-screen shadow-xl">
            <div className="flex items-center h-16 px-4 bg-gray-800 border-b border-gray-700">
              <h1 className="text-xl font-bold text-white">Car Rental POS</h1>
            </div>

            <div className="flex-1 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition duration-200 ease-in-out ${
                            location.pathname === item.href
                                ? 'bg-gray-700 text-white'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        }`}
                    >
                      <item.icon
                          className={`mr-3 h-5 w-5 ${
                              location.pathname === item.href
                                  ? 'text-white'
                                  : 'text-gray-400 group-hover:text-white'
                          }`}
                      />
                      {item.name}
                    </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </>
  );
};

export default Sidebar;