import { createSlice, PayloadAction, ActionReducerMapBuilder, Action } from '@reduxjs/toolkit';

import { User } from '@/stores/types/userTypes';

import { signIn, signOut } from './authThunk';

export interface AuthState {
  user: User | null;
  token: string | null;
  isFetching: boolean;
  isAuthenticated: boolean;
  error?: string;
  snackbarOpen: boolean;
  snackbarMessage: string;
  snackbarSeverity: 'success' | 'error' | 'warning' | 'info';
}

const initialState: AuthState = {
  user: null,
  token: null,
  isFetching: false,
  isAuthenticated: false,
  snackbarOpen: false,
  snackbarMessage: '',
  snackbarSeverity: 'info',
};

// pending
const handleAuthPending = (state: AuthState) => ({
  ...state,
  isLoading: true,
  error: undefined,
});

// LogIn
const handleLogInFulfilled = (
  state: AuthState,
  action: PayloadAction<{ user: User; token: string }>
) => ({
  ...state,
  isFetching: false,
  isAuthenticated: true,
  user: action.payload.user,
  token: action.payload.token,
  snackbarOpen: true,
  snackbarMessage: 'Successfully signed in!',
  snackbarSeverity: 'success' as const,
});
const handleLogInRejected = (state: AuthState, action: PayloadAction<string | undefined>) => ({
  ...state,
  isFetching: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload || 'Sign-in failed',
  snackbarSeverity: 'error' as const,
});

// LogOut
const handleLogOutFulfilled = (state: AuthState) => ({
  ...state,
  isFetching: false,
  isAuthenticated: false,
  user: null,
  token: null,
  snackbarOpen: true,
  snackbarMessage: 'Successfully signed out!',
  snackbarSeverity: 'info' as const,
});
const handleLogOutRejected = (state: AuthState, action: PayloadAction<string | undefined>) => ({
  ...state,
  isAuthenticated: false,
  error: action.payload,
  snackbarOpen: true,
  snackbarMessage: action.payload || 'Sign-out failed',
  snackbarSeverity: 'error' as const,
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // to load the state at startup
    setAuthState(state, action: PayloadAction<{ user: User; token: string }>) {
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
      };
    },
    clearError(state) {
      return { ...state, error: undefined, snackbarOpen: false };
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      // LogIn
      .addCase(signIn.fulfilled, handleLogInFulfilled)
      .addCase(signIn.rejected, handleLogInRejected)
      // LogOut
      .addCase(signOut.fulfilled, handleLogOutFulfilled)
      .addCase(signOut.rejected, handleLogOutRejected)
      // pending
      .addMatcher((action: Action) => action.type.endsWith('/pending'), handleAuthPending);
  },
});

export const USER_DURATION = 3000;
export const { setAuthState, clearError } = authSlice.actions;
export default authSlice.reducer;
