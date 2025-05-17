// src/components/layout/Layout.jsx
import React, { useEffect } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { setMobileView } from '../../store/slices/uiSlice';

const Layout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Update mobile view state when screen size changes
  useEffect(() => {
    dispatch(setMobileView(isMobile));
  }, [isMobile, dispatch]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Header />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          pt: '64px', // Height of the AppBar
          pb: '56px', // Height of the footer (adjust based on your footer height)
          bgcolor: 'background.default',
          transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          marginLeft: {
            xs: 0,
            md: sidebarOpen ? '280px' : '64px',
          },
        }}
      >
        <Box 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            overflow: 'auto',
          }}
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;