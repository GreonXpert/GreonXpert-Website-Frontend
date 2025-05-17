// src/components/Home/SustainabilityStories.jsx
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
  CardActions,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Chip,
  Link
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  PlayArrow as PlayIcon,
  BookOutlined as BlogIcon,
  VideoLibrary as VideoIcon,
  MenuBook as ResourceIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';

const SustainabilityStories = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [data, setData] = useState({
    title: "Latest Sustainability Stories",
    subtitle: "Insights, news, and resources from our sustainability experts",
    categories: ["All", "Blog", "Video", "Resources"],
    stories: [
      {
        id: 1,
        title: "Building Climate Resilience in Supply Chains",
        description: "Strategies for creating robust supply chains in the face of growing climate challenges.",
        category: "Blog",
        image: "/assets/images/stories/story1.jpg",
        date: "May 10, 2025",
        link: "/blog/climate-resilience-supply-chains"
      },
      {
        id: 2,
        title: "Future of Carbon Markets",
        description: "Expert analysis on the evolution of global carbon markets and what it means for businesses.",
        category: "Video",
        image: "/assets/images/stories/story2.jpg",
        date: "April 28, 2025",
        link: "/videos/carbon-markets-future"
      },
      {
        id: 3,
        title: "ESG Reporting: CSRD Implementation Guide",
        description: "Step-by-step guide to implementing CSRD requirements for European operations.",
        category: "Resources",
        image: "/assets/images/stories/story3.jpg",
        date: "April 15, 2025",
        link: "/resources/csrd-implementation-guide"
      },
      {
        id: 4,
        title: "AI in Decarbonization Strategy",
        description: "How AI is transforming corporate decarbonization roadmaps and implementation.",
        category: "Blog",
        image: "/assets/images/stories/story4.jpg",
        date: "April 5, 2025",
        link: "/blog/ai-decarbonization-strategy"
      }
    ]
  });
  
  const [tempData, setTempData] = useState({...data});
  const [tempStory, setTempStory] = useState({
    id: null,
    title: "",
    description: "",
    category: "Blog",
    image: "",
    date: "",
    link: ""
  });
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
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
  
  // Handle story input changes
  const handleStoryInputChange = (e) => {
    const { name, value } = e.target;
    setTempStory(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Open dialog to add/edit a story
  const handleOpenDialog = (story = null) => {
    if (story) {
      // Edit existing story
      setCurrentStory(story);
      setTempStory({...story});
    } else {
      // Add new story
      setCurrentStory(null);
      const today = new Date();
      const formattedDate = `${today.toLocaleString('default', {month: 'short'})} ${today.getDate()}, ${today.getFullYear()}`;
      
      setTempStory({
        id: Date.now(),
        title: "",
        description: "",
        category: "Blog",
        image: "",
        date: formattedDate,
        link: ""
      });
    }
    setDialogOpen(true);
  };
  
  // Save story
  const handleSaveStory = () => {
    if (currentStory) {
      // Update existing story
      setTempData(prev => ({
        ...prev,
        stories: prev.stories.map(s => 
          s.id === currentStory.id ? tempStory : s
        )
      }));
    } else {
      // Add new story
      setTempData(prev => ({
        ...prev,
        stories: [...prev.stories, tempStory]
      }));
    }
    setDialogOpen(false);
  };
  
  // Delete story
  const handleDeleteStory = (id) => {
    setTempData(prev => ({
      ...prev,
      stories: prev.stories.filter(s => s.id !== id)
    }));
  };
  
  // Cancel editing
  const handleCancel = () => {
    setTempData({...data});
    setIsEditing(false);
  };
  
  // Get category icon
  const getCategoryIcon = (category, size = 'small') => {
    switch(category) {
      case 'Blog':
        return <BlogIcon fontSize={size} />;
      case 'Video':
        return <VideoIcon fontSize={size} />;
      case 'Resources':
        return <ResourceIcon fontSize={size} />;
      default:
        return <BlogIcon fontSize={size} />;
    }
  };
  
  // Filter stories by selected tab
  const getFilteredStories = () => {
    const selectedCategory = data.categories[tabValue];
    if (selectedCategory === 'All') {
      return data.stories;
    } else {
      return data.stories.filter(story => story.category === selectedCategory);
    }
  };

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
              Edit Sustainability Stories Section
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
            
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Stories</Typography>
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Add Story
              </Button>
            </Box>
            
            <Grid container spacing={3}>
              {tempData.stories.map((story) => (
                <Grid item xs={12} sm={6} md={3} key={story.id}>
                  <Card sx={{ height: '100%' }}>
                    {story.image ? (
                      <CardMedia
                        component="img"
                        height={140}
                        image={story.image}
                        alt={story.title}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 140, 
                          bgcolor: 'grey.200', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        {getCategoryIcon(story.category, 'large')}
                      </Box>
                    )}
                    <CardContent sx={{ pb: 0 }}>
                      <Box sx={{ mb: 1 }}>
                        <Chip 
                          icon={getCategoryIcon(story.category)} 
                          label={story.category} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="h6" gutterBottom noWrap>
                        {story.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {story.date}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          height: 60, 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {story.description}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleOpenDialog(story)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteStory(story.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        ) : null}
        
        {/* Display Content */}
        <Box>
          <Box sx={{ textAlign: 'center', mb: 5 }}>
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
                maxWidth: 700, 
                mx: 'auto',
                mb: 4,
                fontWeight: 'normal'
              }}
            >
              {data.subtitle}
            </Typography>
            
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              centered
              sx={{ 
                mb: 4,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  mx: { xs: 0.5, sm: 2 },
                },
              }}
            >
              {data.categories.map((category) => (
                <Tab 
                  key={category} 
                  label={category} 
                  icon={category !== 'All' ? getCategoryIcon(category) : null} 
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Box>
          
          <Grid container spacing={3}>
            {getFilteredStories().map((story) => (
              <Grid item xs={12} sm={6} md={3} key={story.id}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    {story.image ? (
                      <CardMedia
                        component="img"
                        height={180}
                        image={story.image}
                        alt={story.title}
                        sx={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <Box 
                        sx={{ 
                          height: 180, 
                          bgcolor: 'grey.200', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center' 
                        }}
                      >
                        {getCategoryIcon(story.category, 'large')}
                      </Box>
                    )}
                    {story.category === 'Video' && (
                      <Box 
                        sx={{ 
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                          bgcolor: 'rgba(0, 0, 0, 0.6)',
                          borderRadius: '50%',
                          p: 1,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 50,
                          height: 50,
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.75)',
                          }
                        }}
                      >
                        <PlayIcon fontSize="large" />
                      </Box>
                    )}
                    <Box 
                      sx={{ 
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        zIndex: 2
                      }}
                    >
                      <Chip 
                        icon={getCategoryIcon(story.category)} 
                        label={story.category} 
                        size="small" 
                        color="primary" 
                        sx={{ 
                          bgcolor: 'white',
                          fontWeight: 600
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, pb: 2 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {story.date}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      gutterBottom
                    >
                      {story.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        mb: 2,
                        height: 60, 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {story.description}
                    </Typography>
                    <Link 
                      href={story.link}
                      color="primary"
                      sx={{ 
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      Read More<ArrowIcon sx={{ ml: 0.5, fontSize: '1rem' }} />
                    </Link>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="outlined" 
              color="primary"
              size="large"
              sx={{ px: 4, py: 1.5 }}
            >
              View All Stories
            </Button>
          </Box>
        </Box>
      </Container>
      
      {/* Add/Edit Story Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {currentStory ? 'Edit' : 'Add'} Story
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={tempStory.title}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={tempStory.description}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            multiline
            rows={3}
            required
          />
          
          <TextField
            fullWidth
            select
            label="Category"
            name="category"
            value={tempStory.category}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            SelectProps={{
              native: true
            }}
          >
            {data.categories.filter(cat => cat !== 'All').map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </TextField>
          
          <TextField
            fullWidth
            label="Image URL"
            name="image"
            value={tempStory.image}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            helperText="Leave blank to use category icon"
          />
          
          <TextField
            fullWidth
            label="Date"
            name="date"
            value={tempStory.date}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Link URL"
            name="link"
            value={tempStory.link}
            onChange={handleStoryInputChange}
            variant="outlined"
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSaveStory} 
            variant="contained" 
            color="primary"
            disabled={!tempStory.title || !tempStory.description || !tempStory.link}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SustainabilityStories;