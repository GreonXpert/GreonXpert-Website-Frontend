// src/components/Emission/DataInputForm.jsx
import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Paper, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';

const initialFormData = {
  year: new Date().getFullYear(),
  scope1: '',
  scope2: '',
  scope3: '',
  
};

function DataInputForm({ onAddData, existingYears = [] }) {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric values to numbers
    const updatedValue = name !== 'year' && value !== '' 
      ? parseFloat(value) 
      : name === 'year' ? parseInt(value, 10) : value;
    
    setFormData(prev => ({ ...prev, [name]: updatedValue }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Year is required and should be a valid year
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (formData.year < 1900 || formData.year > 2100) {
      newErrors.year = 'Please enter a valid year (1900-2100)';
    } else if (existingYears.includes(formData.year)) {
      newErrors.year = 'Data for this year already exists';
    }
    
    // At least one scope is required
    if (!formData.scope1 && !formData.scope2 && !formData.scope3) {
      newErrors.scope1 = 'At least one scope is required';
      newErrors.scope2 = 'At least one scope is required';
      newErrors.scope3 = 'At least one scope is required';
    }
    
    // Numeric fields should be valid numbers
    ['scope1', 'scope2', 'scope3'].forEach(field => {
      if (formData[field] !== '' && (isNaN(formData[field]) || formData[field] < 0)) {
        newErrors[field] = 'Must be a positive number';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddData(formData);
      setFormData(initialFormData); // Reset form after successful submission
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
        Add Emissions Data
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Year Input */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              inputProps={{ min: 1900, max: 2100 }}
              error={!!errors.year}
              helperText={errors.year}
              required
            />
          </Grid>
          
          {/* Scope 1 */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Scope 1 (tCO₂e)"
              name="scope1"
              type="number"
              value={formData.scope1}
              onChange={handleChange}
              error={!!errors.scope1}
              helperText={errors.scope1}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>
          
          {/* Scope 2 */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Scope 2 (tCO₂e)"
              name="scope2"
              type="number"
              value={formData.scope2}
              onChange={handleChange}
              error={!!errors.scope2}
              helperText={errors.scope2}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>
          
          {/* Scope 3 */}
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Scope 3 (tCO₂e)"
              name="scope3"
              type="number"
              value={formData.scope3}
              onChange={handleChange}
              error={!!errors.scope3}
              helperText={errors.scope3}
              inputProps={{ min: 0, step: 0.1 }}
            />
          </Grid>
          
          
        </Grid>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            startIcon={<AddIcon />}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 30,
              boxShadow: theme.shadows[2],
              '&:hover': {
                boxShadow: theme.shadows[4],
              }
            }}
          >
            Add Data Point
          </Button>
        </Box>
      </form>
    </Paper>
  );
}

export default DataInputForm;