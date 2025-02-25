import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { HttpMethod } from '../types/httpTypes';

interface Order {
  id: string;
  customerId: string;
  totalAmount: number;
  status: 'pending' | 'completed' | 'canceled';
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

export const fetchOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'order/fetchOrders',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/orders', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading orders');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
      .addCase(fetchOrders.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchOrders.fulfilled, (state: OrderState, action: PayloadAction<Order[]>) => ({
        ...state,
        isLoading: false,
        orders: action.payload,
      }))
      .addCase(fetchOrders.rejected, (state: OrderState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }));
  },
});

export default orderSlice.reducer;
