import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

import { AuthState, HttpMethod } from '../types/httpTypes';

const initialState: AuthState = {
  isFetching: false,
  isAuthenticated: false,
  user: null,
  error: undefined,
};

export const signIn = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/signIn',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }: ThunkAPI<any, any, any, { rejectValue: string }>
  ) => {
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
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      .addCase(signIn.pending, (state: AuthState) => ({
        ...state,
        isFetching: true,
        error: undefined,
      }))
      .addCase(signIn.fulfilled, (state: AuthState, action: PayloadAction<any>) => ({
        ...state,
        isFetching: false,
        isAuthenticated: true,
        user: action.payload,
      }))
      .addCase(signIn.rejected, (state: AuthState, action: PayloadAction<any>) => ({
        ...state,
        isFetching: false,
        error: action.payload,
      }))
      .addCase(signOut.fulfilled, (state: AuthState) => ({
        ...state,
        isAuthenticated: false,
        user: null,
      }));
  },
});

export default authSlice.reducer;
