import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import CarCard from '../components/CarCard';

const BookingPage = () => {
    const cars = useSelector(state => state.cars.cars);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter non-booked cars (assuming booked cars have `available: false`)
    const availableCars = cars.filter(car => car.available);

    const filteredCars = availableCars.filter(car =>
        car.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Book a Vehicle</h1>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="relative flex-grow">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search available cars..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded w-full"
                    />
                </div>
                <button className="bg-gray-200 px-4 py-2 rounded flex items-center">
                    <FiFilter className="mr-2" /> Filter
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.length > 0 ? (
                    filteredCars.map(car => (
                        <div key={car.id} className="border rounded-lg shadow p-4">
                            <CarCard car={car} />
                            <Link
                                to={`/book/${car.id}`}
                                className="mt-4 block text-center bg-blue-500 text-white py-2 rounded"
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
