import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:8080/api/booking', // Changed endpoint to "booking"
});

// Async thunk for adding a booking
export const addBooking = createAsyncThunk(
    "bookings/saveBooking",
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

// Async thunk for fetching bookings
export const getBookings = createAsyncThunk(
    "bookings/getBookings",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/"); // Fetch all bookings
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Error fetching bookings");
      }
    }
);

// Initial state for bookings (example data or empty array)
const initialState = {
  bookings: [],
  loading: false,
  error: null,
};

// Create slice for bookings
const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    // Action to add a booking locally
    addBookingLocal: (state, action) => {
      const newBooking = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.bookings.push(newBooking);
    },
    // Action to update a booking
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    // Action to delete a booking
    deleteBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
    // Action to update booking status
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(booking => booking.id === id);
      if (booking) {
        booking.status = status;
      }
    },
    // Action to update payment status
    updatePaymentStatus: (state, action) => {
      const { id, paymentStatus } = action.payload;
      const booking = state.bookings.find(booking => booking.id === id);
      if (booking) {
        booking.paymentStatus = paymentStatus;
      }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(addBooking.pending, (state) => {
          state.loading = true;
        })
        .addCase(addBooking.fulfilled, (state, action) => {
          state.loading = false;
          state.bookings.push(action.payload);
        })
        .addCase(addBooking.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getBookings.pending, (state) => {
          state.loading = true;
        })
        .addCase(getBookings.fulfilled, (state, action) => {
          state.loading = false;
          state.bookings = action.payload;
        })
        .addCase(getBookings.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

// Export actions
export const { addBookingLocal, updateBooking, deleteBooking, updateBookingStatus, updatePaymentStatus } = bookingSlice.actions;

// Export reducer
export default bookingSlice.reducer;
