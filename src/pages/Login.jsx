// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import { LockOutlined as LockIcon } from '@mui/icons-material';
import LoginForm from '../components/auth/LoginForm';
import OtpVerification from '../components/auth/OtpVerification';
import { clearSuccessMessage } from '../store/slices/authSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'otp'
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const { isAuthenticated, loading, successMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Handle success message for login
  useEffect(() => {
    if (successMessage === 'Successfully logged in!') {
      setSuccessDialogOpen(true);
    }
  }, [successMessage]);

  const handleDialogClose = () => {
    setSuccessDialogOpen(false);
    dispatch(clearSuccessMessage());
    navigate('/dashboard');
  };

  const handleOtpSent = (email) => {
    setEmail(email);
    setStep('otp');
  };

  const handleBack = () => {
    setStep('email');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
        backgroundImage: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(80, 176, 126, 0.05) 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockIcon sx={{ fontSize: 32, color: 'primary.contrastText' }} />
          </Box>
          <Typography variant="h4" component="h1" fontWeight="bold" textAlign="center" mb={1}>
            GreonXpert Admin
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={4} textAlign="center">
            Log in to access the admin dashboard
          </Typography>

          {step === 'email' ? (
            <LoginForm onOtpSent={handleOtpSent} />
          ) : (
            <OtpVerification email={email} onBack={handleBack} />
          )}
        </Box>
      </Container>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Login Successful</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have successfully logged in to the GreonXpert Admin Dashboard.
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button onClick={handleDialogClose} color="primary" variant="contained">
              Continue to Dashboard
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;