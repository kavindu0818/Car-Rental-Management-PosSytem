import carsSlice from "./slices/carsSlice.js";
import customersSlice from "./slices/customersSlice.js";

export const store = configureStore({
    reducer: {
       cars:carsSlice,
        customers: customersSlice
        booking: bookingS
    },
});


// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

