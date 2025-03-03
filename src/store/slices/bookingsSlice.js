import { createSlice } from '@reduxjs/toolkit';

// Sample data for demonstration
const initialBookings = [
  {
    id: '1',
    carId: '3',
    customerId: '2',
    startDate: '2023-02-15',
    endDate: '2023-02-20',
    status: 'active',
    totalAmount: 350,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    createdAt: '2023-02-14',
  },
  {
    id: '2',
    carId: '1',
    customerId: '1',
    startDate: '2023-03-10',
    endDate: '2023-03-15',
    status: 'completed',
    totalAmount: 250,
    paymentStatus: 'paid',
    paymentMethod: 'cash',
    createdAt: '2023-03-09',
  },
  {
    id: '3',
    carId: '2',
    customerId: '3',
    startDate: '2023-04-05',
    endDate: '2023-04-10',
    status: 'cancelled',
    totalAmount: 225,
    paymentStatus: 'refunded',
    paymentMethod: 'card',
    createdAt: '2023-04-01',
  },
];

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: initialBookings,
    loading: false,
    error: null,
  },
  reducers: {
    addBooking: (state, action) => {
      const newBooking = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.bookings.push(newBooking);
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
      if (index !== -1) {
        state.bookings[index] = action.payload;
      }
    },
    deleteBooking: (state, action) => {
      state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
    },
    updateBookingStatus: (state, action) => {
      const { id, status } = action.payload;
      const booking = state.bookings.find(booking => booking.id === id);
      if (booking) {
        booking.status = status;
      }
    },
    updatePaymentStatus: (state, action) => {
      const { id, paymentStatus } = action.payload;
      const booking = state.bookings.find(booking => booking.id === id);
      if (booking) {
        booking.paymentStatus = paymentStatus;
      }
    },
  },
});

export const { 
  addBooking, 
  updateBooking, 
  deleteBooking, 
  updateBookingStatus,
  updatePaymentStatus
} = bookingsSlice.actions;
export default bookingsSlice.reducer;