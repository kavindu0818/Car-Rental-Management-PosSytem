import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: {
      totalCars: 0,
      availableCars: 0,
      activeBookings: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      monthlyRevenue: [],
      recentBookings: [],
      popularCars: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    setDashboardStats: (state, action) => {
      state.stats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setDashboardStats, setLoading, setError } = dashboardSlice.actions;
export default dashboardSlice.reducer;