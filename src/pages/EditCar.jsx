import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import CarForm from '../components/CarForm';
import { updateCar } from '../store/slices/carsSlice';

const EditCar = () => {
  const { id } = useParams();
  const carId = Number(id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const cars = useSelector(state => state.cars.cars);

  console.log("Edit Page - Car ID:", carId);
  console.log("Available Cars:", cars); // Debugging

  useEffect(() => {
    if (isNaN(carId)) {
      navigate('/cars'); // Redirect if id is invalid
      return;
    }

    if (cars.length > 0) {
      const foundCar = cars.find(car => Number(car.number) === carId);
      console.log("Found Car:", foundCar); // Debugging
      if (foundCar) {
        setCar(foundCar);
      } else {
        navigate('/cars');
      }
    }
  }, [carId, cars, navigate]);

  const handleSubmit = (values) => {
    dispatch(updateCar(values));
    navigate('/cars');
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-700">
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Car</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <CarForm onSubmit={handleSubmit} initialValues={car} />
        </div>
      </div>
  );
};

export default EditCar;
