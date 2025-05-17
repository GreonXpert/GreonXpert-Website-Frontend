// src/components/Home/RegulatoryReporting.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  Edit as EditIcon,
  Description as DocumentIcon,
  Assignment as ReportIcon,
  BarChart as ChartIcon,
  CheckCircle as CheckCircleIcon,
  Timeline as TimelineIcon,
  ShowChart as ShowChartIcon,
  AutoGraph as AutoGraphIcon
} from '@mui/icons-material';

const RegulatoryReporting = () => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  
  const [data, setData] = useState({
    microHeading: "GLOBAL CLIMATE COMPLIANCE",
    mainHeading: "Reporting Made Effortless",
    subHeading: "Report with confidence every time. Our tools—designed by engineers, climate scientists, and data experts— help leading companies stay ahead of climate disclosure and evolving regulations."
  });
  
  const [tempData, setTempData] = useState({...data});
  
  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setData({...tempData});
    } else {
      // Start editing
      setTempData({...data});
    }
    setIsEditing(!isEditing);
  };
  
  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Cancel editing
  const handleCancel = () => {
    setTempData({...data});
    setIsEditing(false);
  };

  return (
    <Box component="section" 
      sx={{ 
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        color: '#ffffff',
        py: { xs: 8, md: 12 },
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 45%, ${theme.palette.secondary.main} 100%)`,
      }}
    >
      {/* Abstract background shapes */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.2,
        zIndex: 0,
        background: `
          radial-gradient(circle at 10% 20%, rgba(255,255,255,0.1) 0%, transparent 20%),
          radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 20%),
          radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 50%)
        `,
      }} />
      
      {/* Decorative lines */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        opacity: 0.1,
        background: `
          linear-gradient(90deg, transparent 95%, rgba(255,255,255,0.5) 100%),
          linear-gradient(rgba(255,255,255,0.5) 0.1em, transparent 0.1em)
        `,
        backgroundSize: '100% 1.5em',
      }} />
      
      {/* Neo-futuristic circuit pattern */}
      <Box 
        sx={{
          position: 'absolute',
          bottom: -100,
          right: -100,
          width: 500,
          height: 500,
          opacity: 0.07,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M9 0h2v20H9V0zm25.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm-20 20l1.732 1-10 17.32-1.732-1 10-17.32zM58.16 4.134l1 1.732-17.32 10-1-1.732 17.32-10zm-40 40l1 1.732-17.32 10-1-1.732 17.32-10zM80 9v2H60V9h20zM20 69v2H0v-2h20zm79.32-55l-1 1.732-17.32-10L82 4l17.32 10zm-80 80l-1 1.732-17.32-10L2 84l17.32 10zm96.546-75.84l-1.732 1-10-17.32 1.732-1 10 17.32zm-100 100l-1.732 1-10-17.32 1.732-1 10 17.32zM38.16 24.134l1 1.732-17.32 10-1-1.732 17.32-10zM60 29v2H40v-2h20zm19.32 5l-1 1.732-17.32-10L62 24l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM111 40h-2V20h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zM40 49v2H20v-2h20zm19.32 5l-1 1.732-17.32-10L42 44l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM91 60h-2V40h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM39.32 74l-1 1.732-17.32-10L22 64l17.32 10zm16.546 4.16l-1.732 1-10-17.32 1.732-1 10 17.32zM71 80h-2V60h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM120 89v2h-20v-2h20zm-84.134 9.16l-1.732 1-10-17.32 1.732-1 10 17.32zM51 100h-2V80h2v20zm3.134.84l1.732 1-10 17.32-1.732-1 10-17.32zm24.026 3.294l1 1.732-17.32 10-1-1.732 17.32-10zM100 109v2H80v-2h20zm19.32 5l-1 1.732-17.32-10 1-1.732 17.32 10zM31 120h-2v-20h2v20z' fill='%23FFFFFF' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '150px 150px',
          transform: 'rotate(15deg)',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Admin Controls */}
        <Box sx={{ position: 'absolute', top: 0, right: 20, zIndex: 10 }}>
          <Button 
            variant="contained" 
            sx={{ 
              bgcolor: '#ffffff', 
              color: 'primary.main',
              borderRadius: '28px',
              fontWeight: 600,
              boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
              '&:hover': {
                bgcolor: 'grey.100',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
              }
            }}
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
          >
            {isEditing ? "Save Changes" : "Edit Section"}
          </Button>
          {isEditing && (
            <Button 
              variant="outlined" 
              sx={{ 
                ml: 1, 
                borderColor: 'rgba(255,255,255,0.7)',
                color: '#ffffff',
                borderRadius: '28px',
                '&:hover': {
                  borderColor: '#ffffff',
                  bgcolor: 'rgba(255,255,255,0.1)'
                }
              }}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
        </Box>
        
        {isEditing ? (
          // Edit Form
          <Paper 
            elevation={6} 
            sx={{ 
              p: 4, 
              mb: 4, 
              bgcolor: '#ffffff', 
              color: 'text.primary',
              borderRadius: 3,
              boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Edit Regulatory Reporting Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Micro Heading"
              name="microHeading"
              value={tempData.microHeading}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              helperText="Super-small, uppercase text"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Main Heading"
              name="mainHeading"
              value={tempData.mainHeading}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              helperText="Bold, primary heading"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Sub Heading"
              name="subHeading"
              value={tempData.subHeading}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={3}
              helperText="Regular text description"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                }
              }}
            />
          </Paper>
        ) : null}
        
        {/* Display Content */}
        <Grid container spacing={8} alignItems="center" sx={{ position: 'relative' }}>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  mb: 3,
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: -20,
                    top: '50%',
                    height: 2,
                    width: 10,
                    bgcolor: 'secondary.light',
                  }
                }}
              >
                <Typography 
                  variant="overline" 
                  component="p"
                  sx={{ 
                    fontWeight: 700,
                    letterSpacing: 2,
                    display: 'inline-block',
                    position: 'relative',
                    px: 1,
                    py: 0.5,
                    bgcolor: alpha(theme.palette.secondary.light, 0.2),
                    backdropFilter: 'blur(4px)',
                    borderRadius: 1,
                  }}
                >
                  {data.microHeading}
                </Typography>
              </Box>
              
              <Typography 
                variant="h2" 
                component="h2" 
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem' },
                  mb: 3,
                  lineHeight: 1.1,
                  textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: 80,
                    height: 4,
                    mt: 2,
                    mb: 3,
                    background: `linear-gradient(90deg, ${theme.palette.secondary.light}, transparent)`,
                    borderRadius: 1,
                  }
                }}
              >
                {data.mainHeading}
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'normal',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  mb: 5,
                  opacity: 0.9,
                  maxWidth: '95%',
                  textShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                {data.subHeading}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    bgcolor: '#ffffff',
                    color: 'primary.dark',
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 28,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      boxShadow: '0 12px 28px rgba(0,0,0,0.25)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Learn More
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.7)',
                    color: '#ffffff',
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderRadius: 28,
                    backdropFilter: 'blur(6px)',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: 'rgba(255,255,255,0.15)',
                      boxShadow: '0 8px 18px rgba(0,0,0,0.1)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  View Demo
                </Button>
              </Box>
              
              {/* Feature mini-cards */}
              <Grid container spacing={2} sx={{ mt: 6 }}>
                {[
                  { icon: <CheckCircleIcon />, text: "ISO 14064 Validated" },
                  { icon: <TimelineIcon />, text: "Real-time Dashboards" },
                  { icon: <ShowChartIcon />, text: "Multi-framework Support" }
                ].map((feature, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      p: 1,
                      borderRadius: 2,
                      backdropFilter: 'blur(4px)',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
                        bgcolor: 'rgba(255, 255, 255, 0.15)',
                      }
                    }}>
                      <Box sx={{ 
                        mr: 1.5,
                        color: theme.palette.secondary.light
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography variant="body2" fontWeight="medium">
                        {feature.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ position: 'relative' }}>
            {/* 3D-looking visualization */}
            <Box 
              sx={{ 
                position: 'relative',
                height: 500,
                display: { xs: 'none', md: 'block' },
                perspective: '1000px',
              }}
            >
              {/* Floating Document Elements */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  top: '10%',
                  left: '15%',
                  transform: 'rotate(-5deg) translateZ(40px)',
                  transformStyle: 'preserve-3d',
                  transition: 'all 0.5s ease',
                  animation: 'float 6s ease-in-out infinite',
                  '@keyframes float': {
                    '0%, 100%': {
                      transform: 'rotate(-5deg) translateZ(40px) translateY(0px)',
                    },
                    '50%': {
                      transform: 'rotate(-5deg) translateZ(40px) translateY(-15px)',
                    }
                  }
                }}
              >
                <Paper
                  elevation={8}
                  sx={{
                    width: 180,
                    height: 240,
                    borderRadius: 3,
                    p: 2,
                    bgcolor: '#ffffff',
                    color: 'text.primary',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 20px 30px rgba(0,0,0,0.2)',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
                      borderRadius: 3,
                      zIndex: 1,
                      pointerEvents: 'none',
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    mb: 1, 
                    alignItems: 'center',
                    pb: 1,
                    borderBottom: '1px solid',
                    borderColor: 'grey.200'
                  }}>
                    <DocumentIcon sx={{ color: 'primary.main', mr: 1, fontSize: 20 }} />
                    <Typography variant="caption" color="primary" fontWeight="bold">
                      GHG REPORT
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    {[...Array(4)].map((_, i) => (
                      <Box key={i} sx={{ 
                        height: 7, 
                        bgcolor: 'grey.100', 
                        borderRadius: 1,
                        mt: 1,
                        width: `${Math.max(60, Math.min(95, 75 + i * 5))}%`
                      }} />
                    ))}
                    
                    <Box sx={{ 
                      mt: 2,
                      height: 80,
                      bgcolor: alpha(theme.palette.primary.light, 0.3),
                      borderRadius: 1
                    }} />
                  </Box>
                </Paper>
              </Box>
              
              {/* Main central document */}
              <Paper
                elevation={16}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%) rotateY(5deg) rotateX(5deg)',
                  width: 260,
                  height: 340,
                  borderRadius: 4,
                  overflow: 'hidden',
                  bgcolor: '#ffffff',
                  color: 'text.primary',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                  zIndex: 10,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  }
                }}
              >
                <Box sx={{ 
                  bgcolor: theme.palette.primary.main,
                  color: '#ffffff',
                  py: 2,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    GREONXPERT REPORT
                  </Typography>
                  <CheckCircleIcon />
                </Box>
                
                <Box sx={{ p: 3, pt: 2, flex: 1 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    Regulatory Compliance Report • Q2 2025
                  </Typography>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle2" color="primary.dark" fontWeight="bold">
                    Executive Summary
                  </Typography>
                  
                  {[...Array(3)].map((_, i) => (
                    <Box key={i} sx={{ 
                      height: 8, 
                      bgcolor: 'grey.100', 
                      borderRadius: 1,
                      mt: 1.5,
                      width: `${Math.max(70, Math.min(95, 75 + i * 7))}%`
                    }} />
                  ))}
                  
                  <Typography variant="subtitle2" color="primary.dark" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                    Emissions Overview
                  </Typography>
                  
                  <Box sx={{ 
                    height: 100,
                    mt: 1,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <AutoGraphIcon 
                      sx={{ 
                        fontSize: 60, 
                        color: alpha(theme.palette.primary.main, 0.3),
                        position: 'absolute',
                      }} 
                    />
                    <Box sx={{ 
                      width: '75%',
                      height: 40,
                      bgcolor: '#ffffff',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: alpha(theme.palette.primary.main, 0.3),
                      zIndex: 2,
                    }} />
                  </Box>
                </Box>
                
                <Box sx={{ 
                  bgcolor: 'grey.50', 
                  p: 2, 
                  display: 'flex', 
                  justifyContent: 'flex-end', 
                  borderTop: '1px solid', 
                  borderColor: 'grey.200' 
                }}>
                  <Box sx={{ 
                    borderRadius: 4, 
                    bgcolor: theme.palette.secondary.main, 
                    color: '#ffffff',
                    py: 1,
                    px: 2,
                    fontWeight: 'bold',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} /> Approved
                  </Box>
                </Box>
              </Paper>
              
              {/* Third document */}
              <Box 
                sx={{ 
                  position: 'absolute',
                  bottom: '15%',
                  right: '10%',
                  transform: 'rotate(8deg) translateZ(20px)',
                  transformStyle: 'preserve-3d',
                  animation: 'float2 7s ease-in-out infinite',
                  '@keyframes float2': {
                    '0%, 100%': {
                      transform: 'rotate(8deg) translateZ(20px) translateY(0px)',
                    },
                    '50%': {
                      transform: 'rotate(8deg) translateZ(20px) translateY(-20px)',
                    }
                  }
                }}
              >
                <Paper
                  elevation={6}
                  sx={{
                    width: 160,
                    height: 180,
                    borderRadius: 3,
                    p: 2,
                    bgcolor: theme.palette.secondary.light,
                    color: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 15px 25px rgba(0,0,0,0.15)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ChartIcon sx={{ mr: 1, fontSize: 20 }} />
                    <Typography variant="body2" fontWeight="bold">
                      Emissions
                    </Typography>
                  </Box>
                  
                  <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.2)', 
                    flex: 1, 
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}>
                    <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                      -24.5%
                    </Typography>
                    <Typography variant="caption" sx={{ textAlign: 'center', opacity: 0.9 }}>
                      Year over Year
                    </Typography>
                  </Box>
                </Paper>
              </Box>
              
              {/* Animated circles */}
              {[...Array(6)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 12 + i * 10,
                    height: 12 + i * 10,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${alpha(theme.palette.secondary.light, 0.6)} 0%, ${alpha(theme.palette.secondary.light, 0)} 70%)`,
                    top: 90 + i * 30 + Math.sin(i) * 50,
                    left: 120 + i * 25 + Math.cos(i) * 40,
                    animation: `pulse${i} ${5 + i * 0.5}s infinite ease-in-out`,
                    [`@keyframes pulse${i}`]: {
                      '0%, 100%': {
                        transform: 'scale(1)',
                        opacity: 0.5 + i * 0.05,
                      },
                      '50%': {
                        transform: 'scale(1.3)',
                        opacity: 0.3 + i * 0.05,
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RegulatoryReporting;