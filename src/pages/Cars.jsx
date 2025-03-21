import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import CarCard from "../components/CarCard";
import { getCars, deleteCar } from "../store/slices/carsSlice";
import { PiCar } from "react-icons/pi";
import {toast} from "react-toastify";

const Cars = () => {
    const dispatch = useDispatch();
    const { cars, loading, error } = useSelector((state) => state.cars || { cars: [] });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getCars());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteCar(id));
        dispatch(getCars());
        toast.success("✅ Car Removed.", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            style: { backgroundColor: "red", color: "#ffffff" }, // Dark Blue Background & White Text
        });

    };

    const filteredCars = Array.isArray(cars) ? cars.filter((car) =>
        car.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="p-4 max-w-7xl mx-auto">
            {/* Header */}
            {/*<div className="p-6 bg-white shadow-lg rounded-lg">*/}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div className="flex items-center gap-4">
                        <PiCar className="text-5xl text-blue-900" />
                        <div>
                            <h1 className="text-3xl font-bold text-blue-950">Car Management</h1>
                            <h6 className="text-gray-500 text-lg font-bold">Manage your Cars efficiently</h6>
                            {/*<h1 className="text-3xl font-bold text-blue-950">Car Management</h1>*/}
                        </div>
                    </div>
                    <Link
                        to="/cars/add"
                        className="bg-blue-950 hover:bg-blue-800 text-white px-6 py-3 rounded-lg flex items-center shadow-md transition duration-300"
                    >
                        <FiPlus className="mr-2 text-xl" /> Add Car
                    </Link>
                </div>
            {/*</div>*/}

            {/* Search & Filter */}
            <div className="flex gap-4 my-6">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-3 text-gray-500 text-lg" />
                    <input
                        type="text"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>
                <button className="bg-gray-200 hover:bg-gray-300 px-5 py-3 rounded-lg flex items-center shadow-sm transition duration-300">
                    <FiFilter className="mr-2 text-lg" /> Filter
                </button>
            </div>

            {/* Display Cars or Messages */}
            {loading ? (
                <p className="text-center text-gray-500 text-lg">Loading cars...</p>
            ) : error ? (
                <p className="text-center text-red-500 text-lg">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <CarCard key={car.number} car={car} onDelete={() => handleDelete(car.number)} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-full text-lg">No cars found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cars;
