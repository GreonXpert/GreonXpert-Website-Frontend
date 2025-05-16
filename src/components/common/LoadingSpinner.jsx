// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      p={3}
    >
      <CircularProgress size={40} color="primary" />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {text}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;