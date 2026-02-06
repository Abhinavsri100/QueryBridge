import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice.js';
import dbReducer from '../slices/dbSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    db: dbReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
