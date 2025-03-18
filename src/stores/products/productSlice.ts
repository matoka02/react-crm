import { createSlice, PayloadAction, ActionReducerMapBuilder, Action } from '@reduxjs/toolkit';

import { Product, NewProduct } from '@/stores/types/modelTypes';

import {
  addProduct,
  deleteProduct,
  fetchAllProducts,
  fetchFilteredProducts,
  fetchProductById,
  updateProduct,
} from './productThunk';

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

// pending
const handleProductPending = (state: ProductState) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

// All products
const handleFetchProductsFulfilled = (state: ProductState, action: PayloadAction<Product[]>) => ({
  ...state,
  isLoading: false,
  products: action.payload,
});
const handleFetchProductsRejected = (state: ProductState, action: PayloadAction<any>) => ({
  ...state,
  isLoading: false,
  error: action.payload,
});

// Product by ID
const handleFetchProductByIdFulfilled = (state: ProductState, action: PayloadAction<Product>) => ({
  ...state,
  isLoading: false,
  products: [...state.products, action.payload],
});
const handleFetchProductByIdRejected = (
  state: ProductState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity: 'warning' as const,
});

// Find products
const handleFilteredProductsFulfilled = (
  state: ProductState,
  action: PayloadAction<Product[]>
) => ({
  ...state,
  isLoading: false,
  products: action.payload,
  snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
  snackbarMessage: action.payload.length === 0 ? 'No products found' : state.snackbarMessage,
  snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
});
const handleFilteredProductsRejected = (
  state: ProductState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity:
    action.payload === 'No products found' ? ('warning' as const) : ('error' as const),
});

// Delete product
const handleDeleteProductFulfilled = (state: ProductState, action: PayloadAction<number>) => ({
  ...state,
  isLoading: false,
  products: state.products.filter((product) => product.id !== String(action.payload)),
  snackbarOpen: true,
  snackbarMessage: `Product id:${action.payload} deleted successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleDeleteProductRejected = (
  state: ProductState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `Error: ${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Add product
const handleAddProductFulfilled = (state: ProductState, action: PayloadAction<Product>) => ({
  ...state,
  isLoading: false,
  products: [...state.products, action.payload],
  snackbarOpen: true,
  snackbarMessage: 'Product added successfully!',
  snackbarSeverity: 'success' as const,
});
const handleAddProductRejected = (
  state: ProductState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Update product
const handleUpdateProductFulfilled = (state: ProductState, action: PayloadAction<Product>) => ({
  ...state,
  isLoading: false,
  products: state.products.map((product) =>
    product.id === action.payload.id ? action.payload : product
  ),
  snackbarOpen: true,
  snackbarMessage: `Product id:${action.payload.id} updated successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleUpdateProductRejected = (
  state: ProductState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state: ProductState) {
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
      .addCase(fetchAllProducts.fulfilled, handleFetchProductsFulfilled)
      .addCase(fetchAllProducts.rejected, handleFetchProductsRejected)
      // Product by ID
      .addCase(fetchProductById.fulfilled, handleFetchProductByIdFulfilled)
      .addCase(fetchProductById.rejected, handleFetchProductByIdRejected)
      // Find products
      .addCase(fetchFilteredProducts.fulfilled, handleFilteredProductsFulfilled)
      .addCase(fetchFilteredProducts.rejected, handleFilteredProductsRejected)
      // Delete product
      .addCase(deleteProduct.fulfilled, handleDeleteProductFulfilled)
      .addCase(deleteProduct.rejected, handleDeleteProductRejected)
      // Add product
      .addCase(addProduct.fulfilled, handleAddProductFulfilled)
      .addCase(addProduct.rejected, handleAddProductRejected)
      // Update product
      .addCase(updateProduct.fulfilled, handleUpdateProductFulfilled)
      .addCase(updateProduct.rejected, handleUpdateProductRejected)
      // pending
      .addMatcher((action: Action) => action.type.endsWith('/pending'), handleProductPending);
  },
});

export const PRODUCT_DURATION = 3000;
export const { clearError, setSearchOpen, setSearch } = productSlice.actions;
export default productSlice.reducer;
