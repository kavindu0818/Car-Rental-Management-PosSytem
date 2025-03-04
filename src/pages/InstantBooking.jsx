import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiSearch, FiEdit, FiTrash2, FiActivity, FiBook } from 'react-icons/fi';
import { deleteBooking, getBookings } from '../store/slices/bookingSlice.js';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const InstantBooking = () => {
  const dispatch = useDispatch();
  const bookings = useSelector(state => state.bookings.bookings || []);
  const navigate = useNavigate(); // Initialize navigate function

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const handleUpdate = (bookingId) => {
    // Implement the update functionality here
    console.log(`Update booking with ID: ${bookingId}`);
  };

  const handleDelete = (bookingId) => {
    dispatch(deleteBooking(bookingId));
    console.log(`Delete booking with ID: ${bookingId}`);
  };

  const handleSetBookingView = (bookingId, bookingDetails) => {
    navigate('/current-booking', {
      state: {
        ...bookingDetails, // Pass the entire booking details as state
        bookingId, // Include the bookingId
      },
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const carDetails = booking.carDetails || '';
    const customerId = booking.customerId || '';

    return (
        carDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerId.includes(searchTerm)
    );
  });

  // Sort bookings by date (most recent first)
  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="input pl-10"
                placeholder="Search by vehicle details or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                    {['Vehicle ID', 'Vehicle Details', 'Customer ID', 'Total Amount', 'Actions'].map((col) => (
                        <th
                            key={col}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {col}
                        </th>
                    ))}
                  </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.carId || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.carDetails || 'Unknown Car'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.customerId || 'Unknown Customer'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.totalAmount || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                              onClick={() => handleSetBookingView(booking.bookingId, booking)} // Pass booking details as argument
                              className="text-red-600 hover:text-red-900"
                          >
                            <FiBook />
                          </button>
                          <button
                              onClick={() => handleDelete(booking.bookingId)}
                              className="text-red-600 hover:text-red-900"
                          >
                            <FiTrash2 />
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}
      </div>
  );
};

export default InstantBooking;
