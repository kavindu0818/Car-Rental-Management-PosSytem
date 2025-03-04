import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addBooking } from '../store/slices/bookingSlice.js';
import { setCarAvailability } from '../store/slices/carsSlice.js';
import { addCustomer } from '../store/slices/customersSlice.js';

const InstantBooking = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Ensure cars and customers default to empty arrays
  const cars = useSelector((state) => state.cars?.carsList || []);
  const customers = useSelector((state) => state.customers?.customersList || []);

  const [step, setStep] = useState(1);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
  const [bookingDetails, setBookingDetails] = useState({ startDate: '', endDate: '', totalAmount: 0 });

  const handleSelectCar = (car) => setSelectedCar(car);
  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setIsNewCustomer(false);
  };

  const handleNewCustomerChange = (e) => {
    setNewCustomer({ ...newCustomer, [e.target.name]: e.target.value });
  };

  const handleBookingDetailsChange = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (step === 1 && !selectedCar) {
      alert("Please select a car before proceeding.");
      return;
    }
    if (step === 2 && !selectedCustomer && !isNewCustomer) {
      alert("Please select a customer or add a new one.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    let customerId = selectedCustomer?.id;
    if (isNewCustomer) {
      const newCustomerAction = await dispatch(addCustomer(newCustomer));
      customerId = newCustomerAction.payload?.id;
    }

    if (!customerId) {
      alert("Customer ID is missing.");
      return;
    }

    const bookingData = {
      carId: selectedCar.id,
      customerId,
      ...bookingDetails,
      status: 'confirmed',
    };

    dispatch(addBooking(bookingData));
    dispatch(setCarAvailability({ id: selectedCar.id, available: false }));
    navigate('/bookings');
  };

  return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold">Instant Booking</h2>

        {step === 1 && (
            <div>
              <h3>Select a Car</h3>
              {cars.length === 0 ? <p>Loading cars...</p> : (
                  <div className="grid grid-cols-3 gap-4">
                    {cars.map((car) => (
                        <div key={car.id} className="border p-2 cursor-pointer" onClick={() => handleSelectCar(car)}>
                          <img
                              src={car.image || 'https://via.placeholder.com/300x200?text=Car+Image'}
                              alt={car.name}
                              className="w-full h-40 object-cover"
                              onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Car+Image')}
                          />
                          <p>{car.name}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}

        {step === 2 && (
            <div>
              <h3>Select a Customer</h3>
              <button onClick={() => setIsNewCustomer(true)}>New Customer</button>
              {customers.length === 0 ? <p>Loading customers...</p> : (
                  <div className="grid grid-cols-3 gap-4">
                    {customers.map((customer) => (
                        <div key={customer.id} className="border p-2 cursor-pointer" onClick={() => handleSelectCustomer(customer)}>
                          <p>{customer.name}</p>
                          <p>{customer.email}</p>
                        </div>
                    ))}
                  </div>
              )}
              {isNewCustomer && (
                  <div>
                    <input type="text" name="name" placeholder="Name" onChange={handleNewCustomerChange} />
                    <input type="email" name="email" placeholder="Email" onChange={handleNewCustomerChange} />
                    <input type="tel" name="phone" placeholder="Phone" onChange={handleNewCustomerChange} />
                  </div>
              )}
            </div>
        )}

        {step === 3 && (
            <div>
              <h3>Booking Details</h3>
              <input type="date" name="startDate" onChange={handleBookingDetailsChange} />
              <input type="date" name="endDate" onChange={handleBookingDetailsChange} />
              <input type="number" name="totalAmount" placeholder="Total Amount" onChange={handleBookingDetailsChange} />
            </div>
        )}

        <div className="flex gap-4 mt-4">
          {step > 1 && <button onClick={prevStep}>Previous</button>}
          {step < 3 && <button onClick={nextStep}>Next</button>}
          {step === 3 && <button onClick={handleSubmit}>Confirm Booking</button>}
        </div>
      </div>
  );
};

export default InstantBooking;
