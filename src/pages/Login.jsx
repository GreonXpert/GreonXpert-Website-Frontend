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
import LoginForm from '../components/auth/LoginForm';
import OtpVerification from '../components/auth/OtpVerification';
import { clearSuccessMessage } from '../store/slices/authSlice';
import loginBackground from '../assests/images/LoginBackground.jpg'; // Adjust the path as necessary

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
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image with overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${loginBackground})`, // Fixed syntax here
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 0,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: (theme) => `linear-gradient(80deg, ${theme.palette.primary.light}CC 0%, ${theme.palette.secondary.dark}BB 20%)`,
            zIndex: 1,
          },
        }}
      />

      <Container 
        maxWidth="sm" 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {step === 'email' ? (
          <LoginForm onOtpSent={handleOtpSent} />
        ) : (
          <OtpVerification email={email} onBack={handleBack} />
        )}
      </Container>

      {/* Success Dialog */}
      <Dialog open={successDialogOpen} onClose={handleDialogClose}>
        <DialogTitle 
          sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            pb: 1
          }}
        >
          Login Successful
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ pt: 2 }}>
            You have successfully logged in to the GreonXpert Admin Dashboard.
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
              onClick={handleDialogClose} 
              color="primary" 
              variant="contained"
              sx={{ borderRadius: 30, px: 3 }}
            >
              Continue to Dashboard
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;