// src/store/slices/uiSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  darkMode: localStorage.getItem('darkMode') === 'true',
  mobileView: window.innerWidth < 768,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      const newMode = !state.darkMode;
      localStorage.setItem('darkMode', String(newMode));
      state.darkMode = newMode;
    },
    setMobileView: (state, action) => {
      state.mobileView = action.payload;
      if (action.payload) {
        state.sidebarOpen = false;
      }
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode, setMobileView } = uiSlice.actions;
export default uiSlice.reducer;