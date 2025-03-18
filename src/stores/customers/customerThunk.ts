import { createAsyncThunk } from '@reduxjs/toolkit';

import { Customer, NewCustomer } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

export const fetchAllCustomers = createAsyncThunk<Customer[], void, { rejectValue: string }>(
  'customer/fetchAllCustomers',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/customers', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading customers');

      const customers: Customer[] = await response.json();

      if (!customers) throw new Error('Invalid customer data from API');

      return customers;
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCustomerById = createAsyncThunk<Customer, string, { rejectValue: string }>(
  'customer/fetchCustomerById',
  async (customerId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/customers/${customerId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Customer not found');

      const data: Customer = await response.json();
      return data;
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

      const response = await fetch(`/api/customers?${query}`, { method: HttpMethod.GET });

      const data: Customer[] = await response.json();

      if (data.length === 0) return rejectWithValue('No customers found');

      return data;
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue('Error fetching filtered customers');
    }
  }
);

export const deleteCustomer = createAsyncThunk<number, number, { rejectValue: string }>(
  'customer/deleteCustomer',
  async (customerId: number, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/customers`, {
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: customerId }),
      });

      if (!response.ok) throw new Error('Error deleting customer');

      const data = await response.json();
      return data.id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCustomer = createAsyncThunk<Customer, NewCustomer, { rejectValue: string }>(
  'customer/addCustomer',
  async (newCustomer: NewCustomer, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/customers`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer),
      });

      if (!response.ok) throw new Error('Error adding customer');

      const data: Customer = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomer = createAsyncThunk<Customer, Customer, { rejectValue: string }>(
  'customer/updateCustomer',
  async (updatedCustomer: Customer, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/customers/${updatedCustomer.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer),
      });

      if (!response.ok) throw new Error('Error updating customer');

      const data: Customer = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
