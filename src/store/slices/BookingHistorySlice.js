import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/history",
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
            return response.data;
        } catch (err) {
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

const initialState = {
    bookingsHistory: [],
    loading: false,
    error: null,
};

const bookingHistorySlice = createSlice({
    name: "bookingsHistory",
    initialState,
    reducers: {
        addBookingLocal: (state, action) => {
            state.bookingsHistory.push(action.payload);
        },
        updateBooking: (state, action) => {
            const index = state.bookingsHistory.findIndex(booking => booking.id === action.payload.id);
            if (index !== -1) {
                state.bookingsHistory[index] = action.payload;
            }
        },
        deleteBooking: (state, action) => {
            state.bookingsHistory = state.bookingsHistory.filter(booking => booking.id !== action.payload);
        },
        updateBookingStatus: (state, action) => {
            const { id, status } = action.payload;
            const booking = state.bookingsHistory.find(booking => booking.id === id);
            if (booking) booking.status = status;
        },
        updatePaymentStatus: (state, action) => {
            const { id, paymentStatus } = action.payload;
            const booking = state.bookingsHistory.find(booking => booking.id === id);
            if (booking) booking.paymentStatus = paymentStatus;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingsHistory.push(action.payload);
            })
            .addCase(addBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getBookingsHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBookingsHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingsHistory = action.payload;
            })
            .addCase(getBookingsHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteBookingHistory.fulfilled, (state, action) => {
                state.bookingsHistory = state.bookingsHistory.filter(booking => booking.id !== action.payload);
            });
    },
});

export const { addBookingLocal, updateBooking, updateBookingStatus, updatePaymentStatus, deleteBooking } =
    bookingHistorySlice.actions;

export default bookingHistorySlice.reducer;
