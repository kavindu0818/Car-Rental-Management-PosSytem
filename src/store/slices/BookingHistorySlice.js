import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8080/api/history',
});

// ✅ Async thunk for adding a booking
export const addBookingHistory = createAsyncThunk(
    "bookingHistory/addBookingHistory",
    async (booking, { rejectWithValue }) => {
        try {
            console.log("Booking data in slice:", booking);
            const response = await api.post("/add", booking);
            return response.data; // Return response data if successful
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving booking");
        }
    }
);

// ✅ Async thunk for fetching all booking history
export const getAllBookingHistory = createAsyncThunk(
    "bookingHistory/getAllBookingHistory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get");
            console.log("Fetched Booking History:", response.data);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error fetching bookings");
        }
    }
);

// ✅ Async thunk for deleting a booking
export const deleteBookingHistory = createAsyncThunk(
    "bookingHistory/deleteBookingHistory",
    async (bookingId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${bookingId}`);
            return bookingId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting booking");
        }
    }
);

// ✅ Initial state
const initialState = {
    bookingHistory: [],  // ✅ Ensure consistent naming
    loading: false,
    error: null,
};

// ✅ Create slice for bookings
const bookingSlice = createSlice({
    name: 'bookingHistory',
    initialState,
    reducers: {
        addBookingLocal: (state, action) => {
            const newBooking = {
                ...action.payload,
                id: Date.now().toString(),
                createdAt: new Date().toISOString().split('T')[0],
            };
            state.bookingHistory.push(newBooking);
        },
        updateBooking: (state, action) => {
            const index = state.bookingHistory.findIndex(booking => booking.id === action.payload.id);
            if (index !== -1) {
                state.bookingHistory[index] = action.payload;
            }
        },
        deleteBookingLocal: (state, action) => {
            state.bookingHistory = state.bookingHistory.filter(booking => booking.id !== action.payload);
        },
        updateBookingStatus: (state, action) => {
            const { id, status } = action.payload;
            const booking = state.bookingHistory.find(booking => booking.id === id);
            if (booking) {
                booking.status = status;
            }
        },
        updatePaymentStatus: (state, action) => {
            const { id, paymentStatus } = action.payload;
            const booking = state.bookingHistory.find(booking => booking.id === id);
            if (booking) {
                booking.paymentStatus = paymentStatus;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // ✅ Handle Adding Booking
            .addCase(addBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(addBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingHistory.push(action.payload);
            })
            .addCase(addBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle Fetching Booking History
            .addCase(getAllBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(getAllBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingHistory = action.payload;  // ✅ Ensure state is updated correctly
            })
            .addCase(getAllBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle Deleting Booking
            .addCase(deleteBookingHistory.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteBookingHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.bookingHistory = state.bookingHistory.filter(booking => booking.id !== action.payload);
            })
            .addCase(deleteBookingHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// ✅ Export actions and reducer
export const {
    addBookingLocal,
    updateBooking,
    updateBookingStatus,
    updatePaymentStatus,
    deleteBookingLocal,
} = bookingSlice.actions;

export default bookingSlice.reducer;
