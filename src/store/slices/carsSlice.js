import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Ensure axios is configured properly with the correct base URL
const api = axios.create({
    baseURL: 'http://localhost:8080/api/car',
});


// Save a new car
export const saveCar = createAsyncThunk(
    "cars/saveCar",
    async (car, { rejectWithValue }) => {
        try {
            console.log("car slice",car)
            const response = await api.post("/add", car); // Ensure this is the correct endpoint
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving car");
        }
    }
);

// Get all cars
export const getCars = createAsyncThunk(
    "cars/getCars",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/"); // Ensure this is the correct endpoint
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error fetching cars");
        }
    }
);

// Delete a car
export const deleteCars = createAsyncThunk(
    "cars/deleteCar",
    async (carId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${carId}`); // Ensure this is the correct endpoint
            return carId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting car");
        }
    }
);

const carsSlice = createSlice({
    name: "cars",
    initialState: {
        cars: [],
        loading: false,
        error: null,
    },
    reducers: {
        // This is the new setCarAvailability action
        setCarAvailability: (state, action) => {
            const { carId, availability } = action.payload;
            const car = state.cars.find((car) => car.id === carId);
            if (car) {
                car.available = availability;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Handle getCars action
            .addCase(getCars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = action.payload;
            })
            .addCase(getCars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle saveCar action
            .addCase(saveCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveCar.fulfilled, (state, action) => {
                state.loading = false;
                state.cars.push(action.payload);
            })
            .addCase(saveCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Handle deleteCar action
            .addCase(deleteCars.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCars.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = state.cars.filter((car) => car.id !== action.payload);
            })
            .addCase(deleteCars.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { setCarAvailability } = carsSlice.actions; // Export the setCarAvailability action
export default carsSlice.reducer;
