import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { httpService } from '../../services/httpService';
import { DEFAULT_CUSTOMERS_PAGINATION_LIMIT } from '../../constants';
import { toast } from 'sonner';

// Fetch all customers
export const fetchCustomers = createAsyncThunk('customers/fetchAll', async ({ page, search }) => {
  const response = await httpService.get(`/customer?page=${page}&pageSize=${DEFAULT_CUSTOMERS_PAGINATION_LIMIT}&search=${search}`);
  return response.data;
});

// Add a new customer
export const addCustomer = createAsyncThunk('customers/add', async (customer, { rejectWithValue }) => {
  try {
    const response = await httpService.post('/customer', customer);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ title: 'An error occurred while adding the customer' });
  }
});

// Update an existing customer
export const updateCustomer = createAsyncThunk('customers/update', async (customer, { rejectWithValue }) => {
  try {
    const response = await httpService.put(`/customer/${customer.id}`, customer);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue({ title: 'An error occurred while adding the customer' });
  }
});

// Delete a customer
export const deleteCustomer = createAsyncThunk('customers/delete', async (customerId) => {
  await httpService.delete(`/customer/${customerId}`);
  return customerId;
});

// Empty errors and error state
export const emptyErrors = createAsyncThunk('customers/emptyErrors', async () => {
  return null;
});


const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    loading: false,
    error: null,
    errors: null,
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
      state.error = action.error;
      state.errors = action;
    });
    // Cases for addCustomer
    builder.addCase(addCustomer.fulfilled, (state, action) => {
      state.customers.push(action.payload);
      toast.success('Customer added successfully');
    });
    builder.addCase(addCustomer.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload.title || 'An error occurred';
        state.errors = action.payload.errors || null;
      } else {
        state.error = action.error.message;
      }
      state.error = action.error.message;
    });
    builder.addCase(addCustomer.pending, (state) => {
      state.loading = true;
      state.errors = null;
    });

    // Cases for updateCustomer
    builder.addCase(updateCustomer.fulfilled, (state, action) => {
      const index = state.customers.findIndex(customer => customer.id === action.payload.id);
      state.customers[index] = action.payload;
      toast.success('Customer updated successfully');
    });
    builder.addCase(updateCustomer.rejected, (state, action) => {
      if (action.payload) {
        state.error = action.payload.title || 'An error occurred';
        state.errors = action.payload.errors || null;
      } else {
        state.error = action.error.message;
      }
      state.error = action.error.message;
    });
    builder.addCase(updateCustomer.pending, (state) => {
      state.loading = true;
      state.errors = null;
    });

    // Cases for deleteCustomer
    builder.addCase(deleteCustomer.fulfilled, (state, action) => {
      state.customers = state.customers.filter(customer => customer.id !== action.payload);
    });
    builder.addCase(deleteCustomer.rejected, (state, action) => {
      state.error = action.error.message;
    });
    builder.addCase(deleteCustomer.pending, (state) => {
      state.loading = true;
    });

    // Cases for emptyErrors
    builder.addCase(emptyErrors.fulfilled, (state) => {
      state.errors = null;
    });
  },
});

export default customerSlice.reducer;
