import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HttpMethod } from '../types';

interface Order {
  id: string;
  customerId: string;
  totalAmount: number;
  status: "pending" | "completed" | "canceled";
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error?: string;
}

const initialState: OrderState = {
  orders: [],
  isLoading: false,
};

export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/orders", { method: HttpMethod.GET });

      if (!response.ok) throw new Error("Error loading orders");

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default orderSlice.reducer;
