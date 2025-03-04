import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays, differenceInDays } from 'date-fns';
import { useLocation, useParams } from 'react-router-dom';
import { getCustomers } from "../store/slices/customersSlice.js";
import { getCars } from "../store/slices/carsSlice.js";

const BookingForm = ({ onSubmit, initialValues = null }) => {
  const dispatch = useDispatch();
  const { id } = useParams(); // Get the car ID from the URL
  const location = useLocation();
  const selectedCar = location.state?.selectedCar;
  const [totalDays, setTotalDays] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const cars = useSelector(state => state.cars.cars);
  const customers = useSelector(state => state.customers.customers);

  useEffect(() => {
    dispatch(getCustomers());
    dispatch(getCars());
  }, [dispatch]);

  const availableCars = cars.filter(car => car.available);

  // Form Validation Schema
  const validationSchema = Yup.object({
    carId: Yup.string().required('Car is required'),
    customerId: Yup.string().required('Customer is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
    paymentMethod: Yup.string().required('Payment method is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
    payAdvance: Yup.number().required('Advance payment is required').min(0, 'Advance payment cannot be negative'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      carId: selectedCar?.number || '',
      carDetails: selectedCar
          ? `${selectedCar.name} -${selectedCar.number}- ${selectedCar.model} (${selectedCar.year})`
          : '',
      customerId: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      paymentMethod: 'card',
      paymentStatus: 'pending',
      status: 'pending',
      payAdvance: 0,
      totalAmount: 0,
      pricePerDay:selectedCar.price,
      arrearsAmount: 0,
      carIsuue:true
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        arrearsAmount: values.totalAmount - values.payAdvance, // Add arrears calculation on form submit
      });
    },
  });

  useEffect(() => {
    if (formik.values.carId && formik.values.startDate && formik.values.endDate) {
      // Find the selected car by car ID
      const car = cars.find(c => c.number === formik.values.carId);
      console.log("Price handling:", car);

      if (car) {
        const start = new Date(formik.values.startDate);
        const end = new Date(formik.values.endDate);
        const days = Math.max(1, differenceInDays(end, start)); // Ensure it's at least 1 day
        const pricePerDay = car.price;

        // Set total days and calculate total amount
        setTotalDays(days);
        setTotalAmount(pricePerDay * days);

        // Update formik's totalAmount and arrearsAmount
        formik.setFieldValue('totalAmount', pricePerDay * days);
        formik.setFieldValue('arrearsAmount', (pricePerDay * days) - formik.values.payAdvance);
      }
    }
  }, [formik.values.carId, formik.values.startDate, formik.values.endDate, cars]);

  useEffect(() => {
    const arrears = formik.values.totalAmount - formik.values.payAdvance;
    formik.setFieldValue('arrearsAmount', arrears);
  }, [formik.values.payAdvance, formik.values.totalAmount]);


  return (
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Car Selection */}
          <div className="sm:col-span-3">
            <label htmlFor="carDetails" className="block text-sm font-medium text-gray-700">
              Car
            </label>
            <input
                type="text"
                id="carDetails"
                name="carDetails"
                className="input bg-gray-100 cursor-not-allowed"
                placeholder="Select a car"
                value={formik.values.carDetails || (selectedCar ? selectedCar.name : '')}
                readOnly
            />
          </div>

          {/* Customer Selection */}
          <div className="sm:col-span-3">
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Customer
            </label>
            <select
                id="customerId"
                name="customerId"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.customerId}
            >
              <option value="">Select a customer</option>
              {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} ({customer.phone})
                  </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="sm:col-span-3">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
                type="date"
                name="startDate"
                id="startDate"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.startDate}
            />
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
                type="date"
                name="endDate"
                id="endDate"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.endDate}
            />
          </div>

          {/* Payment and Booking Status */}
          <div className="sm:col-span-3">
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
                id="paymentMethod"
                name="paymentMethod"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paymentMethod}
            >
              <option value="card">Credit/Debit Card</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
                id="paymentStatus"
                name="paymentStatus"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.paymentStatus}
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <label htmlFor="payAdvance" className="block text-sm font-medium text-gray-700">
              Pay Advance (Rs)
            </label>
            <input
                type="number"
                name="payAdvance"
                id="payAdvance"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.payAdvance}
            />
          </div>

          {/* Total Price Calculation */}
          <div className="sm:col-span-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{totalDays} day(s)</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Price per day:</span>
                <span>${cars.find(car => car.number === formik.values.carId)?.price || 0}</span>
              </div>
              <div className="flex justify-between mt-2 text-lg font-bold">
                <span>Total Amount:</span>
                <span>Rs.{formik.values.totalAmount}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Advance Price:</span>
                <span>Rs.{formik.values.payAdvance || 0}</span>
              </div>
              <div className="flex justify-between mt-2 text-lg font-bold">
                <span>Arrears Amount:</span>
                <span>Rs.{formik.values.arrearsAmount}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="btn btn-primary">
              {initialValues ? 'Update Booking' : 'Create Booking'}
            </button>
          </div>
        </div>
      </form>
  );
};

export default BookingForm;
