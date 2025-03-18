import { configureStore } from "@reduxjs/toolkit";
import carsSlice from "./slices/carsSlice";
import customersSlice from "./slices/customersSlice";
import bookingSlice from "./slices/bookingSlice";
import historySlice from "./slices/historySlice"; // Ensure this is imported correctly
import userSlice from "./slices/UserSlice.js";
import oldBookingReducer from "./slices/OldBookingSlice.js";
import dashboardSlice from "./slices/dashboardSlice.js";

export const store = configureStore({
    reducer: {
        cars: carsSlice,
        customers: customersSlice,
        bookings: bookingSlice,
        historyBooking: historySlice, // Ensure this matches the slice name
        user: userSlice,
        oldbooking:oldBookingReducer,
        dashboard: dashboardSlice,
    },
});