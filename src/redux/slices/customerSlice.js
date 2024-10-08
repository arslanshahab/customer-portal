import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpService } from '../../services/httpService';
import { DEFAULT_CUSTOMERS_PAGINATION_LIMIT } from '../../constants';

// Fetch all customers
export const fetchCustomers = createAsyncThunk('customers/fetchAll', async ({page, search}) => {
    console.log('search', page);
    
  const response = await httpService.get(`/customer?page=${page}&pageSize=${DEFAULT_CUSTOMERS_PAGINATION_LIMIT}&search=${search}`);
  return response.data;
});

// Add a new customer
export const addCustomer = createAsyncThunk('customers/add', async (customer) => {
  const response = await httpService.post('/customer', customer);
  return response.data;
});

// Update an existing customer
export const updateCustomer = createAsyncThunk('customers/update', async (customer) => {
  const response = await httpService.put(`/customer/${customer.id}`, customer);
  return response.data;
});

// Delete a customer
export const deleteCustomer = createAsyncThunk('customers/delete', async (customerId) => {
  await httpService.delete(`/customer/${customerId}`);
  return customerId;
});

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
    totalPages: 0,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Cases for fetchCustomers
    builder.addCase(fetchCustomers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCustomers.fulfilled, (state, action) => {
      state.loading = false;
      state.customers = action.payload.customers;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(fetchCustomers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
    // Cases for addCustomer
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
    });

    // Cases for updateCustomer
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      state.customers[index] = action.payload;
    });

    // Cases for deleteCustomer
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    });
  },
});

export default customerSlice.reducer;
