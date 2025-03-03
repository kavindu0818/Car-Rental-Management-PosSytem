import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"; // Ensure axios is imported

const api = axios.create({
  baseURL: 'http://localhost:8080/api/car' // Changed endpoint to "cars" instead of "crop"
});

// Sample data for demonstration

export const saveCar = createAsyncThunk(
    "cars/saveCar",
    async (car, { rejectWithValue }) => {
      try {
        console.log("mama slice eka bn:" , car)
        const response = await api.post("/add", car);
        return response.data;
      } catch (err) {
        return rejectWithValue(err.response?.data || "Error saving car");
      }
    }
);


export const getCars = createAsyncThunk("cars/getCars", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/"); // Assuming the endpoint is /all
    return response.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Error fetching cars");
  }
});

// export const updateCar = createAsyncThunk("cars/updateCar", async (car, { rejectWithValue }) => {
//   try {
//     const response = await api.put(`/update/${car.id}`, car);
//     return response.data;
//   } catch (err) {
//     return rejectWithValue(err.response?.data || "Error updating car");
//   }
// });
//
// // Delete a car
export const deleteCars = createAsyncThunk("cars/deleteCar", async (carId, { rejectWithValue }) => {
  try {
    await api.delete(`/delete/${carId}`);
    return carId;
  } catch (err) {
    return rejectWithValue(err.response?.data || "Error deleting car");
  }
});


const carsSlice = createSlice({
  name: "cars",
  initialState: {
    cars: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
        // Get all cars
        .addCase(getCars.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(getCars.fulfilled, (state, action) => {
          state.loading = false;
          state.cars = action.payload;
        })
        .addCase(getCars.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Save a new car
        .addCase(saveCar.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(saveCar.fulfilled, (state, action) => {
          state.loading = false;
          state.cars.push(action.payload);
        })
        .addCase(saveCar.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        })

        // Update a car
        // .addCase(updateCar.pending, (state) => {
        //   state.loading = true;
        //   state.error = null;
        // })
        // .addCase(updateCar.fulfilled, (state, action) => {
        //   state.loading = false;
        //   const index = state.cars.findIndex((car) => car.id === action.payload.id);
        //   if (index !== -1) {
        //     state.cars[index] = action.payload;
        //   }
        // })
        // .addCase(updateCar.rejected, (state, action) => {
        //   state.loading = false;
        //   state.error = action.payload;
        // })
        //
        // // Delete a car
        .addCase(deleteCars.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(deleteCars.fulfilled, (state, action) => {
          state.loading = false;
          state.cars = state.cars.filter((car) => car.id !== action.payload);
        })
        .addCase(deleteCars.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
  },
});

export const { addCar, updateCar, deleteCar, setCarAvailability } = carsSlice.actions;
export default carsSlice.reducer;
