// src/components/Home/PrecisionInAction.jsx - Enhanced with Backend Integration
import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  VerifiedUser as VerifiedIcon,
  AutoAwesome as AutomationIcon,
  Rocket as RocketIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentBySection, updateSectionContent } from '../../store/slices/contentSlice';

const PrecisionInAction = () => {
  const dispatch = useDispatch();
  const { sections, loading } = useSelector((state) => state.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  
  // Default data structure
  const defaultData = {
    title: "Precision in Action",
    features: [
      {
        id: 1,
        icon: "verified",
        title: "Data Confidence",
        description: "Powered by ISO 14064, GHG Protocol & SBTi with end-to-end validation—every emission captured.",
        linkText: "View Standards & Validation",
        linkUrl: "/standards"
      },
      {
        id: 2,
        icon: "automation",
        title: "Compliance Automation",
        description: "Auto-generate ESG & carbon disclosures—BRSR, GRI, CSRD and more—in seconds.",
        linkText: "Explore Reporting Suite",
        linkUrl: "/reporting"
      },
      {
        id: 3,
        icon: "rocket",
        title: "Impact Acceleration",
        description: "Live KPIs, AI-driven decarbonization roadmaps and integrated carbon-credit trading.",
        linkText: "Launch Your Program",
        linkUrl: "/program"
      }
    ]
  };

  const [data, setData] = useState(defaultData);
  const [tempData, setTempData] = useState(defaultData);
  const [tempFeature, setTempFeature] = useState({
    id: null,
    icon: "",
    title: "",
    description: "",
    linkText: "",
    linkUrl: ""
  });

  // Fetch content on component mount
  useEffect(() => {
    dispatch(fetchContentBySection('precisionInAction'));
  }, [dispatch]);

  // Update local state when content is fetched
  useEffect(() => {
    if (sections.precisionInAction) {
      setData(sections.precisionInAction);
      setTempData(sections.precisionInAction);
    }
  }, [sections.precisionInAction]);

  // Toggle edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        await dispatch(updateSectionContent({
          section: 'precisionInAction',
          content: tempData
        })).unwrap();
        setData(tempData);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save precision in action content:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      // Start editing
      setTempData(data);
      setIsEditing(true);
    }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle feature input changes
  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setTempFeature(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open dialog to edit a feature
  const handleOpenFeatureDialog = (feature) => {
    setCurrentFeature(feature);
    setTempFeature({...feature});
    setOpenDialog(true);
  };

  // Save feature changes
  const handleSaveFeature = () => {
    setTempData(prev => ({
      ...prev,
      features: prev.features.map(f => 
        f.id === tempFeature.id ? tempFeature : f
      )
    }));
    setOpenDialog(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setTempData(data);
    setIsEditing(false);
  };

  // Render icon based on icon name
  const renderIcon = (iconName, size = 'medium') => {
    switch(iconName) {
      case 'verified':
        return <VerifiedIcon fontSize={size} />;
      case 'automation':
        return <AutomationIcon fontSize={size} />;
      case 'rocket':
        return <RocketIcon fontSize={size} />;
      default:
        return <VerifiedIcon fontSize={size} />;
    }
  };

  if (loading && !data.title) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ 
      py: 10, 
      bgcolor: 'background.paper',
      position: 'relative',
      width: '100%'
    }}>
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
            {isSaving ? "Saving..." : isEditing ? "Save Changes" : "Edit Section"}
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
              Edit Precision in Action Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Section Title"
              name="title"
              value={tempData.title}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Features
            </Typography>
            
            <Grid container spacing={3}>
              {tempData.features.map((feature) => (
                <Grid item xs={12} md={4} key={feature.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ mr: 2 }}>
                          {renderIcon(feature.icon)}
                        </Box>
                        <Typography variant="h6">
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {feature.description}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {feature.linkText}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        size="small" 
                        sx={{ mt: 2 }}
                        onClick={() => handleOpenFeatureDialog(feature)}
                      >
                        Edit Feature
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : null}
        
        {/* Display Content */}
        <Box>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              fontWeight="bold"
              sx={{
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                mb: 6
              }}
            >
              {data.title}
            </Typography>
          </Box>
          
          <Grid container spacing={5}>
            {data.features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.id}>
                <Box 
                  sx={{ 
                    p: { xs: 2, md: 3 },
                    height: '100%',
                    borderRadius: 2,
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box 
                      sx={{ 
                        color: 'primary.main',
                        mr: 1.5,
                      }}
                    >
                      {renderIcon(feature.icon, 'large')}
                    </Box>
                    <Typography 
                      variant="h5" 
                      component="h3" 
                      fontWeight="bold"
                    >
                      {feature.title}
                    </Typography>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 2,
                      lineHeight: 1.7
                    }}
                  >
                    {feature.description}
                  </Typography>
                  <Link 
                    href={feature.linkUrl}
                    color="primary"
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 600,
                      mt: 2,
                      '&:hover': {
                        textDecoration: 'none',
                      }
                    }}
                  >
                    {feature.linkText}
                    <ArrowForwardIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                  </Link>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Edit Feature Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Edit Feature</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            select
            label="Icon"
            name="icon"
            value={tempFeature.icon}
            onChange={handleFeatureChange}
            variant="outlined"
            margin="normal"
            SelectProps={{
              native: true
            }}
          >
            <option value="verified">Verified</option>
            <option value="automation">Automation</option>
            <option value="rocket">Rocket</option>
          </TextField>
          
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={tempFeature.title}
            onChange={handleFeatureChange}
            variant="outlined"
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={tempFeature.description}
            onChange={handleFeatureChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
          />
          
          <TextField
            fullWidth
            label="Link Text"
            name="linkText"
            value={tempFeature.linkText}
            onChange={handleFeatureChange}
            variant="outlined"
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Link URL"
            name="linkUrl"
            value={tempFeature.linkUrl}
            onChange={handleFeatureChange}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveFeature} 
            variant="contained" 
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PrecisionInAction;