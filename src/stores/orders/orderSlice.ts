import { createSlice, PayloadAction, ActionReducerMapBuilder, Action } from '@reduxjs/toolkit';

import { NewOrder, Order } from '@/stores/types/modelTypes';

import {
  addOrder,
  deleteOrder,
  fetchAllOrders,
  fetchFilteredOrders,
  fetchOrderById,
  updateOrder,
} from './orderThunk';

interface OrderState {
  orders: Order[];
  order: NewOrder | null;
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
  order: null,
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
  searchOpen: false,
  search: { reference: '' },
};

// pending
const handleOrderPending = (state: OrderState) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

// All orders
const handleFetchAllOrdersFulfilled = (state: OrderState, action: PayloadAction<Order[]>) => ({
  ...state,
  isLoading: false,
  orders: action.payload,
});
const handleFetchAllOrdersRejected = (state: OrderState, action: PayloadAction<any>) => ({
  ...state,
  isLoading: false,
  error: action.payload,
});

// Order by ID
const handleFetchOrderByIdFulfilled = (state: OrderState, action: PayloadAction<Order>) => ({
  ...state,
  isLoading: false,
  // orders: [...state.orders, action.payload],
  orders: state.orders.map((order) => (order.id === action.payload.id ? action.payload : order)),
});
const handleFetchOrderByIdRejected = (
  state: OrderState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity: 'warning' as const,
});

// Find orders
const handleFilteredOrdersFulfilled = (state: OrderState, action: PayloadAction<Order[]>) => ({
  ...state,
  isLoading: false,
  orders: action.payload,
  snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
  snackbarMessage: action.payload.length === 0 ? 'No orders found' : state.snackbarMessage,
  snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
});
const handleFilteredOrdersRejected = (
  state: OrderState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity:
    action.payload === 'No orders found' ? ('warning' as const) : ('error' as const),
});

// Delete order
const handleDeleteOrderFulfilled = (state: OrderState, action: PayloadAction<number>) => ({
  ...state,
  isLoading: false,
  orders: state.orders.filter((order) => order.id !== String(action.payload)),
  snackbarOpen: true,
  snackbarMessage: `Order id:${action.payload} deleted successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleDeleteOrderRejected = (
  state: OrderState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `Error: ${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Add order
const handleAddOrderFulfilled = (state: OrderState, action: PayloadAction<Order>) => ({
  ...state,
  isLoading: false,
  orders: [...state.orders, action.payload],
  snackbarOpen: true,
  snackbarMessage: 'Order added successfully!',
  snackbarSeverity: 'success' as const,
});
const handleAddOrderRejected = (state: OrderState, action: PayloadAction<string | undefined>) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Update order
const handleUpdateOrderFulfilled = (state: OrderState, action: PayloadAction<Order>) => ({
  ...state,
  isLoading: false,
  orders: state.orders.map((order) => (order.id === action.payload.id ? action.payload : order)),
  snackbarOpen: true,
  snackbarMessage: `Order id:${action.payload.id} updated successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleUpdateOrderRejected = (
  state: OrderState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

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
      .addCase(fetchAllOrders.fulfilled, handleFetchAllOrdersFulfilled)
      .addCase(fetchAllOrders.rejected, handleFetchAllOrdersRejected)
      // Order by ID
      .addCase(fetchOrderById.fulfilled, handleFetchOrderByIdFulfilled)
      .addCase(fetchOrderById.rejected, handleFetchOrderByIdRejected)
      // Find orders
      .addCase(fetchFilteredOrders.fulfilled, handleFilteredOrdersFulfilled)
      .addCase(fetchFilteredOrders.rejected, handleFilteredOrdersRejected)
      // Delete order
      .addCase(deleteOrder.fulfilled, handleDeleteOrderFulfilled)
      .addCase(deleteOrder.rejected, handleDeleteOrderRejected)
      // Add order
      .addCase(addOrder.fulfilled, handleAddOrderFulfilled)
      .addCase(addOrder.rejected, handleAddOrderRejected)
      // Update order
      .addCase(updateOrder.fulfilled, handleUpdateOrderFulfilled)
      .addCase(updateOrder.rejected, handleUpdateOrderRejected)
      // pending
      .addMatcher((action: Action) => action.type.endsWith('/pending'), handleOrderPending);
  },
});

export const ORDER_DURATION = 3000;
export const { clearError, setSearchOpen, setSearch } = orderSlice.actions;
export default orderSlice.reducer;
