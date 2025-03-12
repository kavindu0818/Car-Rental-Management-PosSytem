import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
    jwt_token: null,
    refresh_token: null,
    username: null,
    isAuthenticated: false,
    loading: false,
    error: '',
};

// Axios instance for API requests
const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

// ** Async Thunks **

// Save user (Sign-up)
export const saveUser = createAsyncThunk(
    "user/saveUser",
    async (user, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/save", user);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving user");
        }
    }
);

// Login user
// Login user
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log("user login awo", credentials);
            const response = await api.post("/users/login", credentials); // Fixed variable name here
            // Store JWT token in localStorage or sessionStorage
            localStorage.setItem('authToken', response.data.token);

            console.log("response key set", response.data);
            return response.data;
        } catch (error) {
            // Check if the error is CORS related
            if (error.response && error.response.status === 403) {
                return rejectWithValue("CORS issue or invalid credentials");
            }
            return rejectWithValue(error.response ? error.response.data.message : error.message);
        }
    }
);



// ** User Slice **
const UserSlice = createSlice({
    name: 'user',
    initialState: {
        isAuthenticated: Boolean(localStorage.getItem('authToken')), // Check if there's a token in localStorage
        loading: false,
        error: '',
        userInfo: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('authToken');
            state.isAuthenticated = false;
            state.userInfo = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveUser.pending, (state) => {
                state.loading = true;
                state.error = "";
            })
            .addCase(saveUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.jwt_token = action.payload.accessToken;
                state.refresh_token = action.payload.refreshToken;
                state.username = action.payload.username;
            })
            .addCase(saveUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.userInfo = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    },
});

export default UserSlice.reducer;
