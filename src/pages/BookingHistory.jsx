import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiSearch, FiFilter, FiCalendar, FiUser, FiTruck } from 'react-icons/fi';

const BookingHistory = () => {
  const { bookings = [] } = useSelector(state => state.bookings || { bookings: [] });
  const { cars = [] } = useSelector(state => state.cars || { cars: [] });
  const { customers = [] } = useSelector(state => state.customers || { customers: [] });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterCar, setFilterCar] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  if (!Array.isArray(bookings)) {
    console.error("bookings is not an array", bookings);
    return <div>Error loading bookings</div>;
  }

  const filteredBookings = bookings.filter(booking => {
    const car = cars.find(c => c.id === booking.carId);
    const customer = customers.find(c => c.id === booking.customerId);

    const carName = car ? `${car.name} ${car.model}` : '';
    const customerName = customer ? customer.name : '';

    const matchesSearch =
        carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.id && booking.id.toString().includes(searchTerm));

    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const matchesCustomer = !filterCustomer || booking.customerId === filterCustomer;
    const matchesCar = !filterCar || booking.carId === filterCar;
    const matchesStartDate = !filterStartDate || new Date(booking.startDate) >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || new Date(booking.endDate) <= new Date(filterEndDate);

    return matchesSearch && matchesStatus && matchesCustomer && matchesCar && matchesStartDate && matchesEndDate;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  className="input pl-10"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FiFilter className="text-gray-400" />
              <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FiUser className="text-gray-400" />
              <select className="input" value={filterCustomer} onChange={(e) => setFilterCustomer(e.target.value)}>
                <option value="">All Customers</option>
                {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FiTruck className="text-gray-400" />
              <select className="input" value={filterCar} onChange={(e) => setFilterCar(e.target.value)}>
                <option value="">All Cars</option>
                {cars.map(car => (
                    <option key={car.id} value={car.id}>{car.name} {car.model}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <FiCalendar className="text-gray-400" />
              <input
                  type="date"
                  className="input"
                  placeholder="Start Date"
                  value={filterStartDate}
                  onChange={(e) => setFilterStartDate(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <FiCalendar className="text-gray-400" />
              <input
                  type="date"
                  className="input"
                  placeholder="End Date"
                  value={filterEndDate}
                  onChange={(e) => setFilterEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {sortedBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No bookings found matching your criteria.</p>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                  <tr>
                    {['Booking ID', 'Customer', 'Car', 'Dates', 'Amount', 'Status', 'Payment', 'Created At'].map((col, index) => (
                        <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {col}
                        </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.map((booking) => {
                    const car = cars.find(c => c.id === booking.carId);
                    const customer = customers.find(c => c.id === booking.customerId);

                    return (
                        <tr key={booking.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{booking.id.slice(0, 8)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</div>
                            <div className="text-sm text-gray-500">{customer?.phone || 'No phone'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{car ? `${car.name} ${car.model}` : 'Unknown Car'}</div>
                            <div className="text-sm text-gray-500">{car ? `${car.year} • ${car.type}` : ''}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.startDate} to {booking.endDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${booking.totalAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.status}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{booking.paymentStatus}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.createdAt}</td>
                        </tr>
                    );
                  })}
                  </tbody>
                </table>
              </div>
            </div>
        )}
      </div>
  );
};

export default BookingHistory;
