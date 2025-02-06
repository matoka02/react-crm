import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    firstname: string;
    lastname: string;
  };
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  searchOpen: false,
  search: {
    firstname: '',
    lastname: '',
  },
};

export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/customers', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading clients');

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
    setSnackbarOpen(state, action: PayloadAction<boolean>) {
      state.snackbarOpen = action.payload;
    },
    setSnackbarMessage(state, action: PayloadAction<string>) {
      state.snackbarMessage = action.payload;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    setSearch(state, action: PayloadAction<{ firstname: string; lastname: string }>) {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchCustomers.fulfilled, (state, action: PayloadAction<Customer[]>) => {
        state.isLoading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSnackbarOpen, setSnackbarMessage, setSearchOpen, setSearch } =
  customerSlice.actions;
export default customerSlice.reducer;
