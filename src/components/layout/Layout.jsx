// src/components/layout/Layout.jsx
import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { sidebarOpen } = useSelector((state) => state.ui);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'margin 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
          marginLeft: {
            xs: 0,
            md: sidebarOpen ? '240px' : '64px',
          },
        }}
      >
        <Header />
        <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
          {children}
        </Box>
        <Footer />
      </Box>
    </Box>
  );
};

export default Layout;