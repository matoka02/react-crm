import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { Order } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

import getCustomerName from './customerUtils';
import getProductCount from './productUtils';

interface OrderState {
  orders: Order[];
  // order: NewOrder | null;
  isLoading: boolean;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
  searchOpen: boolean;
  search: {
    reference: string;
  };
}

const initialState: OrderState = {
  orders: [],
  // order: null,
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
  searchOpen: false,
  search: { reference: '' },
};

export const fetchAllOrders = createAsyncThunk<Order[], void, { rejectValue: string }>(
  'order/fetchOrders',
  async (_: any, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/orders', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading orders');

      const orders: Order[] = await response.json();

      if (!orders) throw new Error('Invalid order data from API');

      const data = orders.map((order) => ({
        ...order,
        customerName: getCustomerName(order.customerId, getState),
        productsCount: getProductCount(order.products),
      }));

      return data;

      return orders;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
    // searchbar
    setSearchOpen(state: OrderState, action: PayloadAction<boolean>) {
      return { ...state, searchOpen: action.payload };
    },
    setSearch(state: OrderState, action: PayloadAction<{ reference: string }>) {
      return { ...state, search: action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<OrderState>) => {
    builder
      .addCase(fetchAllOrders.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchAllOrders.fulfilled, (state: OrderState, action: PayloadAction<Order[]>) => ({
        ...state,
        isLoading: false,
        orders: action.payload,
      }))
      .addCase(fetchAllOrders.rejected, (state: OrderState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }));
  },
});

export default orderSlice.reducer;
