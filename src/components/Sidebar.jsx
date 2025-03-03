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
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-primary-600">Car Rental POS</h1>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                            location.pathname === item.href
                                ? 'bg-primary-100 text-primary-600'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                    >
                      <item.icon
                          className={`mr-4 h-6 w-6 ${
                              location.pathname === item.href
                                  ? 'text-primary-600'
                                  : 'text-gray-400 group-hover:text-gray-500'
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
          <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1">
              <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-r border-gray-200">
                <h1 className="text-xl font-bold text-primary-600">Car Rental POS</h1>
              </div>

              <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 bg-white border-r border-gray-200 space-y-1">
                  {navigation.map((item) => (
                      <Link
                          key={item.name}
                          to={item.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                              location.pathname === item.href
                                  ? 'bg-primary-100 text-primary-600'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <item.icon
                            className={`mr-3 h-5 w-5 ${
                                location.pathname === item.href
                                    ? 'text-primary-600'
                                    : 'text-gray-400 group-hover:text-gray-500'
                            }`}
                        />
                        {item.name}
                      </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Sidebar;
