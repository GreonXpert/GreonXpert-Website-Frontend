// src/components/Home/TrustedLeaders.jsx - Enhanced with Backend Integration
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
  CardMedia,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentBySection, updateSectionContent } from '../../store/slices/contentSlice';

const TrustedLeaders = () => {
  const dispatch = useDispatch();
  const { sections, loading } = useSelector((state) => state.content);
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'partner' or 'recognition'

  // Default data structure
  const defaultTrustedData = {
    partnerTitle: "Our Partnership Consultants",
    partnerDescription: "We collaborate with industry-leading experts to deliver exceptional results for our clients.",
    partners: [
      {
        id: 1,
        name: "TechVision Consulting",
        logo: "/assets/images/partner1.png",
        description: "Strategic technology advisors helping businesses navigate digital transformation."
      }
    ],
    recognitionTitle: "Powered by Science",
    recognitionDescription: "Our excellence and commitment to quality have been recognized by leading industry organizations.",
    recognitions: [
      {
        id: 1,
        name: "Tech Excellence Awards",
        logo: "/assets/images/award1.png"
      }
    ]
  };

  // Main data state
  const [trustedData, setTrustedData] = useState(defaultTrustedData);
  const [tempData, setTempData] = useState(defaultTrustedData);
  const [tempItem, setTempItem] = useState({
    id: null,
    name: "",
    logo: "",
    description: ""
  });

  // Fetch content on component mount
  useEffect(() => {
    dispatch(fetchContentBySection('trustedLeaders'));
  }, [dispatch]);

  // Update local state when content is fetched
  useEffect(() => {
    if (sections.trustedLeaders) {
      setTrustedData(sections.trustedLeaders);
      setTempData(sections.trustedLeaders);
    }
  }, [sections.trustedLeaders]);

  // Toggle edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      setIsSaving(true);
      try {
        await dispatch(updateSectionContent({
          section: 'trustedLeaders',
          content: tempData
        })).unwrap();
        setTrustedData(tempData);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save trusted leaders content:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setTempData(trustedData);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setTempData(trustedData);
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setTempItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    if (item) {
      setCurrentEditItem(item);
      setTempItem({...item});
    } else {
      setCurrentEditItem(null);
      setTempItem({
        id: Date.now(),
        name: "",
        logo: "",
        description: type === 'partner' ? "" : undefined
      });
    }
    setDialogOpen(true);
  };

  const handleSaveItem = () => {
    const isPartner = dialogType === 'partner';
    const itemsArray = isPartner ? 'partners' : 'recognitions';
    
    if (currentEditItem) {
      setTempData(prev => ({
        ...prev,
        [itemsArray]: prev[itemsArray].map(item => 
          item.id === currentEditItem.id ? tempItem : item
        )
      }));
    } else {
      setTempData(prev => ({
        ...prev,
        [itemsArray]: [...prev[itemsArray], tempItem]
      }));
    }
    setDialogOpen(false);
  };

  const handleDeleteItem = (type, id) => {
    const itemsArray = type === 'partner' ? 'partners' : 'recognitions';
    setTempData(prev => ({
      ...prev,
      [itemsArray]: prev[itemsArray].filter(item => item.id !== id)
    }));
  };

  if (loading && !trustedData.partnerTitle) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="section" sx={{ 
      py: 8, 
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

        {isEditing && (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Edit Trusted Leaders Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
              <Tab label="Partnership Consultants" />
              <Tab label="Recognitions" />
            </Tabs>
            
            {tabValue === 0 ? (
              <Box>
                <TextField
                  fullWidth
                  label="Section Title"
                  name="partnerTitle"
                  value={tempData.partnerTitle}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Section Description"
                  name="partnerDescription"
                  value={tempData.partnerDescription}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={2}
                />
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('partner')}
                  >
                    Add Partner
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  label="Section Title"
                  name="recognitionTitle"
                  value={tempData.recognitionTitle}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Section Description"
                  name="recognitionDescription"
                  value={tempData.recognitionDescription}
                  onChange={handleInputChange}
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={2}
                />
                <Box sx={{ mt: 3, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog('recognition')}
                  >
                    Add Recognition
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        )}

        {/* Display Content */}
        <Box sx={{ pt: 2 }}>
          <Box sx={{ mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  mb: 2
                }}
              >
                {trustedData.partnerTitle}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto',
                  mb: 4,
                  px: { xs: 2, sm: 0 }
                }}
              >
                {trustedData.partnerDescription}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 8, pb: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom
                fontWeight="bold"
                sx={{
                  fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' },
                  mb: 2
                }}
              >
                {trustedData.recognitionTitle}
              </Typography>
              <Typography 
                variant="subtitle1" 
                color="text.secondary"
                sx={{ 
                  maxWidth: 700, 
                  mx: 'auto',
                  mb: 4,
                  px: { xs: 2, sm: 0 }
                }}
              >
                {trustedData.recognitionDescription}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Dialog for adding/editing items */}
        <Dialog 
          open={dialogOpen} 
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {currentEditItem ? 'Edit' : 'Add'} {dialogType === 'partner' ? 'Partnership Consultant' : 'Recognition'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={tempItem.name}
              onChange={handleItemInputChange}
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Logo URL"
              name="logo"
              value={tempItem.logo}
              onChange={handleItemInputChange}
              variant="outlined"
              margin="normal"
              helperText="Enter the URL path to the logo image"
            />
            {dialogType === 'partner' && (
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={tempItem.description}
                onChange={handleItemInputChange}
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSaveItem} 
              variant="contained" 
              color="primary"
              disabled={!tempItem.name}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default TrustedLeaders;