// src/components/layout/Footer.jsx
import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      component="footer"
      sx={{
        py: 1.8,
        px: 3,
        bgcolor: 'background.paper', // You mentioned red color in your previous message
        borderTop: '1px solid',
        borderColor: 'divider',
        textAlign: 'center',
        width: { md: `calc(100% - ${isMobile ? 0 : (sidebarOpen ? '280px' : '64px')})` },
        ml: { md: isMobile ? 0 : (sidebarOpen ? '280px' : '64px') },
        position: 'fixed',
        bottom: 0,
        zIndex: (theme) => theme.zIndex.drawer - 1,
        transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1), margin 225ms cubic-bezier(0.4, 0, 0.6, 1)'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {currentYear} GreonXpert. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;