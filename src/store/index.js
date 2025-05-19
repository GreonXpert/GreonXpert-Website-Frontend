// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
 import uiReducer from './slices/uiSlice';
 import notificationReducer from './slices/notificationSlice';
import contentReducer from './slices/contentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
     ui: uiReducer,
    notifications: notificationReducer,
     content: contentReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;