import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';

// import { AuthState } from '@/stores/types/userTypes';

import { HttpMethod } from '../types/httpTypes';

export interface AuthState {
  isFetching: boolean;
  isAuthenticated: boolean;
  user: any | null;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
}

const initialState: AuthState = {
  isFetching: false,
  isAuthenticated: false,
  user: null,
  // error: undefined,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
};

export const signIn = createAsyncThunk<
  any,
  { email: string; password: string },
  { rejectValue: string }
>('auth/signIn', async (credentials, { rejectWithValue }) => {
  try {
    const response = await fetch('/api/auth', {
      method: HttpMethod.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Authorization error');

    const data = await response.json();

    return data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await fetch('/api/auth', { method: HttpMethod.POST });
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
  },
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
        snackbarOpen: true,
        snackbarMessage: 'Successfully signed in!',
        snackbarSeverity: 'success',
      }))
      .addCase(signIn.rejected, (state: AuthState, action: PayloadAction<any>) => ({
        ...state,
        isFetching: false,
        error: action.payload,
        snackbarOpen: true,
        snackbarMessage: action.payload || 'Sign-in failed',
        snackbarSeverity: 'error',
      }))
      .addCase(signOut.pending, (state: AuthState) => ({
        ...state,
        isFetching: true,
        error: undefined,
      }))
      .addCase(signOut.fulfilled, (state: AuthState) => ({
        ...state,
        isAuthenticated: false,
        user: null,
        snackbarOpen: true,
        snackbarMessage: 'Successfully signed out!',
        snackbarSeverity: 'info',
      }))
      .addCase(signOut.rejected, (state: AuthState, action: PayloadAction<any>) => ({
        ...state,
        isAuthenticated: false,
        error: action.payload,
        snackbarOpen: true,
        snackbarMessage: action.payload || 'Sign-out failed',
        snackbarSeverity: 'error',
      }));
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
