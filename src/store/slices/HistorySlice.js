import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api/history",
});

// Fetch History
export const getHistory = createAsyncThunk(
    "historyBooking/getHistory", // Match with slice name
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/get");
            console.log("API Response:", response.data);
            return response.data || []; // Ensure it's always an array
        } catch (err) {
            console.error("Error fetching history:", err);
            return rejectWithValue(err.response?.data || "Error fetching History");
        }
    }
);

// Save History
export const saveHistory = createAsyncThunk(
    "historyBooking/saveHistory",
    async (history, { rejectWithValue }) => {
        try {
            const response = await api.post("/add", history);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving history");
        }
    }
);

// Delete History
export const deleteHistory = createAsyncThunk(
    "historyBooking/deleteHistory",
    async (hisId, { rejectWithValue }) => {
        try {
            await api.delete(`/delete/${hisId}`);
            return hisId;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error deleting history");
        }
    }
);

const initialState = {
    historyBooking: [],
    loading: false,
    error: null,
};

const historySlice = createSlice({
    name: "historyBooking",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.historyBooking = action.payload;
            })
            .addCase(getHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(saveHistory.fulfilled, (state, action) => {
                state.historyBooking = [...state.historyBooking, action.payload];
            })
            .addCase(deleteHistory.fulfilled, (state, action) => {
                state.historyBooking = state.historyBooking.filter(
                    (item) => item.historyId !== action.payload
                );
            });
    },
});

export default historySlice.reducer;
