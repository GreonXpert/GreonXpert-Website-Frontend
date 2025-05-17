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
  Card,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import { 
  Email as EmailIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
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
              Welcome
            </Typography>
            <Typography variant="subtitle2" color="text.primary" opacity={0.9} mb={4}>
              Enter your admin email to continue
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
              <Typography variant="h5" component="h2" mb={3} textAlign="center" fontWeight="600">
                Admin Login
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                placeholder="Enter your email"
                label="Email Address"
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
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{ 
                  mt: 2, 
                  mb: 3, 
                  py: 1.5,
                  fontWeight: 'bold',
                }}
                disabled={loading || !email}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Request OTP'}
              </Button>

             
             
            </Box>

            
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default LoginForm;