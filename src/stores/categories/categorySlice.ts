import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { Category, NewCategory } from '@/stores/types/modelTypes';

import { HttpMethod } from '../types/httpTypes';

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

export const fetchAllCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'category/fetchAllCategories',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/categories', { method: HttpMethod.GET });

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue('Error loading categories');
    }
  }
);

export const fetchCategoryById = createAsyncThunk<Category, string, { rejectValue: string }>(
  'category/fetchCategoryById',
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Category not found');

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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

      const data = await response.json();
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
  async (categoryId: number, { rejectWithValue }) => {
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
  async (newCategory, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories`, {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) throw new Error('Error adding category');

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  'category/updateCategory',
  async (updatedCategory, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/categories/${updatedCategory.id}`, {
        method: HttpMethod.PUT,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });

      if (!response.ok) throw new Error('Error updating category');

      const data = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // error & snackbar
    clearError(state) {
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
      .addCase(fetchAllCategories.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchAllCategories.fulfilled,
        (state: CategoryState, action: PayloadAction<Category[]>) => ({
          ...state,
          isLoading: false,
          categories: action.payload,
        })
      )
      .addCase(fetchAllCategories.rejected, (state: CategoryState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
        snackbarOpen: true,
        snackbarMessage: action.payload,
        snackbarSeverity: 'error',
      }))
      // Category by ID
      .addCase(fetchCategoryById.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(fetchCategoryById.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        categories: [...state.categories, action.payload],
      }))
      .addCase(fetchCategoryById.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'warning',
      }))
      // Find categories
      .addCase(fetchFilteredCategories.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchFilteredCategories.fulfilled,
        (state: CategoryState, action: PayloadAction<Category[]>) => ({
          ...state,
          isLoading: false,
          categories: action.payload,
          snackbarOpen: action.payload.length === 0 ? true : state.snackbarOpen,
          snackbarMessage:
            action.payload.length === 0 ? 'No categories found' : state.snackbarMessage,
          snackbarSeverity: action.payload.length === 0 ? 'warning' : state.snackbarSeverity,
        })
      )
      .addCase(
        fetchFilteredCategories.rejected,
        (state: CategoryState, action: PayloadAction<any>) => ({
          ...state,
          isLoading: false,
          error: action.payload,
          snackbarOpen: true,
          snackbarMessage: action.payload,
          snackbarSeverity: action.payload === 'No categories found' ? 'warning' : 'error',
        })
      )
      // Delete category
      .addCase(deleteCategory.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => ({
        ...state,
        isLoading: false,
        categories: state.categories.filter((category) => category.id !== String(action.payload)),
        snackbarOpen: true,
        snackbarMessage: 'Category deleted successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(deleteCategory.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `Error: ${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Add category
      .addCase(addCategory.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(addCategory.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        categories: [...state.categories, action.payload],
        snackbarOpen: true,
        snackbarMessage: 'Category added successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(addCategory.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }))
      // Update category
      .addCase(updateCategory.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(updateCategory.fulfilled, (state, action) => ({
        ...state,
        isLoading: false,
        categories: state.categories.map((category) =>
          category.id === action.payload.id ? action.payload : category
        ),
        snackbarOpen: true,
        snackbarMessage: 'Category updated successfully!',
        snackbarSeverity: 'success',
      }))
      .addCase(updateCategory.rejected, (state, action) => ({
        ...state,
        isLoading: false,
        snackbarOpen: true,
        snackbarMessage: `${action.payload}`,
        snackbarSeverity: 'error',
      }));
  },
});

export const { clearError, setSearchOpen, setSearch } = categorySlice.actions;
export default categorySlice.reducer;
