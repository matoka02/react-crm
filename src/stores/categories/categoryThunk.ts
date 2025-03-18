import { createAsyncThunk } from '@reduxjs/toolkit';

import { Category, NewCategory } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

export const fetchAllCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'category/fetchAllCategories',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/categories', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading categories');

      const categories: Category[] = await response.json();

      if (!categories) throw new Error('Invalid category data from API');

      return categories;
    } catch (error: any) {
      return rejectWithValue('Error loading categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk<Category, string, { rejectValue: string }>(
  'category/fetchCategoryById',
  async (categoryId: string, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Category not found');

      const data: Category = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch product');
    }
  }
);

export const fetchFilteredCategories = createAsyncThunk<
  Category[],
  { name: string },
  { rejectValue: string }
>(
  'category/fetchFilteredCategories',
  async (filters: { name: string }, { rejectWithValue }: any) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const response = await fetch(`/api/categories?${query}`, { method: HttpMethod.GET });

      const data: Category[] = await response.json();

      if (data.length === 0) return rejectWithValue('No categories found');

      return data;
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue('Error fetching filtered categories');
    }
  }
);

export const deleteCategory = createAsyncThunk<number, number, { rejectValue: string }>(
  'category/deleteCategory',
  async (categoryId: number, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: categoryId }),
      });

      if (!response.ok) throw new Error('Error deleting category');

      const data = await response.json();
      return data.id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk<Category, NewCategory, { rejectValue: string }>(
  'category/addCategory',
  async (newCategory: NewCategory, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error('Error adding category');

      const data: Category = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'category/updateCategory',
  async (updatedCategory: Category, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error('Error updating category');

      const data: Category = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
