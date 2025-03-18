import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/history', // Ensure your endpoint is correct
});

// Create async thunks
export const saveOldBooking = createAsyncThunk(
    "oldbooking/saveCar",
    async (old, { rejectWithValue }) => {
        try {
            console.log("car data in slice:", old);
            const response = await api.post("/add", old);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving History Booking");
        }
    }
);

export const getOldBooking = createAsyncThunk(
    "oldbooking/getOldBooking",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/");
            console.log(response.data);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error fetching cars");
        }
    }
);

export const updateOldBooking = createAsyncThunk(
    "oldbooking/updateOldBooking",
    async (old, { rejectWithValue }) => {
        try {
            const response = await api.put(`/update/${old.id}`, old);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error updating Booking History");
        }
    }
);

export const deleteOldBooking = createAsyncThunk(
    "oldbooking/deleteOldBooking",
    async (oldId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${oldId}`);
            return oldId; // Return the deleted booking's ID
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting Booking History");
        }
    }
);

// Define slice
const OldBookingSlice = createSlice({
    name: "oldbooking",
    initialState: {
        oldbooking: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOldBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getOldBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.oldbooking = action.payload;
            })
            .addCase(getOldBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveOldBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveOldBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.oldbooking.push(action.payload);
            })
            .addCase(saveOldBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateOldBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOldBooking.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.oldbooking.findIndex((car) => car.id === action.payload.id);
                if (index !== -1) {
                    state.oldbooking[index] = action.payload;
                }
            })
            .addCase(updateOldBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteOldBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteOldBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.oldbooking = state.oldbooking.filter((car) => car.id !== action.payload);
            })
            .addCase(deleteOldBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export reducer
export default OldBookingSlice.reducer;
