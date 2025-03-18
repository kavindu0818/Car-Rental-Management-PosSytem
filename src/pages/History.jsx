import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiTrash2, FiBook } from "react-icons/fi";
import { deleteOldBooking, getOldBooking } from "../store/slices/OldBookingSlice.js";
import { useNavigate } from "react-router-dom";

const History = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State
    const { oldbooking: bookings = [], loading, error } = useSelector((state) => state.oldbooking);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking

    useEffect(() => {
        dispatch(getOldBooking());
    }, [dispatch]);

    const handleDelete = (bookingId) => {
        dispatch(deleteOldBooking(bookingId));
        console.log(`Delete booking with ID: ${bookingId}`);
    };

    const handleSetBookingView = (booking) => {
        setSelectedBooking(booking); // Set the selected booking
    };

    // Memoize filtered bookings
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            return (
                booking.carDetails?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customerId?.toString().includes(searchTerm)
            );
        });
    }, [bookings, searchTerm]);

    // Memoize sorted bookings
    const sortedBookings = useMemo(() => {
        return [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [filteredBookings]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!bookings.length) return <p>No bookings found.</p>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Booking History</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400"/>
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

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sortedBookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 text-sm text-gray-500">{booking.carId || "N/A"}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.carDetails || "Unknown Car"}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{booking.customerId || "Unknown Customer"}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{booking.totalAmount || "N/A"}</td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button onClick={() => handleSetBookingView(booking)}
                                            className="text-blue-600 hover:text-blue-900">
                                        <FiBook/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Conditionally render Booking Details section */}
            {selectedBooking && (
                <div className="p-6 bg-white shadow-md rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
                    <p><strong>Car ID:</strong> {selectedBooking.carId}</p>
                    <p><strong>Car Details:</strong> {selectedBooking.carDetails}</p>
                    <p><strong>Customer ID:</strong> {selectedBooking.customerId}</p>
                    <p><strong>Start Date:</strong> {selectedBooking.startDate}</p>
                    <p><strong>End Date:</strong> {selectedBooking.endDate}</p>
                    <p><strong>Payment Method:</strong> {selectedBooking.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> {selectedBooking.paymentStatus}</p>
                    <p><strong>Advance Payment:</strong> {selectedBooking.payAdvance}</p>
                    <p><strong>Total Amount:</strong> {selectedBooking.totalAmount}</p>
                    <p><strong>Price Per Day:</strong> {selectedBooking.pricePerDay}</p>
                    <p><strong>Car Issue:</strong> {selectedBooking.carIssue ? "Yes" : "No"}</p>
                    <p><strong>Arrears:</strong> {selectedBooking.payArrears}</p>
                </div>
            )}
        </div>
    );
};

export default History;