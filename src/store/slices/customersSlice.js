import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/cus", // Ensure the correct backend API
});

// ✅ Save Customer
export const saveCustomer = createAsyncThunk(
    "customers/saveCustomer",
    async (customer, { rejectWithValue }) => {
        try {
            const response = await api.post("/add", customer);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving customer");
        }
    }
);

// ✅ Fetch Customers
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

// ✅ Delete Customer
export const deleteCustomer = createAsyncThunk(
    "customers/deleteCustomer",
    async (cusId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${cusId}`);
            return cusId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting customer");
        }
    }
);

// ✅ Update Customer
export const updateCustomer = createAsyncThunk(
    "customers/updateCustomer",
    async (updatedCustomer , { rejectWithValue }) => {
        try {
            console.log("update customer", updatedCustomer);
            const response = await api.put(`/update/${updatedCustomer.phone}`, updatedCustomer);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error updating customer");
        }
    }
);

// ✅ Redux Slice
const customersSlice = createSlice({
    name: "customers",
    initialState: {
        customers: [],
        loading: false,
        error: null,
    },
    reducers: {}, // No need for extra reducers since we handle async actions separately
    extraReducers: (builder) => {
        builder
            // ✅ Save Customer
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

            // ✅ Fetch Customers
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

            // ✅ Delete Customer
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.customers = state.customers.filter(
                    (customer) => customer.id !== action.payload
                );
            })

            // ✅ Update Customer
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = state.customers.map((customer) =>
                    customer.phone === action.payload.phone ? action.payload : customer
                );
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default customersSlice.reducer;
