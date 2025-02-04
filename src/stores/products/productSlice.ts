import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { HttpMethod } from '../types';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error?: string;
}

const initialState: ProductState = {
  products: [],
  isLoading: false,
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products", { method: HttpMethod.GET });

      if (!response.ok) throw new Error("Error loading products");

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
