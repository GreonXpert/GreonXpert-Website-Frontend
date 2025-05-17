// src/components/Home/TrustedLeaders.jsx
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
  CardMedia,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const TrustedLeaders = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(''); // 'partner' or 'recognition'

  // Main data state
  const [trustedData, setTrustedData] = useState({
    partnerTitle: "Our Partnership Consultants",
    partnerDescription: "We collaborate with industry-leading experts to deliver exceptional results for our clients.",
    partners: [
      {
        id: 1,
        name: "TechVision Consulting",
        logo: "/assets/images/partner1.png",
        description: "Strategic technology advisors helping businesses navigate digital transformation."
      },
      {
        id: 2,
        name: "InnovateX Solutions",
        logo: "/assets/images/partner2.png",
        description: "Specialized in innovative software development methodologies and enterprise architecture."
      },
      {
        id: 3,
        name: "DataSphere Analytics",
        logo: "/assets/images/partner3.png",
        description: "Leading data analytics and business intelligence consulting firm."
      }
    ],
    recognitionTitle: "Powered by Science",

    recognitionDescription: "Our excellence and commitment to quality have been recognized by leading industry organizations.",
    recognitions: [
      {
        id: 1,
        name: "Tech Excellence Awards",
        logo: "/assets/images/award1.png"
      },
      {
        id: 2,
        name: "Digital Innovation Forum",
        logo: "/assets/images/award2.png"
      },
      {
        id: 3,
        name: "Global Software Leaders",
        logo: "/assets/images/award3.png"
      },
      {
        id: 4,
        name: "Enterprise Technology Council",
        logo: "/assets/images/award4.png"
      }
    ]
  });

  // Temporary data for editing
  const [tempData, setTempData] = useState({...trustedData});
  const [tempItem, setTempItem] = useState({
    id: null,
    name: "",
    logo: "",
    description: ""
  });

  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      setTrustedData({...tempData});
    } else {
      // Start editing
      setTempData({...trustedData});
    }
    setIsEditing(!isEditing);
  };

  // Cancel editing
  const handleCancel = () => {
    setTempData({...trustedData});
    setIsEditing(false);
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle partner/recognition item input changes
  const handleItemInputChange = (e) => {
    const { name, value } = e.target;
    setTempItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Open dialog to add/edit an item
  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    if (item) {
      // Edit existing item
      setCurrentEditItem(item);
      setTempItem({...item});
    } else {
      // Add new item
      setCurrentEditItem(null);
      setTempItem({
        id: Date.now(), // generate a temporary ID
        name: "",
        logo: "",
        description: type === 'partner' ? "" : undefined
      });
    }
    setDialogOpen(true);
  };

  // Save partner/recognition item
  const handleSaveItem = () => {
    const isPartner = dialogType === 'partner';
    const itemsArray = isPartner ? 'partners' : 'recognitions';
    
    if (currentEditItem) {
      // Update existing item
      setTempData(prev => ({
        ...prev,
        [itemsArray]: prev[itemsArray].map(item => 
          item.id === currentEditItem.id ? tempItem : item
        )
      }));
    } else {
      // Add new item
      setTempData(prev => ({
        ...prev,
        [itemsArray]: [...prev[itemsArray], tempItem]
      }));
    }
    
    setDialogOpen(false);
  };

  // Delete partner/recognition item
  const handleDeleteItem = (type, id) => {
    const itemsArray = type === 'partner' ? 'partners' : 'recognitions';
    
    setTempData(prev => ({
      ...prev,
      [itemsArray]: prev[itemsArray].filter(item => item.id !== id)
    }));
  };

  // Render partner cards
  const renderPartners = (partners, isEditMode) => {
    return partners.map(partner => (
      <Grid item xs={12} sm={6} md={4} key={partner.id}>
        <Card sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }
        }}>
          {partner.logo ? (
            <CardMedia
              component="img"
              height="160"
              image={partner.logo}
              alt={partner.name}
              sx={{ 
                objectFit: 'contain', 
                p: 3, 
                bgcolor: 'grey.50' 
              }}
            />
          ) : (
            <Box sx={{ 
              height: 160, 
              bgcolor: 'grey.100', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
            </Box>
          )}
          
          <CardContent sx={{ 
            flexGrow: 1, 
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <Typography 
              variant="h6" 
              component="h3" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              {partner.name}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {partner.description}
            </Typography>
          </CardContent>
          
          {isEditMode && (
            <Box sx={{ 
              p: 1, 
              display: 'flex', 
              justifyContent: 'flex-end', 
              bgcolor: 'grey.100' 
            }}>
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleOpenDialog('partner', partner)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleDeleteItem('partner', partner.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Card>
      </Grid>
    ));
  };

  // Render recognition logos
  const renderRecognitions = (recognitions, isEditMode) => {
    return recognitions.map(recognition => (
      <Grid item xs={6} sm={3} key={recognition.id}>
        <Card sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
          }
        }}>
          {recognition.logo ? (
            <CardMedia
              component="img"
              height="100"
              image={recognition.logo}
              alt={recognition.name}
              sx={{ 
                objectFit: 'contain', 
                p: 3, 
                bgcolor: 'grey.50' 
              }}
            />
          ) : (
            <Box sx={{ 
              height: 100, 
              bgcolor: 'grey.100', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <ImageIcon sx={{ fontSize: 40, color: 'grey.400' }} />
            </Box>
          )}
          
          <CardContent sx={{ 
            pt: 1, 
            pb: '16px !important',
            textAlign: 'center'
          }}>
            <Typography 
              variant="body2" 
              align="center"
              sx={{ 
                fontWeight: 500,
                lineHeight: 1.4
              }}
            >
              {recognition.name}
            </Typography>
          </CardContent>
          
          {isEditMode && (
            <Box sx={{ 
              p: 1, 
              display: 'flex', 
              justifyContent: 'flex-end', 
              bgcolor: 'grey.100' 
            }}>
              <IconButton 
                size="small" 
                color="primary"
                onClick={() => handleOpenDialog('recognition', recognition)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                color="error"
                onClick={() => handleDeleteItem('recognition', recognition.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Card>
      </Grid>
    ));
  };

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
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
          >
            {isEditing ? "Save Changes" : "Edit Section"}
          </Button>
          {isEditing && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleCancel}
              sx={{ ml: 1 }}
            >
              Cancel
            </Button>
          )}
        </Box>

        {isEditing ? (
          // Edit Form
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Edit Trusted Leaders Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Partnership Consultants" />
              <Tab label="Recognitions" />
            </Tabs>
            
            {tabValue === 0 ? (
              // Partnership Consultants Tab
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
                
                <Grid container spacing={3}>
                  {renderPartners(tempData.partners, true)}
                </Grid>
              </Box>
            ) : (
              // Recognitions Tab
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
                
                <Grid container spacing={3}>
                  {renderRecognitions(tempData.recognitions, true)}
                </Grid>
              </Box>
            )}
          </Paper>
        ) : null}

        {/* Display Content Section */}
        <Box sx={{ pt: 2 }}>
          {/* Partnership Consultants Section */}
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
            
            <Grid container spacing={4} justifyContent="center">
              {renderPartners(trustedData.partners, false)}
            </Grid>
          </Box>

          {/* Recognitions Section */}
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
            
            <Grid container spacing={3} justifyContent="center" sx={{ px: { xs: 2, sm: 4, md: 6 } }}>
              {renderRecognitions(trustedData.recognitions, false)}
            </Grid>
          </Box>
        </Box>
      </Container>

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
    </Box>
  );
};

export default TrustedLeaders;