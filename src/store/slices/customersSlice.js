import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Ensure axios is imported

const api = axios.create({
  baseURL: "http://localhost:8080/api/cus", // Ensure the correct endpoint
});

// Async actions for saving and fetching customers
export const saveCustomer = createAsyncThunk(
    "customers/saveCustomer",
    async (customer, { rejectWithValue }) => {
      try {
        console.log("Saving customer:", customer);
        const response = await api.post("/add", customer);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Error saving customer");
      }
    }
);

export const getCustomers = createAsyncThunk(
    "customers/getCustomers",
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get("/");
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Error fetching customers");
      }
    }
);

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [], // Initially, customers will be an empty array
    loading: false,
    error: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      const newCustomer = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split("T")[0],
      };
      state.customers.push(newCustomer);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(
          (customer) => customer.id === action.payload.id
      );
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(
          (customer) => customer.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(saveCustomer.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(saveCustomer.fulfilled, (state, action) => {
          state.loading = false;
          state.customers.push(action.payload);
        })
        .addCase(saveCustomer.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })
        .addCase(getCustomers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getCustomers.fulfilled, (state, action) => {
          state.loading = false;
          state.customers = action.payload;
        })
        .addCase(getCustomers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } =
    customersSlice.actions;
export default customersSlice.reducer;
