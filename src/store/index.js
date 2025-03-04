import { configureStore } from '@reduxjs/toolkit';
import carsReducer from './slices/carsSlice';
import bookingsReducer from './slices/bookingSlice.js';
import customersReducer from './slices/customersSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    cars: carsReducer,
    bookings: bookingsReducer,
    customers: customersReducer,
    dashboard: dashboardReducer,
  },
});