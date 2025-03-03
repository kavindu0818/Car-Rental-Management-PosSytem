import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import BookingForm from '../components/BookingForm';
import { addBooking } from '../store/slices/bookingsSlice';
import { setCarAvailability } from '../store/slices/carsSlice';

const AddBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    dispatch(addBooking(values));

    // If the booking status is active, mark the car as unavailable
    if (values.status === 'active') {
      dispatch(setCarAvailability({ id: values.carId, available: false }));
    }

    navigate('/bookings');
  };

  return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Create New Booking</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <BookingForm onSubmit={handleSubmit} />
        </div>
      </div>
  );
};

export default AddBooking;
