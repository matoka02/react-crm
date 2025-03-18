import { createSlice, PayloadAction, ActionReducerMapBuilder, Action } from '@reduxjs/toolkit';

import { Category, NewCategory } from '@/stores/types/modelTypes';

import {
  addCategory,
  deleteCategory,
  fetchAllCategories,
  fetchCategoryById,
  fetchFilteredCategories,
  updateCategory,
} from './categoryThunk';

interface CategoryState {
  categories: Category[];
  category: NewCategory | null;
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

const initialState: CategoryState = {
  categories: [],
  category: null,
  isLoading: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
  searchOpen: false,
  search: { name: '' },
};

// pending
const handleCategoryPending = (state: CategoryState) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

// All categories
const handleFetchAllCategoriesFulfilled = (
  state: CategoryState,
  action: PayloadAction<Category[]>
) => ({
  ...state,
  isLoading: false,
  categories: action.payload,
});
const handleFetchAllCategoriesRejected = (state: CategoryState, action: PayloadAction<any>) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload,
  snackbarSeverity: 'error' as const,
});

// Category by ID
const handleFetchCategoryByIdFulfilled = (
  state: CategoryState,
  action: PayloadAction<Category>
) => ({
  ...state,
  isLoading: false,
  categories: [...state.categories, action.payload],
});
const handleFetchCategoryByIdRejected = (
  state: CategoryState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'warning' as const,
});

// Find categories
const handleFetchFilteredCategoriesFulfilled = (
  state: CategoryState,
  action: PayloadAction<Category[]>
) => ({
  ...state,
  isLoading: false,
  categories: action.payload,
  snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
  snackbarMessage: action.payload.length === 0 ? 'No categories found' : state.snackbarMessage,
  snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
});
const handleFetchFilteredCategoriesRejected = (
  state: CategoryState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload ?? 'Unknown error',
  snackbarSeverity:
    action.payload === 'No categories found' ? ('warning' as const) : ('error' as const),
});

// Delete category
const handleDeleteCategoryFulfilled = (state: CategoryState, action: PayloadAction<number>) => ({
  ...state,
  isLoading: false,
  categories: state.categories.filter((category) => category.id !== String(action.payload)),
  snackbarOpen: true,
  snackbarMessage: `Category id:${action.payload} deleted successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleDeleteCategoryRejected = (
  state: CategoryState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `Error: ${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Add category
const handleAddCategoryFulfilled = (state: CategoryState, action: PayloadAction<Category>) => ({
  ...state,
  isLoading: false,
  categories: [...state.categories, action.payload],
  snackbarOpen: true,
  snackbarMessage: 'Category added successfully!',
  snackbarSeverity: 'success' as const,
});
const handleAddCategoryRejected = (
  state: CategoryState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

// Update category
const handleUpdateCategoryFulfilled = (state: CategoryState, action: PayloadAction<Category>) => ({
  ...state,
  isLoading: false,
  categories: state.categories.map((category) =>
    category.id === action.payload.id ? action.payload : category
  ),
  snackbarOpen: true,
  snackbarMessage: `Category id:${action.payload.id} updated successfully!`,
  snackbarSeverity: 'success' as const,
});
const handleUpdateCategoryRejected = (
  state: CategoryState,
  action: PayloadAction<string | undefined>
) => ({
  ...state,
  isLoading: false,
  snackbarOpen: true,
  snackbarMessage: `${action.payload}`,
  snackbarSeverity: 'error' as const,
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state: CategoryState) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
    // searchbar
    setSearchOpen(state: CategoryState, action: PayloadAction<boolean>) {
      return { ...state, searchOpen: action.payload };
    },
    setSearch(state: CategoryState, action: PayloadAction<{ name: string }>) {
      return { ...state, search: action.payload };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<CategoryState>) => {
    builder
      // All categories
      .addCase(fetchAllCategories.fulfilled, handleFetchAllCategoriesFulfilled)
      .addCase(fetchAllCategories.rejected, handleFetchAllCategoriesRejected)
      // Category by ID
      .addCase(fetchCategoryById.fulfilled, handleFetchCategoryByIdFulfilled)
      .addCase(fetchCategoryById.rejected, handleFetchCategoryByIdRejected)
      // Find categories
      .addCase(fetchFilteredCategories.fulfilled, handleFetchFilteredCategoriesFulfilled)
      .addCase(fetchFilteredCategories.rejected, handleFetchFilteredCategoriesRejected)
      // Delete category
      .addCase(deleteCategory.fulfilled, handleDeleteCategoryFulfilled)
      .addCase(deleteCategory.rejected, handleDeleteCategoryRejected)
      // Add category
      .addCase(addCategory.fulfilled, handleAddCategoryFulfilled)
      .addCase(addCategory.rejected, handleAddCategoryRejected)
      // Update category
      .addCase(updateCategory.fulfilled, handleUpdateCategoryFulfilled)
      .addCase(updateCategory.rejected, handleUpdateCategoryRejected)
      // pending
      .addMatcher((action: Action) => action.type.endsWith('/pending'), handleCategoryPending);
  },
});

export const CATEGORY_DURATION = 3000;
export const { clearError, setSearchOpen, setSearch } = categorySlice.actions;
export default categorySlice.reducer;
