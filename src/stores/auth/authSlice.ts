import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AuthState, HttpMethod } from '../types';

const initialState: AuthState = {
  isFetching: false,
  isAuthenticated: false,
  user: null,
  error: undefined,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error('Authorization error');

      return await response.json();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await fetch('/api/auth/logout', { method: HttpMethod.POST });
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.isFetching = true;
        state.error = undefined;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<any>) => {
        state.isFetching = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(signIn.rejected, (state, action: PayloadAction<any>) => {
        state.isFetching = false;
        state.error = action.payload;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
