import { createAsyncThunk } from '@reduxjs/toolkit';

import { Customer, NewOrder, Order, Product } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

/**
 * Gets the customer's first name by `customerId`, taking data from Redux state.
 * @param customerId - Customer ID.
 * @param getState - Redux `getState()` function.
 * @returns Customer first name, or "Unknown" if not found.
 */

interface StateWithCustomers {
  customers: { customers: Customer[] };
}

const getCustomerName = (customerId: string, getState: () => any): string => {
  const { customers }: StateWithCustomers = getState();

  const foundCustomer = customers.customers.find(
    (customer) => String(customer.id) === String(customerId)
  );

  return foundCustomer?.firstName || 'Unknown';
};

/**
 * Gets the total number of products in an order.
 * @param products - Array of products in the order.
 * @returns Number of products.
 */

const getProductCount = (products: Product[]): number => products.length;

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
  async (orderId: string, { getState, rejectWithValue }: any) => {
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
      return rejectWithValue(error?.message || 'Failed to fetch order');
    }
  }
);

export const fetchFilteredOrders = createAsyncThunk<
  Order[],
  { reference: string },
  { rejectValue: string }
>(
  'order/fetchFilteredOrders',
  async (filters: { reference: string }, { getState, rejectWithValue }: any) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const response = await fetch(`/api/orders?${query}`, { method: HttpMethod.GET });

      // if (!response.ok) throw new Error('Error fetching filtered orders');

      const orders: Order[] = await response.json();
      if (orders.length === 0) return rejectWithValue('No orders found');

      const data = orders.map((order) => ({
        ...order,
        customerName: getCustomerName(order.customerId, getState),
        productsCount: getProductCount(order.products),
      }));

      return data;
    } catch (error: any) {
      return rejectWithValue('Error fetching filtered orders');
    }
  }
);

export const deleteOrder = createAsyncThunk<number, number, { rejectValue: string }>(
  'order/deleteOrder',
  async (orderId: number, { rejectWithValue }: any) => {
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
  async (newOrder: NewOrder, { getState, rejectWithValue }: any) => {
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
  async (updatedOrder: Order, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/orders/${updatedOrder.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedOrder),
      });

      if (!response.ok) throw new Error('Error updating order');

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
