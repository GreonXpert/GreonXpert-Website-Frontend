// src/components/Home/AdvisoryBoard.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
  Upload as UploadIcon,
  Photo as PhotoIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContentBySection, updateSectionContent } from '../../store/slices/contentSlice';
import { uploadImage } from '../../store/slices/imageSlice';
import ImageWithFallback from '../common/ImageWithFallback';
import { getFullImageUrl } from '../../services/imageHelper';

const AdvisoryBoard = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  
  // Get content and image state from Redux
  const { sections, loading: contentLoading } = useSelector((state) => state.content);
  const { loading: imageLoading } = useSelector((state) => state.images);
  const advisoryContent = sections.advisoryBoard || {};
  
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Default data structure
  const defaultData = {
    title: "Meet the GreonXpert Sustainability Advisory Board",
    subtitle: "Guided by Industry Pioneers",
    description: "Our expert advisory committee guides GreonXpert's platform evolution and rigorously vets our carbon and ESG methodologies. This ensures you rely on the most advanced, high-impact tools for emissions tracking, sustainability reporting, and strategic decarbonization.",
    members: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Climate Scientist, Stanford University",
        expertise: "Carbon Metrics & Methodology Validation"
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Former EPA Director",
        expertise: "Environmental Policy & Compliance"
      },
      {
        id: 3,
        name: "Dr. Aisha Patel",
        title: "Sustainability Economics Expert",
        expertise: "Carbon Markets & ESG Impact Analysis"
      },
      {
        id: 4,
        name: "Robert Garcia",
        title: "Former CSO, Fortune 500",
        expertise: "Corporate Sustainability Implementation"
      }
    ]
  };
  
  // Current data from backend or default
  const [data, setData] = useState({
    ...defaultData,
    ...advisoryContent
  });
  
  // Temporary data for editing
  const [tempData, setTempData] = useState(data);
  const [tempMember, setTempMember] = useState({
    id: null,
    name: "",
    title: "",
    photo: "",
    expertise: ""
  });
  
  // Load content from backend on component mount
  useEffect(() => {
    dispatch(fetchContentBySection('advisoryBoard'));
  }, [dispatch]);
  
  // Update local state when backend content changes
  useEffect(() => {
  // only sync from backend when we're NOT editing
  if (!isEditing && advisoryContent && Object.keys(advisoryContent).length > 0) {
    const updatedData = { ...defaultData, ...advisoryContent };
    setData(updatedData);
    setTempData(updatedData);
  }
 }, [advisoryContent, isEditing]);
  
  // Toggle edit mode
  const handleEditToggle = async () => {
    if (isEditing) {
      // Save changes to backend
      try {
        await dispatch(updateSectionContent({
          section: 'advisoryBoard',
          content: tempData
        })).unwrap();
        
        // Update local state with saved data
        setData({...tempData});
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to save content:', error);
        // You could show an error notification here
      }
    } else {
      // Start editing
      setTempData({...data});
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
  
  // Handle member input changes
  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setTempMember(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update image preview if photo URL changed directly
    if (name === 'photo' && value) {
  // turn the relative URL into an absolute one
  setImagePreview(getFullImageUrl(value));
}
  };
  
  // Open dialog to add/edit a member
  const handleOpenDialog = (member = null) => {
   if (member) {
  setCurrentMember(member);
  setTempMember({ ...member });
  // build a fully-qualified URL for the existing photo
  const previewUrl = member.photo
    ? getFullImageUrl(member.photo)
    : '';
  setImagePreview(previewUrl);
}else {
      // Add new member
      setCurrentMember(null);
      setTempMember({
        id: Date.now(),
        name: "",
        title: "",
        photo: "",
        expertise: ""
      });
      setImagePreview('');
    }
    setSelectedFile(null);
    setUploadError(null);
    setDialogOpen(true);
  };
  
  // Save member
  const handleSaveMember = async () => {
    let updatedMember = {...tempMember};
    
    // If there's a selected file, upload it first
    if (selectedFile) {
      try {
        // Upload the image
        const resultAction = await dispatch(uploadImage({
          file: selectedFile,
          category: 'advisors',
          purpose: 'advisor_photo',
          metadata: {
            altText: `Photo of ${tempMember.name}`,
            description: `Advisory board member - ${tempMember.name}`,
            entityId: tempMember.id.toString()
          }
        })).unwrap();
        
        // Update the member's photo URL with the uploaded image URL
        // Make sure to use the complete URL returned from the server
        updatedMember.photo = resultAction.url;
        
      } catch (error) {
        console.error("Upload error:", error);
        setUploadError('Failed to upload image. Please try again.');
        return;
      }
    }
    
    // Now save the member data
    if (currentMember) {
      // Update existing member
      setTempData(prev => ({
        ...prev,
        members: prev.members.map(m => 
          m.id === currentMember.id ? updatedMember : m
        )
      }));
    } else {
      // Add new member
      setTempData(prev => ({
        ...prev,
        members: [...prev.members, updatedMember]
      }));
    }
    
    // Close the dialog
    setDialogOpen(false);
    setSelectedFile(null);
    setImagePreview('');
    setUploadError(null);
  };
  
  // Delete member
  const handleDeleteMember = (id) => {
    setTempData(prev => ({
      ...prev,
      members: prev.members.filter(m => m.id !== id)
    }));
  };
  
  // Cancel editing
  const handleCancel = () => {
    setTempData({...data});
    setIsEditing(false);
  };
  
  // Handle photo upload button click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        // Clear any existing URL in the field since we'll be uploading a new image
        setTempMember(prev => ({ ...prev, photo: '' }));
      };
      reader.readAsDataURL(file);
    }
  };
