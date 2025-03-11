import React from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const CarCard = ({ car, onDelete }) => {
  return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-48 w-full overflow-hidden">
          <img
              src={car.image}
              alt={`${car.name} ${car.model}`}
              className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{car.name}</h3>
              <p className="text-sm text-gray-500">{car.model} • {car.year}</p>
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                car.available
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
            }`}>
            {car.available ? 'Available' : 'Booked'}
          </span>
          </div>

          <div className="mt-4">
            <p className="text-gray-700">Type: {car.number}</p>
            <p className="text-lg font-bold text-primary-600 mt-2">${car.price}/day</p>
          </div>

          <div className="mt-4 flex justify-between">
            <Link
                to={`cars/edit/${car.number}`}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FiEdit className="mr-1 h-4 w-4" />
              Edit
            </Link>
            <button
                onClick={() => onDelete(car.number)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
            >
              <FiTrash2 className="mr-1 h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
  );
};

export default CarCard;
