import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { Product, NewProduct, Category } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

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
      const state: any = getState();
      const {categories}: {categories: Category[]} = state.categories;

      // Call from categorySlice
      const productsWithCategories = products.map((product) => ({
        ...product,
        categoryName: categories.find((cat) => cat.id === product.categoryId)?.name || 'Unknown',
      }));

      return productsWithCategories;
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
    // form
    setProduct(state, action: PayloadAction<NewProduct | null>) {
      return { ...state, product: action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
    builder
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
      }));
  },
});

export default productSlice.reducer;
