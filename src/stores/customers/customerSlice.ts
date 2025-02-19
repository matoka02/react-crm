import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { HttpMethod } from '../types';

interface Customer {
  id: string;
  name: string;
  email: string;
}

interface CustomerState {
  customers: Customer[];
  isLoading: boolean;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  searchOpen: boolean;
  search: {
    firstName: string;
    lastName: string;
  };
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
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

      if (!response.ok) throw new Error('Error loading clients');

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
      console.log('query: ', query);

      const response = await fetch(`/api/customers?${query}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error fetching filtered customers');

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
    setSnackbarOpen(state: CustomerState, action: PayloadAction<boolean>) {
      return { ...state, snackbarOpen: action.payload };
    },
    setSnackbarMessage(state: CustomerState, action: PayloadAction<string>) {
      return { ...state, snackbarMessage: action.payload };
    },
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
        })
      )
      .addCase(
        fetchFilteredCustomers.rejected,
        (state: CustomerState, action: PayloadAction<any>) => ({
          ...state,
          isLoading: false,
          error: action.payload,
        })
      );
  },
});

export const { setSnackbarOpen, setSnackbarMessage, setSearchOpen, setSearch } =
  customerSlice.actions;
export default customerSlice.reducer;
