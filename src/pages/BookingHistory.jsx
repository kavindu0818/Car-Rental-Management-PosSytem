import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiTrash2, FiBook } from "react-icons/fi";
import { deleteBookingHistory, getBookingsHistory } from "../store/slices/BookingHistorySlice";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure `bookingsHistory` is always an array to prevent errors
  const bookingsHistory = useSelector((state) => state.bookingsHistory?.bookingsHistory || []);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getBookingsHistory());
  }, [dispatch]);

  console.log(bookingsHistory);

  const handleDelete = (bookingId) => {
    dispatch(deleteBookingHistory(bookingId));
  };

  const handleSetBookingView = (bookingId, bookingDetails) => {
    navigate("/current-booking", {
      state: { ...bookingDetails, bookingId },
    });
  };

  const filteredBookings = bookingsHistory.filter((booking) =>
      (booking.carId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.customerId || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="input pl-10"
                placeholder="Search by vehicle or customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {sortedBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No bookings found.</p>
            </div>
        ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                  {["Vehicle ID", "Vehicle Details", "Customer ID", "Total Amount", "Actions"].map((col) => (
                      <th key={col} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        {col}
                      </th>
                  ))}
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {sortedBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 text-sm">{booking.carId || "N/A"}</td>
                      <td className="px-6 py-4 text-sm">{booking.carDetails || "Unknown Car"}</td>
                      <td className="px-6 py-4 text-sm">{booking.customerId || "Unknown Customer"}</td>
                      <td className="px-6 py-4 text-sm">{booking.totalAmount || "N/A"}</td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={() => handleSetBookingView(booking.id, booking)} className="mr-2 text-blue-600">
                          <FiBook />
                        </button>
                        <button onClick={() => handleDelete(booking.id)} className="text-red-600">
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </div>
  );
};

export default BookingHistory;
