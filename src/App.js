// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Routes from './Routes';
import theme from './theme';
import { hideSnackbar } from './store/slices/notificationSlice';

function App() {
  const { snackbar } = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  const handleCloseSnackbar = () => {
    dispatch(hideSnackbar());
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
      
      {/* Global Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
           </Snackbar>
    </ThemeProvider>
  );
}

export default App;