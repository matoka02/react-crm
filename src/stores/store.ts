import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice'
import customerReducer from './customers/customerSlice';
import orderReducer from './orders/orderSlice';
import productReducer from './products/productSlice';
import categoryReducer from './categories/categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    orders: orderReducer,
    products: productReducer,
    categories: categoryReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
