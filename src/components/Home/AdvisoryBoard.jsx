// src/components/Home/AdvisoryBoard.jsx
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
  Avatar
} from '@mui/material';
import {
  Edit as EditIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const AdvisoryBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  
  const [data, setData] = useState({
    title: "Meet the GreonXpert Sustainability Advisory Board",
    subtitle: "Guided by Industry Pioneers",
    description: "Our expert advisory committee guides GreonXpert's platform evolution and rigorously vets our carbon and ESG methodologies. This ensures you rely on the most advanced, high-impact tools for emissions tracking, sustainability reporting, and strategic decarbonization.",
    members: [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        title: "Climate Scientist, Stanford University",
        photo: "/assets/images/advisors/advisor1.jpg",
        expertise: "Carbon Metrics & Methodology Validation"
      },
      {
        id: 2,
        name: "Michael Chen",
        title: "Former EPA Director",
        photo: "/assets/images/advisors/advisor2.jpg",
        expertise: "Environmental Policy & Compliance"
      },
      {
        id: 3,
        name: "Dr. Aisha Patel",
        title: "Sustainability Economics Expert",
        photo: "/assets/images/advisors/advisor3.jpg",
        expertise: "Carbon Markets & ESG Impact Analysis"
      },
      {
        id: 4,
        name: "Robert Garcia",
        title: "Former CSO, Fortune 500",
        photo: "/assets/images/advisors/advisor4.jpg",
        expertise: "Corporate Sustainability Implementation"
      }
    ]
  });
  
  const [tempData, setTempData] = useState({...data});
  const [tempMember, setTempMember] = useState({
    id: null,
    name: "",
    title: "",
    photo: "",
    expertise: ""
  });
  
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
  
  // Handle member input changes
  const handleMemberInputChange = (e) => {
    const { name, value } = e.target;
    setTempMember(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open dialog to add/edit a member
  const handleOpenDialog = (member = null) => {
    if (member) {
      // Edit existing member
      setCurrentMember(member);
      setTempMember({...member});
    } else {
      // Add new member
      setCurrentMember(null);
      setTempMember({
        id: Date.now(),
        name: "",
        title: "",
        photo: "",
        expertise: ""
      });
    }
    setDialogOpen(true);
  };
  
  // Save member
  const handleSaveMember = () => {
    if (currentMember) {
      // Update existing member
      setTempData(prev => ({
        ...prev,
        members: prev.members.map(m => 
          m.id === currentMember.id ? tempMember : m
        )
      }));
    } else {
      // Add new member
      setTempData(prev => ({
        ...prev,
        members: [...prev.members, tempMember]
      }));
    }
    setDialogOpen(false);
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

  // Generate avatar or photo for advisor
  const renderAdvisorImage = (advisor) => {
    if (advisor.photo) {
      return (
        <CardMedia
          component="img"
          height={140}
          image={advisor.photo}
          alt={advisor.name}
          sx={{ objectFit: 'cover' }}
        />
      );
    } else {
      return (
        <Box 
          sx={{ 
            height: 140, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: 'primary.light',
            opacity: 0.7
          }}
        >
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80,
              bgcolor: 'primary.main', 
              fontSize: '2rem'
            }}
          >
            {advisor.name.split(' ').map(n => n[0]).join('')}
          </Avatar>
        </Box>
      );
    }
  };

  return (
    <Box component="section" sx={{ 
      py: 10, 
      bgcolor: 'background.default',
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
              Edit Advisory Board Section
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
            />
            
            <TextField
              fullWidth
              label="Section Description"
              name="description"
              value={tempData.description}
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
              {tempData.members.map((member) => (
                <Grid item xs={12} sm={6} md={3} key={member.id}>
                  <Card sx={{ height: '100%' }}>
                    {renderAdvisorImage(member)}
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
            {data.members.map((member) => (
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
                  {renderAdvisorImage(member)}
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
            value={tempMember.name}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Title/Position"
            name="title"
            value={tempMember.title}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Photo URL"
            name="photo"
            value={tempMember.photo}
            onChange={handleMemberInputChange}
            variant="outlined"
            margin="normal"
            helperText="Leave blank to use initials avatar"
          />
          
          <TextField
            fullWidth
            label="Expertise Area"
            name="expertise"
            value={tempMember.expertise}
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
            disabled={!tempMember.name || !tempMember.title || !tempMember.expertise}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvisoryBoard;