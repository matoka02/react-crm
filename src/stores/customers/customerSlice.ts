import { createSlice, PayloadAction, ActionReducerMapBuilder, Action } from '@reduxjs/toolkit';

import { Customer, NewCustomer } from '@/stores/types/modelTypes';

import {
  addCustomer,
  deleteCustomer,
  fetchAllCustomers,
  fetchCustomerById,
  fetchFilteredCustomers,
  updateCustomer,
} from './customerThunk';

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

// pending
const handleCustomerPending = (state: CustomerState) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

// All customers
const handleFetchAllCustomersFulfilled = (
  state: CustomerState,
  action: PayloadAction<Customer[]>
) => ({
  ...state,
  isLoading: false,
  customers: action.payload,
});
const handleFetchAllCustomersRejected = (state: CustomerState, action: PayloadAction<any>) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload,
  snackbarSeverity: 'error' as const,
});

// Customer by ID
const handleFetchCustomerByIdFulfilled = (
  state: CustomerState,
  action: PayloadAction<Customer>
) => ({
  ...state,
  isLoading: false,
  customers: [...state.customers, action.payload],
});
const handleFetchCustomerByIdRejected = (
  state: CustomerState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'warning' as const,
});

// Find customers
const handleFilteredCustomersFulfilled = (
  state: CustomerState,
  action: PayloadAction<Customer[]>
) => ({
  ...state,
  isLoading: false,
  customers: action.payload,
  snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
  snackbarMessage: action.payload.length === 0 ? 'No customers found' : state.snackbarMessage,
  snackbarSeverity: action.payload.length === 0 ? ('warning' as const) : state.snackbarSeverity,
});
const handleFilteredCustomersRejected = (
  state: CustomerState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity:
    action.payload === 'No customers found' ? ('warning' as const) : ('error' as const),
});

// Delete customer
const handleDeleteCustomerFulfilled = (state: CustomerState, action: PayloadAction<number>) => ({
  ...state,
  isLoading: false,
  customers: state.customers.filter((customer) => customer.id !== String(action.payload)),
  snackbarOpen: true,
  snackbarMessage: `Customer id:${action.payload} deleted successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleDeleteCustomerRejected = (
  state: CustomerState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `Error: ${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Add customer
const handleAddCustomerFulfilled = (state: CustomerState, action: PayloadAction<Customer>) => ({
  ...state,
  isLoading: false,
  customers: [...state.customers, action.payload],
  snackbarOpen: true,
  snackbarMessage: 'Customer added successfully!',
  snackbarSeverity: 'success' as const,
});
const handleAddCustomerRejected = (
  state: CustomerState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Update customer
const handleUpdateCustomerFulfilled = (state: CustomerState, action: PayloadAction<Customer>) => ({
  ...state,
  isLoading: false,
  customers: state.customers.map((customer) =>
    customer.id === action.payload.id ? action.payload : customer
  ),
  snackbarOpen: true,
  snackbarMessage: `Customer id:${action.payload.id} updated successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleUpdateCustomerRejected = (
  state: CustomerState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

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
  },
  extraReducers: (builder: ActionReducerMapBuilder<CustomerState>) => {
    builder
      // All customers
      .addCase(fetchAllCustomers.fulfilled, handleFetchAllCustomersFulfilled)
      .addCase(fetchAllCustomers.rejected, handleFetchAllCustomersRejected)
      // Customer by ID
      .addCase(fetchCustomerById.fulfilled, handleFetchCustomerByIdFulfilled)
      .addCase(fetchCustomerById.rejected, handleFetchCustomerByIdRejected)
      // Find customers
      .addCase(fetchFilteredCustomers.fulfilled, handleFilteredCustomersFulfilled)
      .addCase(fetchFilteredCustomers.rejected, handleFilteredCustomersRejected)
      // Delete customer
      .addCase(deleteCustomer.fulfilled, handleDeleteCustomerFulfilled)
      .addCase(deleteCustomer.rejected, handleDeleteCustomerRejected)
      // Add customer
      .addCase(addCustomer.fulfilled, handleAddCustomerFulfilled)
      .addCase(addCustomer.rejected, handleAddCustomerRejected)
      // Update customer
      .addCase(updateCustomer.fulfilled, handleUpdateCustomerFulfilled)
      .addCase(updateCustomer.rejected, handleUpdateCustomerRejected)
      // pending
      .addMatcher((action: Action) => action.type.endsWith('/pending'), handleCustomerPending);
  },
});

export const CUSTOMER_DURATION = 3000;
export const { clearError, setSearchOpen, setSearch } = customerSlice.actions;
export default customerSlice.reducer;
