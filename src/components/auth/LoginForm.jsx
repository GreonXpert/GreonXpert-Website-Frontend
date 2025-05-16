// src/components/auth/LoginForm.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Email as EmailIcon } from '@mui/icons-material';
import { requestOTP } from '../../store/slices/authSlice';

const LoginForm = ({ onOtpSent }) => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    const resultAction = await dispatch(requestOTP(email));
    if (!requestOTP.rejected.match(resultAction)) {
      onOtpSent(email);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        maxWidth: 400,
        width: '100%',
        mx: 'auto',
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom textAlign="center" fontWeight="bold">
        Admin Login
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={3}>
        Enter your admin email to receive a one-time password
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Admin Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          disabled={loading}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={loading || !email}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Request OTP'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;