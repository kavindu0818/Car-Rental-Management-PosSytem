import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { format, addDays, differenceInDays } from 'date-fns';

const BookingForm = ({ onSubmit, initialValues = null }) => {
  const [totalDays, setTotalDays] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);

  const cars = useSelector(state => state.cars.cars);
  const customers = useSelector(state => state.customers.customers);

  const availableCars = cars.filter(car => car.available);

  const validationSchema = Yup.object({
    carId: Yup.string().required('Car is required'),
    customerId: Yup.string().required('Customer is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(
            Yup.ref('startDate'),
            'End date must be after start date'
        ),
    paymentMethod: Yup.string().required('Payment method is required'),
    paymentStatus: Yup.string().required('Payment status is required'),
  });

  const formik = useFormik({
    initialValues: initialValues || {
      carId: '',
      customerId: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      endDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
      paymentMethod: 'card',
      paymentStatus: 'pending',
      status: 'pending',
      totalAmount: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      onSubmit({
        ...values,
        totalAmount,
      });
    },
  });

  useEffect(() => {
    if (formik.values.carId && formik.values.startDate && formik.values.endDate) {
      const car = cars.find(c => c.id === formik.values.carId);
      if (car) {
        const start = new Date(formik.values.startDate);
        const end = new Date(formik.values.endDate);
        const days = Math.max(1, differenceInDays(end, start));
        setTotalDays(days);
        setTotalAmount(car.price * days);
      }
    }
  }, [formik.values.carId, formik.values.startDate, formik.values.endDate, cars]);

  return (
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">

          {/* Car Selection */}
          <div className="sm:col-span-3">
            <label htmlFor="carId" className="block text-sm font-medium text-gray-700">
              Car
            </label>
            <select
                id="carId"
                name="carId"
                className="input"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.carId}
            >
              <option value="">Select a car</option>
              {availableCars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.name} {car.model} ({car.year}) - ${car.price}/day
                  </option>
              ))}
            </select>
            {formik.touched.carId && formik.errors.carId && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.carId}</p>
            )}
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
            {formik.touched.customerId && formik.errors.customerId && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.customerId}</p>
            )}
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
            {formik.touched.startDate && formik.errors.startDate && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.startDate}</p>
            )}
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
            {formik.touched.endDate && formik.errors.endDate && (
                <p className="mt-2 text-sm text-red-600">{formik.errors.endDate}</p>
            )}
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

          {/* Total Price Calculation */}
          <div className="sm:col-span-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{totalDays} day(s)</span>
              </div>
              <div className="flex justify-between mt-2">
                <span>Price per day:</span>
                <span>${formik.values.carId ? cars.find(car => car.id === formik.values.carId)?.price || 0 : 0}</span>
              </div>
              <div className="flex justify-between mt-2 text-lg font-bold">
                <span>Total Amount:</span>
                <span>${totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button type="submit" className="btn btn-primary">
            {initialValues ? 'Update Booking' : 'Create Booking'}
          </button>
        </div>
      </form>
  );
};

export default BookingForm;
