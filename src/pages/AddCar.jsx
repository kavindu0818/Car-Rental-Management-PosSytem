import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CarForm from '../components/CarForm';
import { saveCar } from '../store/slices/carsSlice.js';
import {toast} from "react-toastify"; // Import saveCar action

const AddCar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Initialize carData with default values
    const [carData, setCarData] = useState({
        number: '',
        name: '',
        model: '',
        year: new Date().getFullYear(),
        type: '',
        price: '',
        fuel: '',
        site: '',
        image: '',
        available: true, // Default to true
    });

    const handleSubmit = (values) => {
        console.log("Submitting car data:", values);
        dispatch(saveCar(values));
        toast.success("✅ Car Add Successfully.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: "#003366", color: "#ffffff" }, // Dark Blue Background & White Text
        });
// Dispatch the saveCar action
        navigate('/cars'); // Redirect after submission
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-700">
                    <FiArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Add New Car</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <CarForm onSubmit={handleSubmit} initialValues={carData} />
            </div>
        </div>
    );
};

export default AddCar;
