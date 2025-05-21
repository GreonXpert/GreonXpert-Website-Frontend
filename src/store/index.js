// src/store/index.js (Updated with emissions reducer)
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';
import notificationReducer from './slices/notificationSlice';
import contentReducer from './slices/contentSlice';
import imageReducer from './slices/imageSlice';
import emissionReducer from './slices/emissionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    content: contentReducer,
    images: imageReducer,
    emissions: emissionReducer, // Add the new emissions reducer
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;