import { createAsyncThunk } from '@reduxjs/toolkit';

import { Product, NewProduct, Category } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

/**
 * Gets the category name by `categoryId`, taking data from Redux state.
 * @param categoryId - Category ID.
 * @param getState - Redux `getState()` function.
 * @returns Category name, or "Unknown" if not found.
 */

interface StateWithCategories {
  categories: { categories: Category[] };
}

const getCategoryName = (categoryId: string | number, getState: () => any) => {
  const { categories }: StateWithCategories = getState();

  const foundCategory = categories.categories.find(
    (category) => String(category.id) === String(categoryId)
  );

  return foundCategory?.name || 'Unknown';
};

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/fetchAllProducts',
  async (_: any, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/products', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading products');

      const products: Product[] = await response.json();

      if (!products) throw new Error('Invalid product data from API');

      const data = products.map((product) => ({
        ...product,
        categoryName: getCategoryName(String(product.categoryId), getState),
      }));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'product/fetchProductById',
  async (productId: string, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/products/${productId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Product not found');

      const product: Product = await response.json();

      const data = {
        ...product,
        categoryName: getCategoryName(String(product.categoryId), getState),
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error?.message || 'Failed to fetch product');
    }
  }
);

export const fetchFilteredProducts = createAsyncThunk<
  Product[],
  { name: string },
  { rejectValue: string }
>(
  'product/fetchFilteredProducts',
  async (filters: { name: string }, { getState, rejectWithValue }: any) => {
    try {
      const query = new URLSearchParams(filters).toString();

      const response = await fetch(`/api/products?${query}`, { method: HttpMethod.GET });

      const products: Product[] = await response.json();
      if (products.length === 0) return rejectWithValue('No products found');

      const data = products.map((product) => ({
        ...product,
        categoryName: getCategoryName(product.categoryId, getState),
      }));

      return data;
    } catch (error: any) {
      // console.error(error.message);
      return rejectWithValue('Error fetching filtered products');
    }
  }
);

export const deleteProduct = createAsyncThunk<number, number, { rejectValue: string }>(
  'product/deleteProduct',
  async (productId: number, { rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/products`, {
        method: HttpMethod.DELETE,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: productId }),
      });

      if (!response.ok) throw new Error('Error deleting product');

      const data = await response.json();
      return data.id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk<Product, NewProduct, { rejectValue: string }>(
  'product/addProduct',
  async (newProduct: NewProduct, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/products`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Error adding product');

      const product: Product = await response.json();

      const data = {
        ...product,
        categoryName: getCategoryName(String(product.categoryId), getState),
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  'product/updateProduct',
  async (updatedProduct: Product, { getState, rejectWithValue }: any) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Error updating product');

      const product: Product = await response.json();

      const categoryName =
        product.categoryName || getCategoryName(String(product.categoryId), getState);

      const data = {
        ...product,
        categoryName,
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