const renderedCards = useMemo(() => 
  (data.members || []).map(member => (
    <Grid item xs={12} sm={6} md={3} key={member.id}>
      {/* …conditional Box/img or ImageWithFallback… */}
    </Grid>
  ))
, [data.members]);
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
            startIcon={<EditIcon />}
            onClick={handleEditToggle}
            disabled={contentLoading || imageLoading}
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
              Edit Advisory Board Section
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Section Title"
              name="title"
              value={tempData.title || ''}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Section Subtitle"
              name="subtitle"
              value={tempData.subtitle || ''}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
            />
            
            <TextField
              fullWidth
              label="Section Description"
              name="description"
              value={tempData.description || ''}
              onChange={handleInputChange}
              variant="outlined"
              margin="normal"
              multiline
              rows={3}
            />
            
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Advisory Board Members</Typography>
              <Button 
                variant="contained" 
                startIcon={<PersonAddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Member
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {(tempData.members || []).map((member) => (
                <Grid item xs={12} sm={6} md={3} key={member.id}>
                  <Card sx={{ height: '100%' }}>
                   {member.photo ? (
  <Box
    component="img"
    src={getFullImageUrl(member.photo)}
    alt={member.name}
    sx={{
      width: '100%',
      height: 140,
      objectFit: 'cover',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2
    }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/assets/images/default-advisor.png';
    }}
  />
) : (
  <ImageWithFallback 
    src={member.photo} 
    alt={member.name} 
    name={member.name} 
    height={140}
  />
)}

                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {member.title}
                      </Typography>
                      <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                        {member.expertise}
                      </Typography>
                      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(member)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteMember(member.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
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
              variant="h5" 
              color="primary"
              fontWeight="medium"
              sx={{ mb: 2 }}
            >
              {data.subtitle}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                maxWidth: 900, 
                mx: 'auto',
                mb: 5,
                px: { xs: 2, sm: 0 },
                lineHeight: 1.7
              }}
            >
              {data.description}
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center">
            {(data.members || []).map((member) => (
              <Grid item xs={12} sm={6} md={3} key={member.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                {member.photo ? (
  <Box
    component="img"
    src={getFullImageUrl(member.photo)}
    alt={member.name}
    sx={{
      width: '100%',
      height: 140,
      objectFit: 'cover',
      borderTopLeftRadius: 2,
      borderTopRightRadius: 2
    }}
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/assets/images/default-advisor.png';
    }}
  />
) : (
  <ImageWithFallback 
    src={member.photo} 
    alt={member.name} 
    name={member.name} 
    height={140}
  />
)}

                  <CardContent>
                    <Typography 
                      variant="h6" 
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {member.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      gutterBottom
                    >
                      {member.title}
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography 
                      variant="body2" 
                      color="primary.dark"
                      fontWeight={500}
                    >
                      {member.expertise}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* Add/Edit Member Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentMember ? 'Edit' : 'Add'} Advisory Board Member
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={tempMember.name || ''}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Title/Position"
            name="title"
            value={tempMember.title || ''}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          {/* Image Upload Section */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Photo
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={handleUploadClick}
                sx={{ mr: 2 }}
              >
                Upload Photo
              </Button>
              
              <TextField
                fullWidth
                label="Photo URL"
                name="photo"
                value={tempMember.photo || ''}
                onChange={handleMemberInputChange}
                variant="outlined"
                size="small"
                helperText="Leave blank to use initials avatar"
              />
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                accept="image/*"
              />
            </Box>
            
            {/* Image Preview */}
            {imagePreview && (
              <Box sx={{ mb: 2, position: 'relative' }}>
               <img
                  src={
                    imagePreview.startsWith('data:')
                      ? imagePreview
                      : getFullImageUrl(imagePreview)
                  }
                  
                  alt="Preview"
                  style={{ 
                    width: '100%', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
                <Box sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8,
                  bgcolor: 'background.paper',
                  borderRadius: '50%'
                }}>
                  <IconButton 
                    size="small" 
                    onClick={() => {
                      setImagePreview('');
                      setSelectedFile(null);
                      setTempMember(prev => ({ ...prev, photo: '' }));
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}
            
            {!imagePreview && (
              <Box 
                sx={{ 
                  width: '100%', 
                  height: 100, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  mb: 2
                }}
              >
                <PhotoIcon color="disabled" sx={{ fontSize: 40 }} />
              </Box>
            )}
            
            {uploadError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {uploadError}
              </Alert>
            )}
          </Box>
          
          <TextField
            fullWidth
            label="Expertise Area"
            name="expertise"
            value={tempMember.expertise || ''}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveMember} 
            variant="contained" 
            color="primary"
            disabled={!tempMember.name || !tempMember.title || !tempMember.expertise || imageLoading}
          >
            {imageLoading ? 
              <CircularProgress size={24} color="inherit" /> : 
              "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvisoryBoard;