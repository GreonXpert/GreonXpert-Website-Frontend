// src/components/auth/OtpVerification.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  CircularProgress,
  Paper,
  Stack,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { verifyOTP } from '../../store/slices/authSlice';

const OtpVerification = ({ email, onBack }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;

    dispatch(verifyOTP({ email, otp }));
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
        Verify OTP
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" mb={1}>
        Enter the one-time password sent to
      </Typography>
      <Typography variant="subtitle1" align="center" fontWeight="medium" mb={3}>
        {email}
      </Typography>

      {timeLeft > 0 ? (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              py: 1,
              borderRadius: 1,
              mb: 3,
            }}
          >
            <AccessTimeIcon sx={{ mr: 1 }} />
            <Typography variant="body2">Time remaining: {formatTime(timeLeft)}</Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="One-Time Password"
              name="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              error={!!error}
              helperText={error}
              disabled={loading}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
                inputMode: 'numeric',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button
                type="button"
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={onBack}
                disabled={loading}
                sx={{ flex: 1 }}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading || otp.length < 6}
                sx={{ flex: 1 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
              </Button>
            </Stack>
          </Box>
        </>
      ) : (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" color="error" gutterBottom>
            The OTP has expired.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onBack}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 2 }}
          >
            Request New OTP
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default OtpVerification;