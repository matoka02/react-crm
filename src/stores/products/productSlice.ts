import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

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

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'product/fetchProducts',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/products', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading products');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
    builder
      .addCase(fetchProducts.pending, (state: ProductState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchProducts.fulfilled,
        (state: ProductState, action: PayloadAction<Product[]>) => ({
          ...state,
          isLoading: false,
          products: action.payload,
        })
      )
      .addCase(fetchProducts.rejected, (state: ProductState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }));
  },
});

export default productSlice.reducer;
