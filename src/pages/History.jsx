import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiTrash2, FiBook, FiX } from "react-icons/fi";
import { deleteOldBooking, getOldBooking } from "../store/slices/OldBookingSlice.js";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import {GrDocumentUser} from "react-icons/gr";
import {BiHistory} from "react-icons/bi"; // Import the modal library

// Set the root element for accessibility (required by react-modal)
Modal.setAppElement("#root");

const History = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Redux State
    const { oldbooking: bookings = [], loading, error } = useSelector((state) => state.oldbooking);

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null); // State for selected booking
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

    useEffect(() => {
        dispatch(getOldBooking());
    }, [dispatch]);

    const handleDelete = (bookingId) => {
        dispatch(deleteOldBooking(bookingId));
        console.log(`Delete booking with ID: ${bookingId}`);
    };

    const handleSetBookingView = (booking) => {
        setSelectedBooking(booking); // Set the selected booking
        setIsModalOpen(true); // Open the modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedBooking(null); // Clear the selected booking
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

    if (loading) return <p className="text-center py-8">Loading...</p>;
    if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;
    if (!bookings.length) return <p className="text-center py-8">No bookings found.</p>;

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <BiHistory className="text-5xl text-blue-900"/>
                    <div>
                        <h1 className="text-3xl font-bold text-blue-950">Booking History</h1>
                        <h6 className="text-gray-500 text-lg font-bold">Manage your fleet efficiently</h6>
                        {/*<h1 className="text-3xl font-bold text-blue-950">Car Management</h1>*/}
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiSearch className="h-5 w-5 text-gray-400"/>
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Search by vehicle details or customer ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle
                                Details
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {sortedBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 text-sm text-gray-500">{booking.carId || "N/A"}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{booking.carDetails || "Unknown Car"}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{booking.customerId || "Unknown Customer"}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{booking.totalAmount || "N/A"}</td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <button
                                        onClick={() => handleSetBookingView(booking)}
                                        className="text-blue-600 hover:text-blue-900 transition-colors"
                                    >
                                        <FiBook className="h-5 w-5"/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Booking Details */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Booking Details"
                className="modal"
                overlayClassName="modal-overlay"
            >
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <div
                        className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 relative">
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-300 hover:text-white transition-colors"
                        >
                            <FiX className="h-6 w-6"/>
                        </button>

                        {/* Modal Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold relative left-56 text-white">Booking Details</h2>
                        </div>

                        {/* Modal Content */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Car ID:</strong> {selectedBooking?.carId}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Car
                                        Details:</strong> {selectedBooking?.carDetails}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Customer
                                        ID:</strong> {selectedBooking?.customerId}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Start Date:</strong> {selectedBooking?.startDate}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">End Date:</strong> {selectedBooking?.endDate}
                                </p>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Payment
                                        Method:</strong> {selectedBooking?.paymentMethod}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Payment
                                        Status:</strong> {selectedBooking?.paymentStatus}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Advance
                                        Payment:</strong> {selectedBooking?.payAdvance}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Total
                                        Amount:</strong> {selectedBooking?.totalAmount}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Price Per
                                        Day:</strong> {selectedBooking?.pricePerDay}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Car
                                        Issue:</strong> {selectedBooking?.carIssue ? "Yes" : "No"}
                                </p>
                                <p className="text-gray-200">
                                    <strong className="text-gray-400">Arrears:</strong> {selectedBooking?.payArrears}
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-6 border-t border-gray-500 pt-4">
                            <p className="text-sm text-gray-300">
                                For more details, contact support.
                            </p>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default History;