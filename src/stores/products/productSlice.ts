import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { Product, NewProduct } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

import getCategoryNameById from './categoryUtils';

interface ProductState {
  products: Product[];
  product: NewProduct | null;
  isLoading: boolean;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
  searchOpen: boolean;
  search: {
    name: string;
  };
}

const initialState: ProductState = {
  products: [],
  product: null,
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
  searchOpen: false,
  search: { name: '' },
};

export const fetchAllProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/fetchAllProducts',
  async (_: any, { getState, rejectWithValue }) => {
    try {
      const response = await fetch('/api/products', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading products');

      const products: Product[] = await response.json();

      const data = products.map((product) => ({
        ...product,
        categoryName: getCategoryNameById(String(product.categoryId), getState),
      }));

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk<Product, string, { rejectValue: string }>(
  'product/fetchProductById',
  async (productId, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/product/${productId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Product not found');

      const product: Product = await response.json();

      const data = {
        ...product,
        categoryName: getCategoryNameById(String(product.categoryId), getState),
      };

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
        categoryName: getCategoryNameById(product.categoryId, getState),
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
  async (productId: number, { rejectWithValue }) => {
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
  async (newProduct, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) throw new Error('Error adding product');

      const product: Product = await response.json();

      return {
        ...product,
        categoryName: getCategoryNameById(product.categoryId, getState),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  'product/updateProduct',
  async (updatedProduct, { getState, rejectWithValue }) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) throw new Error('Error updating product');

      const product: NewProduct = await response.json();

      return {
        ...product,
        categoryName: getCategoryNameById(product.categoryId, getState),
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
    // searchbar
    setSearchOpen(state: ProductState, action: PayloadAction<boolean>) {
      return { ...state, searchOpen: action.payload };
    },
    setSearch(state: ProductState, action: PayloadAction<{ name: string }>) {
      return { ...state, search: action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
    builder
      // All products
      .addCase(fetchAllProducts.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchAllProducts.fulfilled,
        (state: ProductState, action: PayloadAction<Product[]>) => ({
          ...state,
          isLoading: false,
          products: action.payload,
        })
      )
      .addCase(fetchAllProducts.rejected, (state: ProductState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }))
      // Product by ID
      .addCase(fetchProductById.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchProductById.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        products: [...state.products, action.payload],
      }))
      .addCase(fetchProductById.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'warning',
      }))
      // Find products
      .addCase(fetchFilteredProducts.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchFilteredProducts.fulfilled,
        (state: ProductState, action: PayloadAction<Product[]>) => ({
          ...state,
          isLoading: false,
          products: action.payload,
          snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
          snackbarMessage:
            action.payload.length === 0 ? 'No products found' : state.snackbarMessage,
          snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
        })
      )
      .addCase(
        fetchFilteredProducts.rejected,
        (state: ProductState, action: PayloadAction<any>) => ({
          ...state,
          isLoading: false,
          error: action.payload,
          snackbarOpen: true,
          snackbarMessage: action.payload,
          snackbarSeverity: action.payload === 'No products found' ? 'warning' : 'error',
        })
      )
      // Delete product
      .addCase(deleteProduct.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => ({
        ...state,
        isLoading: false,
        products: state.products.filter((product) => product.id !== String(action.payload)),
        snackbarOpen: true,
        snackbarMessage: 'Product deleted successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(deleteProduct.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Error: ${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Add product
      .addCase(addProduct.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(addProduct.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        products: [...state.products, action.payload],
        snackbarOpen: true,
        snackbarMessage: 'Product added successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(addProduct.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Update product
      .addCase(updateProduct.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(updateProduct.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        products: state.products.map((product) =>
          product.id === action.payload.id ? action.payload : product
        ),
        snackbarOpen: true,
        snackbarMessage: 'Product updated successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(updateProduct.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }));
  },
});

export const { clearError, setSearchOpen, setSearch } = productSlice.actions;
export default productSlice.reducer;
