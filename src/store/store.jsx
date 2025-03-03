import carsSlice from "./slices/carsSlice.js";

export const store = configureStore({
    reducer: {
       cars:carsSlice
    },
});


// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

