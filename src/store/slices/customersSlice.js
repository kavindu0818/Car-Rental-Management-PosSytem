import { createSlice } from '@reduxjs/toolkit';

// Sample data for demonstration
const initialCustomers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    licenseNumber: 'DL12345678',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-987-6543',
    address: '456 Oak Ave, Somewhere, USA',
    licenseNumber: 'DL87654321',
    createdAt: '2023-01-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '555-456-7890',
    address: '789 Pine Rd, Nowhere, USA',
    licenseNumber: 'DL56781234',
    createdAt: '2023-02-05',
  },
];

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: initialCustomers,
    loading: false,
    error: null,
  },
  reducers: {
    addCustomer: (state, action) => {
      const newCustomer = {
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      state.customers.push(newCustomer);
    },
    updateCustomer: (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomer: (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    },
  },
});

export const { addCustomer, updateCustomer, deleteCustomer } = customersSlice.actions;
export default customersSlice.reducer;