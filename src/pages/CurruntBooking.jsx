import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { deleteBooking, updateBooking } from "../store/slices/bookingSlice";
import {saveHistory} from "../store/slices/HistorySlice.js";
import {toast} from "react-toastify"; // Import the action

const CurruntBooking = () => {
    const location = useLocation();
    const bookingData = location.state || {};
    const [arrears, setArrears] = useState(bookingData.arrearsAmount || 0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            carId: bookingData.carId || "",
            carDetails: bookingData.carDetails || "N/A",
            customerId: bookingData.customerId || "",
            startDate: bookingData.startDate || "",
            endDate: bookingData.endDate || "",
            paymentMethod: bookingData.paymentMethod || "card",
            paymentStatus: bookingData.paymentStatus || "pending",
            status: bookingData.status || "pending",
            payAdvance: bookingData.payAdvance || 0,
            totalAmount: bookingData.totalAmount || 0,
            pricePerDay: bookingData.pricePerDay || "",
            carIssue: bookingData.carIssue ?? true,
            carReceived: false,
            paymentComplete: false,
            payArrears: "",
        },
        validationSchema: Yup.object({
            payArrears: Yup.number()
                .min(0, "Arrears payment must be positive")
                .max(arrears, "Cannot pay more than arrears amount")
                .required("Required"),
        }),
        onSubmit: (values) => {
            console.log("Form submitted with values:", values);
        },
    });

    const formikHistory = useFormik({
        initialValues: {
            bookingId: bookingData.bookingId || "",
            statusUpdate: " booking Complete",
            timestamp: new Date().toISOString(),
            carId: bookingData.carId || "",
            carDetails: bookingData.carDetails || "N/A",
            customerId: bookingData.customerId || "",
            startDate: bookingData.startDate || "",
            endDate: bookingData.endDate || "",
            paymentMethod: bookingData.paymentMethod || "card",
            paymentStatus: bookingData.paymentStatus || "pending",
            status: bookingData.status || "pending",
            payAdvance: bookingData.payAdvance || 0,
            totalAmount: bookingData.totalAmount || 0,
            pricePerDay: bookingData.pricePerDay || "",
            carIssue: bookingData.carIssue ?? true,
            payArrears: "",

        },
        onSubmit: async (values) => {
            try {
                await dispatch(saveHistory(values)); // Dispatch the action to store booking in history
                // toast.success("✅!.", {
                //     position: "top-right",
                //     autoClose: 3000,
                //     hideProgressBar: false,
                //     closeOnClick: true,
                //     pauseOnHover: true,
                //     draggable: true,
                //     progress: undefined,
                //     theme: "colored",
                //     style: { backgroundColor: "green", color: "#ffffff" }, // Dark Blue Background & White Text
                // });
                navigate('/instant-booking');
            } catch (error) {
                console.error("Error sending booking to history:", error);
                alert("Failed to send booking to history.");
            }
        },
    });

    const handlePayArrears = () => {
        const payment = parseFloat(formik.values.payArrears) || 0;
        if (payment > 0 && payment <= arrears) {
            setArrears((prevArrears) => prevArrears - payment);
            formik.setFieldValue("payArrears", "");
            toast.success("✅ Arrears Amount Done", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                style: { backgroundColor: "green", color: "#ffffff" }, // Dark Blue Background & White Text
            });
        }
    };

    const handleDeleteBooking = async () => {
        if (formik.values.carReceived && formik.values.paymentComplete) {
            try {
                await formikHistory.handleSubmit();
                await dispatch(deleteBooking(bookingData.bookingId)).unwrap();
                toast.success(`✅ Booking Complete!`, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    style: { backgroundColor: "#0b072b", color: "#ffffff" }, // Dark Blue Background & White Text
                });
                navigate("/instant-booking");
            } catch (error) {
                console.error("Error deleting booking:", error);
                alert("Failed to delete booking.");
            }
        } else {
            alert("Booking cannot be deleted until all conditions are met.");
        }
    };

    // const handleSendToHistory = async () => {
    //     if (!formik.values.carReceived || !formik.values.paymentComplete) {
    //         alert("Complete the booking process before sending it to history.");
    //         return;
    //     }
    //
    //     // Trigger form submission to send booking to history
    //     await formikHistory.handleSubmit();
    // };

    const calculateTotalDays = () => {
        if (!formik.values.startDate || !formik.values.endDate) return 0;
        const start = new Date(formik.values.startDate);
        const end = new Date(formik.values.endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
    };


    return (
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-3 gap-6 p-6 bg-white shadow-lg rounded-lg">
            <div className="col-span-3 grid grid-cols-3 gap-4 bg-gray-100 p-4 rounded-md">
                {[
                    {label: "Car ID", value: formik.values.carId},
                    {label: "Car Details", value: formik.values.carDetails},
                    {label: "Customer ID", value: formik.values.customerId},
                    {label: "Payment Method", value: formik.values.paymentMethod},
                    {label: "Payment Status", value: formik.values.paymentStatus},
                    {label: "Booking Status", value: formik.values.status},
                ].map((item, idx) => (
                    <div key={idx} className="flex flex-col">
                        <label className="font-semibold">{item.label}</label>
                        <input type="text" value={item.value} readOnly className="border rounded-md p-2"/>
                    </div>
                ))}
                <div className="flex flex-col">
                    <label className="font-semibold">Start Date</label>
                    <input type="date" name="startDate" value={formik.values.startDate} onChange={formik.handleChange}
                           className="border rounded-md p-2"/>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold">End Date</label>
                    <input type="date" name="endDate" value={formik.values.endDate} onChange={formik.handleChange}
                           className="border rounded-md p-2"/>
                </div>
            </div>
            <div className="sm:col-span-3">
                <label htmlFor="payArrears" className="block text-sm font-medium text-gray-700">Pay Arrears Payment
                    (Rs)</label>
                <div className="flex">
                    <input type="number" name="payArrears" id="payArrears" className="border rounded-md p-2 w-full"
                           onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.payArrears}/>
                    <button type="button" onClick={handlePayArrears}
                            className="ml-2 bg-black text-white px-4 py-2 rounded-md hover:bg-green-700">Pay
                    </button>
                </div>
                {formik.touched.payArrears && formik.errors.payArrears && (
                    <p className="text-red-500">{formik.errors.payArrears}</p>
                )}
            </div>
            <div className="sm:col-span-3 flex flex-col space-y-2">
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="carReceived" className="h-5 w-5" onChange={formik.handleChange}
                           checked={formik.values.carReceived}/>
                    <span>Car Received</span>
                </label>
                <label className="flex items-center space-x-2">
                    <input type="checkbox" name="paymentComplete" className="h-5 w-5" onChange={formik.handleChange}
                           checked={formik.values.paymentComplete}/>
                    <span>Payment Complete</span>
                </label>
            </div>

            <div className="sm:col-span-6 bg-gray-50 p-4 rounded-md">
                <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{calculateTotalDays()} day(s)</span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Price per day:</span>
                    <span>Rs.{formik.values.pricePerDay || 0}</span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>Rs.{formik.values.totalAmount}</span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Advance Price:</span>
                    <span>Rs.{formik.values.payAdvance}</span>
                </div>
                <div className="flex justify-between mt-2 text-lg font-bold">
                    <span>Remaining Arrears Amount:</span>
                    <span>Rs.{arrears}</span>
                </div>
            </div>

            <div className="col-span-3 flex justify-end">
                <button type="button" onClick={handleDeleteBooking} className="bg-blue-950 font-bold left-80 relative text-white px-6 py-2 rounded-md hover:bg-transparent hover:border-2 border-black hover:text-black rounded" >
                   Complete Booking
                </button>
                {/*<button type="button" onClick={handleDeleteBooking}*/}
                {/*        className="ml-4 bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700">Delete Booking*/}
                {/*</button>*/}
            </div>
        </form>
    );
};

export default CurruntBooking;
