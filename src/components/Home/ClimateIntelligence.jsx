// src/components/Home/ClimateIntelligence.jsx - Enhanced with Backend Integration
import React, { useState, useEffect, useRef } from 'react';
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
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  MonitorHeart as MonitorIcon,
  ManageAccounts as ManageIcon,
  TrendingUp as DriveIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentBySection, updateSectionContent } from '../../store/slices/contentSlice';
import { uploadImage } from '../../store/slices/imageSlice';
import { getFullImageUrl } from '../../services/imageHelper';

const ClimateIntelligence = () => {
  const dispatch = useDispatch();
  const { sections, loading } = useSelector((state) => state.content);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(null);
  
  // Default data structure
  const defaultData = {
    title: "Climate Intelligence",
    subtitle: "Your all-in-one toolkit for real-time insights, seamless compliance, and strategic decarbonization.",
    features: [
      {
        id: 1,
        icon: "monitor",
        title: "Monitor",
        description: "Real-time visibility of every emission source with Zero Carbon."
      },
      {
        id: 2,
        icon: "manage",
        title: "Manage",
        description: "Streamline sustainability reporting and regulatory workflows without manual effort."
      },
      {
        id: 3,
        icon: "drive",
        title: "Drive",
        description: "Activate AI-powered decarbonization plans to meet your sustainability goals."
      }
    ]
  };

  const [data, setData] = useState(defaultData);
  const [tempData, setTempData] = useState(defaultData);
  const [tempFeature, setTempFeature] = useState({
    id: null,
    icon: "",
    title: "",
    description: ""
  });

  const fileInputRef = useRef(null);
  const [selectedIconFile, setSelectedIconFile] = useState(null);
  const [iconPreview, setIconPreview] = useState('');


  // Fetch content on component mount
  useEffect(() => {
    dispatch(fetchContentBySection('climateIntelligence'));
  }, [dispatch]);

  // Update local state when content is fetched
  useEffect(() => {
    if (sections.climateIntelligence) {
      setData(sections.climateIntelligence);
      setTempData(sections.climateIntelligence);
    }
  }, [sections.climateIntelligence]);

  // Toggle edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes
      setIsSaving(true);
      try {
        await dispatch(updateSectionContent({
          section: 'climateIntelligence',
          content: tempData
        })).unwrap();
        setData(tempData);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save climate intelligence content:', error);
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
    setIconPreview(feature.iconUrl ? getFullImageUrl(feature.iconUrl) : '');
 setSelectedIconFile(null);
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
      case 'monitor':
        return <MonitorIcon fontSize={size} />;
      case 'manage':
        return <ManageIcon fontSize={size} />;
      case 'drive':
        return <DriveIcon fontSize={size} />;
      default:
        return <MonitorIcon fontSize={size} />;
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
      bgcolor: 'background.default',
      backgroundImage: 'linear-gradient(135deg, rgba(74, 144, 226, 0.05) 0%, rgba(80, 176, 126, 0.05) 100%)',
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
              Edit Climate Intelligence Section
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
            
            <TextField
              fullWidth
              label="Section Subtitle"
              name="subtitle"
              value={tempData.subtitle}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={2}
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
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
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
                mb: 2
              }}
            >
              {data.title}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ 
                maxWidth: 800, 
                mx: 'auto',
                mb: 6,
                px: { xs: 2, sm: 0 },
                fontWeight: 'normal',
                lineHeight: 1.6
              }}
            >
              {data.subtitle}
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {data.features.map((feature) => (
              <Grid item xs={12} md={4} key={feature.id}>
                <Box 
                  sx={{ 
                    textAlign: 'center',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: { xs: 2, md: 3 }
                  }}
                >
                  <Box 
                    sx={{ 
                      bgcolor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 80,
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 4px 20px rgba(74, 144, 226, 0.3)'
                    }}
                  >
                    {renderIcon(feature.icon, 'large')}
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    fontWeight="bold"
                    color="primary"
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {feature.description}
                  </Typography>
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
            <option value="monitor">Monitor</option>
            <option value="manage">Manage</option>
            <option value="drive">Drive</option>
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

export default ClimateIntelligence;