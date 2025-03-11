import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/history", // Ensure correct backend endpoint
});

// Async thunk for adding a booking history
export const addBookingHistory = createAsyncThunk(
    "history/addBookingHistory",
    async (history, { rejectWithValue }) => {
        try {
            console.log("Booking history data in slice:", history);
            const response = await api.post("/add", history);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving booking history");
        }
    }
);

// Async thunk for fetching booking history
export const getBookingsHistory = createAsyncThunk(
    "history/getBookingsHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get");
            console.log("API Response:", response.data);
            console.log("slice eka lagata awa",response.data)// Log the response
            return response.data;
        } catch (err) {
            console.error("Error fetching booking history:", err);
            return rejectWithValue(err.response?.data || "Error fetching booking history");
        }
    }
);


// Async thunk for deleting booking history
export const deleteBookingHistory = createAsyncThunk(
    "history/deleteBookingHistory",
    async (historyId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${historyId}`);
            return historyId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting booking history");
        }
    }
);

// Initial state
const initialState = {
    bookings: [],
    loading: false,
    error: null,
};

// Create slice for booking history
const bookingHistorySlice = createSlice({
    name: "bookinghistory",
    initialState,
    reducers: {
        // Action to add a booking locally
        addBookingLocal: (state, action) => {
            const newBooking = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString().split("T")[0],
            };
            state.bookings.push(newBooking);
        },
        // Action to update a booking
        updateBooking: (state, action) => {
            const index = state.bookings.findIndex((booking) => booking.id === action.payload.id);
            if (index !== -1) {
                state.bookings[index] = action.payload;
            }
        },
        // Action to delete a booking locally
        deleteBooking: (state, action) => {
            state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
        },
        // Action to update booking status
        updateBookingStatus: (state, action) => {
            const { id, status } = action.payload;
            const booking = state.bookings.find((booking) => booking.id === id);
            if (booking) {
                booking.status = status;
            }
        },
        // Action to update payment status
        updatePaymentStatus: (state, action) => {
            const { id, paymentStatus } = action.payload;
            const booking = state.bookings.find((booking) => booking.id === id);
            if (booking) {
                booking.paymentStatus = paymentStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Add Booking History Cases
            .addCase(addBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(addBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get Booking History Cases
            .addCase(getBookingsHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBookingsHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(getBookingsHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete Booking History Cases
            .addCase(deleteBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = state.bookings.filter((booking) => booking.id !== action.payload);
            })
            .addCase(deleteBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Export actions
export const { addBookingLocal, updateBooking, updateBookingStatus, updatePaymentStatus, deleteBooking } =
    bookingHistorySlice.actions;

// Export reducer
export default bookingHistorySlice.reducer;
