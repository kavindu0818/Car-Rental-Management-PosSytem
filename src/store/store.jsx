import carsSlice from "./slices/carsSlice.js";
import customersSlice from "./slices/customersSlice.js";
import bookingSlice from "./slices/bookingSlice.js";
import BookingHistorySlice from "./slices/BookingHistorySlice.js";

export const store = configureStore({
    reducer: {
        cars:carsSlice,
        customers: customersSlice,
        booking: bookingSlice,
        bookingHistory:BookingHistorySlice

    },
});


// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;