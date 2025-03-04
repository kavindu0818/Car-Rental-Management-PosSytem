import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const CurruntBooking = () => {
    const location = useLocation();
    const bookingData = location.state || {}; // Retrieve state passed from the previous page

    const [formData, setFormData] = useState({
        carId: bookingData.carId || "",
        carDetails: bookingData.carDetails || {},
        customerId: bookingData.customerId || "",
        startDate: bookingData.startDate || "",
        endDate: bookingData.endDate || "",
        paymentMethod: bookingData.paymentMethod || "card",
        paymentStatus: bookingData.paymentStatus || "pending",
        status: bookingData.status || "pending",
        payAdvance: bookingData.payAdvance || 0,
        totalAmount: bookingData.totalAmount || 0,
        arrearsAmount: bookingData.arrearsAmount || 0,
        carIssue: bookingData.carIssue ?? true,
    });

    // Calculate totalDays
    const calculateTotalDays = () => {
        if (!formData.startDate || !formData.endDate) return 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = end - start;
        return diffTime > 0 ? Math.ceil(diffTime / (1000 * 60 * 60 * 24)) : 0;
    };

    const totalDays = calculateTotalDays();
    const pricePerDay = formData.carDetails.price || 0;
    const totalAmount = totalDays * pricePerDay;
    const arrearsAmount = totalAmount - formData.payAdvance;

    useEffect(() => {
        setFormData((prevData) => ({
            ...prevData,
            totalAmount,
            arrearsAmount,
        }));
    }, [totalDays, pricePerDay, formData.payAdvance]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <form className="grid grid-cols-3 gap-6 p-6 bg-white shadow-lg rounded-lg">
            {/* Car ID */}
            <div className="col-span-3 grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-md">
                <div className="flex flex-col">
                    <label className="font-semibold">Car ID</label>
                    <input type="text" value={formData.carId} readOnly className="border rounded-md p-2"/>
                </div>

                {/* Car Details */}
                <div className="flex flex-col">
                    <label className="font-semibold">Car Details</label>
                    <input type="text" value={formData.carDetails || "N/A"} readOnly
                           className="border rounded-md p-2"/>
                </div>

                {/* Customer ID */}
                <div className="flex flex-col">
                    <label className="font-semibold">Customer ID</label>
                    <input type="text" value={formData.customerId} readOnly className="border rounded-md p-2"/>
                </div>

                {/* Start Date */}
                <div className="flex flex-col">
                    <label className="font-semibold">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange}
                           className="border rounded-md p-2"/>
                </div>

                {/* End Date */}
                <div className="flex flex-col">
                    <label className="font-semibold">End Date</label>
                    <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange}
                           className="border rounded-md p-2"/>
                </div>

                {/* Payment Method */}
                <div className="flex flex-col">
                    <label className="font-semibold">Payment Method</label>
                    <input type="text" value={formData.paymentMethod} readOnly className="border rounded-md p-2"/>
                </div>

                {/* Payment Status */}
                <div className="flex flex-col">
                    <label className="font-semibold">Payment Status</label>
                    <input type="text" value={formData.paymentStatus} readOnly className="border rounded-md p-2"/>
                </div>

                {/* Booking Status */}
                <div className="flex flex-col">
                    <label className="font-semibold">Booking Status</label>
                    <input type="text" value={formData.status} readOnly className="border rounded-md p-2"/>
                </div>
            </div>

                {/* Price Details */}
                <div className="sm:col-span-6 bg-gray-50 p-4 rounded-md">
                    <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{totalDays} day(s)</span>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>Price per day:</span>
                        <span>Rs.{formData.pricePerDay}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-lg font-bold">
                        <span>Total Amount:</span>
                        <span>Rs.{totalAmount}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                        <span>Advance Price:</span>
                        <span>Rs.{formData.payAdvance}</span>
                    </div>
                    <div className="flex justify-between mt-2 text-lg font-bold">
                        <span>Arrears Amount:</span>
                        <span>Rs.{arrearsAmount}</span>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="col-span-3 flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                        Submit Booking
                    </button>
                </div>
        </form>
);
};

export default CurruntBooking;
