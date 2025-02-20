import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
  ThunkAPI,
} from '@reduxjs/toolkit';

import { HttpMethod } from '../types';

interface Category {
  id: string;
  name: string;
}

interface CategoryState {
  categories: Category[];
  isLoading: boolean;
  error?: string;
}

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
};

export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  'category/fetchCategories',
  async (_: any, { rejectWithValue }: ThunkAPI<any, any, any, { rejectValue: string }>) => {
    try {
      const response = await fetch('/api/categories', { method: HttpMethod.GET });

      if (!response.ok) throw new Error('Error loading categories');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<CategoryState>) => {
    builder
      .addCase(fetchCategories.pending, (state: CategoryState) => ({
        ...state,
        isLoading: true,
        error: undefined,
      }))
      .addCase(
        fetchCategories.fulfilled,
        (state: CategoryState, action: PayloadAction<Category[]>) => ({
          ...state,
          isLoading: false,
          categories: action.payload,
        })
      )
      .addCase(fetchCategories.rejected, (state: CategoryState, action: PayloadAction<any>) => ({
        ...state,
        isLoading: false,
        error: action.payload,
      }));
  },
});

export default categorySlice.reducer;
