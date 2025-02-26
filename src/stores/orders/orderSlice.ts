import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { NewOrder, Order } from '@/stores/types/modelTypes';

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

export const fetchOrderById = createAsyncThunk<Order, string, { rejectValue: string }>(
  'order/fetchOrderById',
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Order not found');

      const order: Order = await response.json();

      const data = {
        ...order,
        customerName: getCustomerName(order.customerId, getState),
        productsCount: getProductCount(order.products),
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFilteredOrders = createAsyncThunk<
  Order[],
  { reference: string },
  { rejectValue: string }
>('order/fetchFilteredOrders', async (filters, { getState, rejectWithValue }) => {
  try {
    const query = new URLSearchParams(filters).toString();
    const response = await fetch(`/api/orders?${query}`, { method: HttpMethod.GET });

    if (!response.ok) throw new Error('Error fetching filtered orders');

    const orders: Order[] = await response.json();

    const data = orders.map((order) => ({
      ...order,
      customerName: getCustomerName(order.customerId, getState),
      productsCount: getProductCount(order.products),
    }));

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const deleteOrder = createAsyncThunk<number, number, { rejectValue: string }>(
  'order/deleteOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders`, {
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId }),
      });

      if (!response.ok) throw new Error('Error deleting order');

      const data = await response.json();
      return data.id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addOrder = createAsyncThunk<Order, NewOrder, { rejectValue: string }>(
  'order/addOrder',
  async (newOrder, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });

      if (!response.ok) throw new Error('Error adding order');

      const order: Order = await response.json();

      const data = {
        ...order,
        customerName: getCustomerName(order.customerId, getState),
        productsCount: getProductCount(order.products),
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrder = createAsyncThunk<Order, Order, { rejectValue: string }>(
  'order/updateOrder',
  async (updatedOrder, { getState, rejectWithValue }) => {
    try {
      console.log('Updating Order:', updatedOrder);
      const response = await fetch(`/api/orders/${updatedOrder.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) throw new Error('Error updating order');

      console.log('updateOrder');
      console.table(updateOrder);


      const order: Order = await response.json();

      const data = {
        ...order,
        customerName: getCustomerName(order.customerId, getState),
        productsCount: getProductCount(order.products),
      };

      return data;
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
      // All orders
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
      }))
      // Order by ID
      .addCase(fetchOrderById.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchOrderById.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        orders: [...state.orders, action.payload],
      }))
      .addCase(fetchOrderById.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'warning',
      }))
      // Find orders
      .addCase(fetchFilteredOrders.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchFilteredOrders.fulfilled,
        (state: OrderState, action: PayloadAction<Order[]>) => ({
          ...state,
          isLoading: false,
          orders: action.payload,
          snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
          snackbarMessage: action.payload.length === 0 ? 'No orders found' : state.snackbarMessage,
          snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
        })
      )
      .addCase(fetchFilteredOrders.rejected, (state: OrderState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
        snackbarOpen: true,
        snackbarMessage: action.payload,
        snackbarSeverity: action.payload === 'No orders found' ? 'warning' : 'error',
      }))
      // Delete order
      .addCase(deleteOrder.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(deleteOrder.fulfilled, (state, action: PayloadAction<number>) => ({
        ...state,
        isLoading: false,
        orders: state.orders.filter((order) => order.id !== String(action.payload)),
        snackbarOpen: true,
        snackbarMessage: 'Order deleted successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(deleteOrder.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Error: ${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Add order
      .addCase(addOrder.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(addOrder.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        orders: [...state.orders, action.payload],
        snackbarOpen: true,
        snackbarMessage: 'Order added successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(addOrder.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Update order
      .addCase(updateOrder.pending, (state: OrderState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(updateOrder.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        orders: state.orders.map((order) =>
          order.id === action.payload.id ? action.payload : order
        ),
        snackbarOpen: true,
        snackbarMessage: 'Order updated successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(updateOrder.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }));
  },
});

export const ORDER_DURATION = 3000;
export const { clearError, setSearchOpen, setSearch } = orderSlice.actions;
export default orderSlice.reducer;
