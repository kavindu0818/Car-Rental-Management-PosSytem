import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCar } from '../store/slices/carsSlice'; // Redux actions
import CarForm from '../components/CarForm';

const CarEdit = () => {
    const { id } = useParams(); // Get car ID from URL
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cars, loading, error } = useSelector(state => state.cars);

    // State for car details
    const [carDetails, setCarDetails] = useState(location.state?.car || null);

    // Fetch car details if not passed via state
    useEffect(() => {
        if (!carDetails && id && cars.length > 0) {
            const carToEdit = cars.find(car => String(car.number) === String(id));
            setCarDetails(carToEdit);
        }
    }, [id, cars, carDetails]);

    // Handle form submission
    const handleSubmit = (updatedCar) => {
        dispatch(updateCar(updatedCar));
        navigate('/cars'); // Navigate back after update
    };

    // Loading state or error handling
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!carDetails) return <p>Car not found for ID: {id}</p>;

    return (
        <div>
            <h1 className="text-black text-2xl font-bold pb-5 ">Edit Car: {carDetails.name}</h1>
            <CarForm initialValues={carDetails} onSubmit={handleSubmit} />
        </div>
    );
};

export default CarEdit;
