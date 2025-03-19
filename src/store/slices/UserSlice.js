import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
    jwt_token: null,
    refresh_token: null,
    username: null,
    isAuthenticated: Boolean(localStorage.getItem('authToken')),
    loading: false,
    error: '',
    userInfo: null,
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
            console.log("user slice save",user)
            const response = await api.post("/users/save", user);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || "Error saving user");
        }
    }
);

// Get user by username
export const getUser = createAsyncThunk(
    "user/getUser",
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/get/${id}`);
            console.log("userSlice",response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching user");
        }
    }
);

// Login user
export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            console.log("User login attempt", credentials);
            const response = await api.post("/users/login", credentials);
            localStorage.setItem('authToken', response.data.token);
            console.log("Login successful", response.data);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 403) {
                return rejectWithValue("CORS issue or invalid credentials");
            }
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ** User Slice **
const UserSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('authToken');
            state.isAuthenticated = false;
            state.userInfo = null;
            state.jwt_token = null;
            state.refresh_token = null;
            state.username = null;
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
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = '';
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.userInfo = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
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

export const { logout } = UserSlice.actions;
export default UserSlice.reducer;
