import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/car', // Ensure your endpoint is correct
});

// Create async thunks
export const saveCar = createAsyncThunk(
    "cars/saveCar",
    async (car, { rejectWithValue }) => {
        try {
            console.log("car data in slice:", car);
            const response = await api.post("/add", car);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving car");
        }
    }
);

export const getCars = createAsyncThunk(
    "cars/getCars",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/");
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error fetching cars");
        }
    }
);

export const updateCar = createAsyncThunk(
    "cars/updateCar",
    async (car, { rejectWithValue }) => {
        try {
            const response = await api.put(`/update/${car.id}`, car);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error updating car");
        }
    }
);

export const deleteCar = createAsyncThunk(
    "cars/deleteCar",
    async (carId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${carId}`);
            return carId; // Return the deleted car's ID
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting car");
        }
    }
);

// Define slice
const carsSlice = createSlice({
    name: "cars",
    initialState: {
        cars: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
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
            .addCase(updateCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCar.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.cars.findIndex((car) => car.id === action.payload.id);
                if (index !== -1) {
                    state.cars[index] = action.payload;
                }
            })
            .addCase(updateCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteCar.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCar.fulfilled, (state, action) => {
                state.loading = false;
                state.cars = state.cars.filter((car) => car.id !== action.payload);
            })
            .addCase(deleteCar.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export reducer
export default carsSlice.reducer;
