import { createAsyncThunk } from '@reduxjs/toolkit';

import { User } from '@/stores/types/userTypes';

import { HttpMethod } from '../types/httpTypes';

const isBrowser = typeof window !== 'undefined';

const setTokenUser = (token: string, user: User) => {
  if (isBrowser) {
    localStorage.setItem('react-crm-token', token.toString());
    localStorage.setItem('react-crm-user', JSON.stringify(user));
  }
};
const removeTokenUser = () => {
  if (isBrowser) {
    localStorage.removeItem('react-crm-token');
    localStorage.removeItem('react-crm-user');
  }
};

export const signIn = createAsyncThunk<
  { user: User; token: string },
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/signIn',
  async (credentials: { email: string; password: string }, { rejectWithValue }: any) => {
    try {
      const response = await fetch('/api/auth', {
        method: HttpMethod.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || 'Authorization error');
      }

      setTokenUser(data.accessToken, data.user);
      return data;
    } catch (error: any) {
      return rejectWithValue('Network error, please try again');
    }
  }
);

export const signOut = createAsyncThunk<
  // string,
  void,
  void,
  { rejectValue: string }
>('auth/signOut', async (_: any, { rejectWithValue }: any) => {
  try {
    // const response = await fetch('/api/auth', { method: 'POST' });

    // if (!response.ok) {
    //   return rejectWithValue('Failed to sign out. Please try again.');
    // }

    removeTokenUser();
    // return 'Successfully signed out';
    return Promise.resolve();
  } catch (error: any) {
    return rejectWithValue('Network error, please try again.');
  }
});
