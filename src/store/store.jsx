import { configureStore } from "@reduxjs/toolkit";
import carsSlice from "./slices/carsSlice";
import customersSlice from "./slices/customersSlice";
import bookingSlice from "./slices/bookingSlice";
import bookingHistorySlice from "./slices/BookingHistorySlice";
import userSlice from "./slices/UserSlice.js";

export const store = configureStore({
    reducer: {
        cars: carsSlice,
        customers: customersSlice,
        booking: bookingSlice,
        bookingsHistory: bookingHistorySlice,
        user: userSlice,
    },
});

export type AppDispatch = typeof store.dispatch;
