import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { Customer, NewCustomer } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

interface CustomerState {
  customers: Customer[];
  customer: NewCustomer | null;
  isLoading: boolean;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
  searchOpen: boolean;
  search: {
    firstName: string;
    lastName: string;
  };
}

const initialState: CustomerState = {
  customers: [],
  customer: null,
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
  searchOpen: false,
  search: {
    firstName: '',
    lastName: '',
  },
};

export const fetchAllCustomers = createAsyncThunk<Customer[], void, { rejectValue: string }>(
  'customer/fetchAllCustomers',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/customers', { method: HttpMethod.GET });

      return await response.json();
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue('Error loading customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk<Customer, string, { rejectValue: string }>(
  'customer/fetchCustomerById',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Customer not found');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFilteredCustomers = createAsyncThunk<
  Customer[],
  { firstName: string; lastName: string },
  { rejectValue: string }
>(
  'customer/fetchFilteredCustomers',
  async (filters: { firstName: string; lastName: string }, { rejectWithValue }: any) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const response = await fetch(`/api/customers?${query}`, { method: HttpMethod.GET });

      const data = await response.json();
      if (data.length === 0) return rejectWithValue('No customers found');
      return data;
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue('Error fetching filtered customers');
    }
  }
);

export const deleteCustomer = createAsyncThunk<number, number, { rejectValue: string }>(
  'customer/deleteCustomer',
  async (customerId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/customers`, {
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customerId }),
      });

      if (!response.ok) throw new Error('Error deleting customer');

      const data = await response.json();
      return data.id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCustomer = createAsyncThunk<Customer, NewCustomer, { rejectValue: string }>(
  'customer/addCustomer',
  async (newCustomer, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/customers`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) throw new Error('Error adding customer');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk<Customer, NewCustomer, { rejectValue: string }>(
  'customer/updateCustomer',
  async (updatedCustomer, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/customers/${updatedCustomer.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) throw new Error('Error updating customer');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
    // searchbar
    setSearchOpen(state: CustomerState, action: PayloadAction<boolean>) {
      return { ...state, searchOpen: action.payload };
    },
    setSearch(
      state: CustomerState,
      action: PayloadAction<{ firstName: string; lastName: string }>
    ) {
      return { ...state, search: action.payload };
    },
    // form
    setCustomer(state, action: PayloadAction<NewCustomer | null>) {
      return { ...state, customer: action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CustomerState>) => {
    builder
      // All customers
      .addCase(fetchAllCustomers.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchAllCustomers.fulfilled,
        (state: CustomerState, action: PayloadAction<Customer[]>) => ({
          ...state,
          isLoading: false,
          customers: action.payload,
        })
      )
      .addCase(fetchAllCustomers.rejected, (state: CustomerState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
        snackbarOpen: true,
        snackbarMessage: action.payload,
        snackbarSeverity: 'error',
      }))
      // Customer by ID
      .addCase(fetchCustomerById.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchCustomerById.fulfilled, (state, action) => ({
        ...state,
        customers: [...state.customers, action.payload],
      }))
      .addCase(fetchCustomerById.rejected, (state, action) => ({
        ...state,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'warning',
      }))
      // Find customers
      .addCase(fetchFilteredCustomers.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchFilteredCustomers.fulfilled,
        (state: CustomerState, action: PayloadAction<Customer[]>) => ({
          ...state,
          isLoading: false,
          customers: action.payload,
          snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
          snackbarMessage:
            action.payload.length === 0 ? 'No customers found' : state.snackbarMessage,
          snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
        })
      )
      .addCase(
        fetchFilteredCustomers.rejected,
        (state: CustomerState, action: PayloadAction<any>) => ({
          ...state,
          isLoading: false,
          error: action.payload,
          snackbarOpen: true,
          snackbarMessage: action.payload,
          snackbarSeverity: action.payload === 'No customers found' ? 'warning' : 'error',
        })
      )
      // Delete customer
      .addCase(deleteCustomer.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(deleteCustomer.fulfilled, (state, action: PayloadAction<number>) => ({
        ...state,
        customers: state.customers.filter((customer) => customer.id !== String(action.payload)),
        snackbarOpen: true,
        snackbarMessage: 'Customer deleted successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(deleteCustomer.rejected, (state, action) => ({
        ...state,
        snackbarOpen: true,
        snackbarMessage: `Error: ${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Add customer
      .addCase(addCustomer.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(addCustomer.fulfilled, (state, action) => ({
        ...state,
        customers: [...state.customers, action.payload],
        snackbarOpen: true,
        snackbarMessage: 'Customer added successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(addCustomer.rejected, (state, action) => ({
        ...state,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Update customer
      .addCase(updateCustomer.pending, (state: CustomerState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(updateCustomer.fulfilled, (state, action) => ({
        ...state,
        customers: state.customers.map((customer) =>
          customer.id === action.payload.id ? action.payload : customer
        ),
        snackbarOpen: true,
        snackbarMessage: 'Customer updated successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(updateCustomer.rejected, (state, action) => ({
        ...state,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }));
  },
});

export const { clearError, setSearchOpen, setSearch, setCustomer } = customerSlice.actions;
export default customerSlice.reducer;
