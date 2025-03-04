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

export const deleteCustomer = createAsyncThunk("cars/deleteCar", async (cusId, { rejectWithValue }) => {
    try {
        await api.delete(`/delete/${cusId}`);
        return carId;
    } catch (err) {
        return rejectWithValue(err.response?.data || "Error deleting car");
    }
});


const customersSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        loading: false,
        error: null,
    },
    reducers: {
        // Remove redundant reducers
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
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(
                    (customer) => customer.id !== action.payload
                );
            });
    },
});


export const { addCustomer, updateCustomer } =
    customersSlice.actions;
export default customersSlice.reducer;
