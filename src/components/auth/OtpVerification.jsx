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
  Card,
  LinearProgress,
} from '@mui/material';
import {
  LockOutlined as LockIcon,
  ArrowBack as ArrowBackIcon,
  AccessTime as AccessTimeIcon,
  Email as EmailIcon,
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

  const timePercentage = (timeLeft / 600) * 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return;

    dispatch(verifyOTP({ email, otp }));
  };

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 450,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
        }}
      >
        <Card 
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
          }}
        >
          {/* Curved background with teal gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: '30%',
              bottom: 0,
              background: (theme) => theme.palette.background.login,
              borderRadius: '0 100% 100% 0 / 0 50% 50% 0',
              zIndex: 0,
            }}
          />

          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h3" component="h1" fontWeight="bold" color="text.primary" mb={1}>
              Verification
            </Typography>
            <Typography variant="subtitle2" color="text.primary" opacity={0.9} mb={4}>
              Enter the OTP sent to your email
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                mt: 2,
                width: '100%',
                backgroundColor: 'white',
                borderRadius: 3,
                p: 3,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Typography variant="h5" component="h2" mb={1} textAlign="center" fontWeight="600">
                OTP Verification
              </Typography>

              <Stack 
                direction="row" 
                alignItems="center" 
                spacing={1}
                sx={{
                  py: 1.5,
                  px: 2,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: 'rgba(26, 201, 159, 0.1)',
                }}
              >
                <EmailIcon color="primary" fontSize="small" />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.primary',
                    fontWeight: 500,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {email}
                </Typography>
              </Stack>

              {timeLeft > 0 ? (
                <>
                  <Box
                    sx={{
                      mb: 3,
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Typography variant="caption" color="text.secondary">
                        <AccessTimeIcon fontSize="inherit" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                        Time Remaining
                      </Typography>
                      <Typography variant="caption" fontWeight="bold" color="primary">
                        {formatTime(timeLeft)}
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={timePercentage} 
                      sx={{ 
                        height: 6, 
                        borderRadius: 3,
                        backgroundColor: 'rgba(26, 201, 159, 0.2)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main',
                        }
                      }} 
                    />
                  </Box>

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
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
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
                      sx={{ flex: 1, fontWeight: 'bold' }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
                    </Button>
                  </Stack>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="body1" color="error.main" gutterBottom fontWeight="medium">
                    The OTP has expired
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={3}>
                    Please request a new OTP to continue
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onBack}
                    startIcon={<ArrowBackIcon />}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Request New OTP
                  </Button>
                </Box>
              )}
            </Box>

            <Typography variant="body2" sx={{ mt: 3, color: 'text.primary', opacity: 0.9 }}>
              Didn't receive OTP? <span style={{ fontWeight: 'bold', cursor: 'pointer' }}>Resend</span>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default OtpVerification;