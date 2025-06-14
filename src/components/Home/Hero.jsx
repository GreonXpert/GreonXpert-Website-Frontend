// src/components/Home/Hero.jsx - Enhanced with Backend Integration
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  Divider,
  CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentBySection, updateSectionContent } from '../../store/slices/contentSlice';

const Hero = () => {
  const dispatch = useDispatch();
  const { sections, loading } = useSelector((state) => state.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initial data structure
  const defaultHeroData = {
    microHeading: "INNOVATIVE SOLUTIONS",
    mainHeading: "Transforming Business Through Digital Excellence",
    tagLine: "Custom Software Development and Technology Consulting",
    subHeading: "Partner with us to drive innovation, optimize operations, and achieve sustainable growth with our expertise in custom software solutions."
  };

  const [heroData, setHeroData] = useState(defaultHeroData);
  const [tempData, setTempData] = useState(defaultHeroData);

  // Fetch content on component mount
  useEffect(() => {
    dispatch(fetchContentBySection('hero'));
  }, [dispatch]);

  // Update local state when content is fetched
  useEffect(() => {
    if (sections.hero) {
      setHeroData(sections.hero);
      setTempData(sections.hero);
    }
  }, [sections.hero]);

  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        await dispatch(updateSectionContent({
          section: 'hero',
          content: tempData
        })).unwrap();
        setHeroData(tempData);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save hero content:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Start editing
      setTempData(heroData);
      setIsEditing(true);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancel = () => {
    setTempData(heroData);
    setIsEditing(false);
  };

  if (loading && !heroData.mainHeading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e7eb 100%)',
        position: 'relative',
        width: '100%'
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* Admin Controls */}
        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
          <Button 
            variant="contained" 
            color={isEditing ? "success" : "primary"}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
            onClick={handleEditToggle}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Hero"}
          </Button>
          {isEditing && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleCancel}
              sx={{ ml: 1 }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          )}
        </Box>

        {isEditing ? (
          // Edit Form
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Edit Hero Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Micro Heading"
                  name="microHeading"
                  value={tempData.microHeading}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  helperText="Small text displayed above the main heading"
                />
                
                <TextField
                  fullWidth
                  label="Main Heading"
                  name="mainHeading"
                  value={tempData.mainHeading}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  helperText="Primary heading of the hero section"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tag Line"
                  name="tagLine"
                  value={tempData.tagLine}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  helperText="Short catchy phrase under the main heading"
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
                  helperText="Detailed description text"
                />
              </Grid>
            </Grid>
          </Paper>
        ) : null}

        {/* Hero Content Display */}
        <Box 
          sx={{ 
            textAlign: 'center',
            maxWidth: 900,
            mx: 'auto',
            py: { xs: 6, md: 8 },
            px: { xs: 2, sm: 4 }
          }}
        >
          <Typography 
            variant="overline" 
            component="p" 
            color="primary" 
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: 1.2,
              mb: 1
            }}
          >
            {heroData.microHeading}
          </Typography>
          
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.75rem', md: '3.5rem' },
              lineHeight: 1.2
            }}
          >
            {heroData.mainHeading}
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              lineHeight: 1.4
            }}
          >
            {heroData.tagLine}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ 
              mb: 4, 
              maxWidth: 800, 
              mx: 'auto',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6
            }}
          >
            {heroData.subHeading}
          </Typography>
          
          <Box sx={{ 
            mt: 4,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 3 },
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              sx={{ 
                px: { xs: 3, sm: 4 }, 
                py: 1.5,
                minWidth: { xs: '200px', sm: '180px' },
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(74, 144, 226, 0.3)'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ 
                px: { xs: 3, sm: 4 }, 
                py: 1.5,
                minWidth: { xs: '200px', sm: '180px' },
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;