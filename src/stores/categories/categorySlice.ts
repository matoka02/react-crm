import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/categories", { method: HttpMethod.GET });

      if (!response.ok) throw new Error("Error loading categories");

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
