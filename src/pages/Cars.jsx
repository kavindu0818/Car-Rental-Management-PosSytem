import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiFilter } from "react-icons/fi";
import CarCard from "../components/CarCard";
import { getCars } from "../store/slices/carsSlice";

const Cars = () => {
    const dispatch = useDispatch();
    const { cars, loading, error } = useSelector((state) => state.cars || { cars: [] }); // Ensure state is not undefined
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getCars()); // Fetch cars on component mount
    }, [dispatch]);

    const handleDelete = (id) => {
        console.log("Deleting car with ID:", id);
        dispatch(deleteCars(id));
    };

    // Ensure `cars` is an array before filtering
    const filteredCars = Array.isArray(cars) ? cars.filter((car) =>
        car.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Car Management</h1>
                <Link
                    to="/cars/add"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                >
                    <FiPlus className="mr-2" /> Add Car
                </Link>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded w-full"
                    />
                </div>
                <button className="bg-gray-200 px-4 py-2 rounded flex items-center">
                    <FiFilter className="mr-2" /> Filter
                </button>
            </div>

            {/* Show Loading, Error, or Cars */}
            {loading ? (
                <p className="text-center text-gray-500">Loading cars...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCars.length > 0 ? (
                        filteredCars.map((car) => (
                            <CarCard key={car.number} car={car} onDelete={() => handleDelete(car.number)} />
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No cars found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cars;
