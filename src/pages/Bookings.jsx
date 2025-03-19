import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { Link } from 'react-router-dom';
import {FiSearch, FiFilter, FiPlus} from 'react-icons/fi';
import CarCard from '../components/CarCard';
import { getCars } from '../store/slices/carsSlice.js';
import BookingCard from "../components/BookingCard.jsx";
// import {Do} from "react-icons/pi";
import {GrDocumentUser} from "react-icons/gr";

const BookingPage = () => {
    const dispatch = useDispatch(); // Initialize dispatch
    const cars = useSelector(state => state.cars.cars);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(getCars()); // Fetch cars on component mount
    }, [dispatch]); // Include dispatch in the dependency array

    // Filter non-booked cars (assuming booked cars have `available: false`)
    const availableCars = cars.filter(car => car.available);

    const filteredCars = availableCars.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <div className="flex items-center gap-4">
                    <GrDocumentUser className="text-5xl text-blue-900"/>
                    <div>
                        <h1 className="text-3xl font-bold text-blue-950">Booking Management</h1>
                        <h6 className="text-gray-500 text-lg font-bold">Manage your fleet efficiently</h6>
                        {/*<h1 className="text-3xl font-bold text-blue-950">Car Management</h1>*/}
                    </div>
                </div>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-500"/>
                    <input
                        type="text"
                        placeholder="Search available cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded w-full"
                    />
                </div>
                <button className="bg-gray-200 px-4 py-2 rounded flex items-center">
                    <FiFilter className="mr-2"/> Filter
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.length > 0 ? (
                    filteredCars.map(car => (
                        <div key={car.id} className="border rounded-lg shadow p-4">
                            <BookingCard car={car}/>
                            <Link
                                to={`/bookings/add/${car.id}`}
                                state={{selectedCar: car}}
                                className="mt-4 block text-center  text-white font-bold bg-blue-950 rounded border-black hover:bg-transparent border-2 hover:border-black hover:text-black py-2 "
                            >
                                Book Vehicle
                            </Link>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No available cars.</p>
                )}
            </div>
        </div>
    );
};

export default BookingPage;
