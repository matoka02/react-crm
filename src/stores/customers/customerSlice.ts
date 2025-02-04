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
}

const initialState: CustomerState = {
  customers: [],
  isLoading: false,
};


export const fetchCustomers = createAsyncThunk(
  "customer/fetchCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/customers", { method: HttpMethod.GET });

      if (!response.ok) throw new Error("Error loading clients");

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {},
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

export default customerSlice.reducer;



