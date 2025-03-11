import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiFilter, FiCalendar, FiUser, FiTruck } from 'react-icons/fi';
import { getBookingsHistory } from '../store/slices/BookingHistorySlice.js';
import { getCars } from "../store/slices/carsSlice.js";
import { getBookings } from "../store/slices/bookingSlice.js";
import { getCustomers } from "../store/slices/customersSlice.js";

const BookingHistory = () => {
  const dispatch = useDispatch();

  // Fetching data from Redux store
  const { bookings = [] } = useSelector((state) => state.bookingHistory || { bookings: [] });
  const { cars = [] } = useSelector((state) => state.cars || { cars: [] });
  const { customers = [] } = useSelector((state) => state.customers || { customers: [] });
  const { bookings: allBookings = [] } = useSelector((state) => state.bookings || { bookings: [] });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterCar, setFilterCar] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Fetching data when component mounts
  useEffect(() => {
    dispatch(getBookingsHistory());
    dispatch(getBookings());
    dispatch(getCars());
    dispatch(getCustomers());
  }, [dispatch]);

  // Logging fetched data for debugging
  console.log("Booking History:", bookings);
  console.log("Cars:", cars);
  console.log("Customers:", customers);

  // Filter and sort the booking history based on selected filters
  const filteredBookingHistory = Array.isArray(bookings) ? bookings.filter((historyBooking) => {
    const booking = allBookings.find((b) => b.bookingId === historyBooking.bookingId);  // Check if bookingId exists in bookings array
    const customer = customers.find((c) => c.phone === booking?.customerId);
    const car = cars.find((c) => c.number === booking?.carId);

    if (!booking) return false; // Skip if no booking is found

    const carName = car ? `${car.name} ${car.model}` : '';
    const customerName = customer ? customer.name : '';

    const matchesSearch =
        carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.bookingId && booking.bookingId.toString().includes(searchTerm));

    const matchesStatus = !filterStatus || booking.status === filterStatus;
    const matchesCustomer = !filterCustomer || booking.customerId.toString() === filterCustomer.toString();
    const matchesCar = !filterCar || booking.carId.toString() === filterCar.toString();
    const matchesStartDate = !filterStartDate || new Date(booking.startDate) >= new Date(filterStartDate);
    const matchesEndDate = !filterEndDate || new Date(booking.endDate) <= new Date(filterEndDate);

    return matchesSearch && matchesStatus && matchesCustomer && matchesCar && matchesStartDate && matchesEndDate;
  }) : [];

  const sortedBookings = [...filteredBookingHistory].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Modal handling
  const openBookingDetails = (bookingId) => {
    const bookingDetails = bookings.find((b) => b.bookingId === bookingId);
    if (bookingDetails) {
      const car = cars.find((c) => c.number === bookingDetails.carId);
      const customer = customers.find((c) => c.phone === bookingDetails.customerId);
      setSelectedBooking({
        ...bookingDetails,
        car: car ? `${car.name} ${car.model}` : 'Unknown Car',
        customer: customer ? customer.name : 'Unknown Customer'
      });
    }
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        </div>

        {/* Filter section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
                type="text"
                className="input"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className="input" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select className="input" value={filterCustomer} onChange={(e) => setFilterCustomer(e.target.value)}>
              <option value="">All Customers</option>
              {customers.map((customer) => (
                  <option key={customer.phone} value={customer.phone}>
                    {customer.name}
                  </option>
              ))}
            </select>
          </div>
        </div>

        {/* Booking Table */}
        {sortedBookings.length === 0 ? (
            <p>No bookings found matching your criteria.</p>
        ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Car</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {sortedBookings.map((booking) => {
                  const car = cars.find((c) => c.number === booking.carId);
                  const customer = customers.find((c) => c.phone === booking.customerId);

                  return (
                      <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{customer ? customer.name : 'Unknown Customer'}</td>
                        <td>{car ? `${car.name} ${car.model}` : 'Unknown Car'}</td>
                        <td>{booking.startDate} to {booking.endDate}</td>
                        <td>${booking.totalAmount}</td>
                        <td>{booking.status}</td>
                        <td>{booking.paymentStatus}</td>
                        <td>
                          <button onClick={() => openBookingDetails(booking.bookingId)}>View</button>
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
        )}

        {/* Booking Modal */}
        {selectedBooking && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-2xl font-bold">Booking Details</h2>
                <p><strong>Booking ID:</strong> {selectedBooking.bookingId}</p>
                <p><strong>Customer:</strong> {selectedBooking.customer}</p>
                <p><strong>Car:</strong> {selectedBooking.car}</p>
                <p><strong>Dates:</strong> {selectedBooking.startDate} to {selectedBooking.endDate}</p>
                <p><strong>Amount:</strong> ${selectedBooking.totalAmount}</p>
                <p><strong>Status:</strong> {selectedBooking.status}</p>
                <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
                <button onClick={closeModal}>Close</button>
              </div>
            </div>
        )}
      </div>
  );
};

export default BookingHistory;
