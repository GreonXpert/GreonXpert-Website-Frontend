import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Paper, 
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const initialFormData = {
  year: new Date().getFullYear(),
  scope1: '',
  scope2: '',
  scope3: '',
  // Scope 1 subcategories
  scope1_naturalGasHeating: '',
  scope1_dieselGenerator: '',
  scope1_dieselFleet: '',
  // Scope 2 subcategories
  scope2_nyGridElectricity: '',
  scope2_mfGridElectricity: '',
  // Scope 3 subcategories
  scope3_businessTravel: '',
  scope3_employeeCommuting: '',
  scope3_logistics: '',
  scope3_waste: ''
};

function DataInputForm({ onAddData, existingYears = [] }) {
  const theme = useTheme();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [expanded, setExpanded] = useState('panel1');

//
//  Enhanced handleChange function to ensure proper numeric conversions
const handleChange = (e) => {
  const { name, value } = e.target;
  
  // Convert numeric values to numbers, handling empty strings properly
  let updatedValue;
  if (name === 'year') {
    // For year, convert to integer
    updatedValue = value === '' ? '' : parseInt(value, 10);
  } else if (value === '') {
    // Keep empty strings as empty for non-year fields
    updatedValue = '';
  } else {
    // For other numeric fields, convert to float
    updatedValue = parseFloat(value);
    
    // If the conversion failed, use the original value
    if (isNaN(updatedValue)) {
      updatedValue = value;
    }
  }
  
  // Update specific field
  setFormData(prev => ({ ...prev, [name]: updatedValue }));
  
  // If changing a subcategory, update the total automatically
  if (name.startsWith('scope1_')) {
    updateScopeTotal('scope1');
  } else if (name.startsWith('scope2_')) {
    updateScopeTotal('scope2');
  } else if (name.startsWith('scope3_')) {
    updateScopeTotal('scope3');
  }
  
  // Clear error for this field if it exists
  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: null }));
  }
};
  // Function to update scope totals based on subcategories
// Enhanced updateScopeTotal function for DataInputForm.jsx
const updateScopeTotal = (scopeName) => {
  const scopePrefix = scopeName + '_';
  let total = 0;
  
  // Sum all subcategories for this scope
  Object.keys(formData).forEach(key => {
    if (key.startsWith(scopePrefix) && formData[key] !== '') {
      // Ensure we're working with valid numbers
      const value = formData[key];
      // Convert to number if it's not already, with fallback to 0 for invalid values
      const numericValue = typeof value === 'number' ? value : parseFloat(value || 0);
      
      // Check if the conversion resulted in a valid number
      if (!isNaN(numericValue)) {
        total += numericValue;
      }
    }
  });
  
  // Round to 2 decimal places for consistency
  total = Math.round(total * 100) / 100;
  
  // Update the scope total
  setFormData(prev => ({ ...prev, [scopeName]: total }));
};
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Year validation
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (formData.year < 1900 || formData.year > 2100) {
      newErrors.year = 'Please enter a valid year (1900-2100)';
    } else if (existingYears.includes(formData.year)) {
      newErrors.year = 'Data for this year already exists';
    }
    
    // Ensure at least one scope has data
    if (!formData.scope1 && !formData.scope2 && !formData.scope3) {
      newErrors.scope1 = 'At least one scope is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onAddData(formData);
      setFormData(initialFormData); // Reset form after submission
    }
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="600" color="primary">
        Add Emissions Data
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <form onSubmit={handleSubmit}>
        {/* Year input */}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
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
          <Grid item xs={12} sm={8}>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Fill in emissions data for each scope. Scope totals will be calculated automatically from subcategories.
            </Typography>
          </Grid>
        </Grid>
        
        {/* Scope 1 Section */}
        <Accordion 
          expanded={expanded === 'panel1'} 
          onChange={handleAccordionChange('panel1')}
          sx={{ mt: 3 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{ bgcolor: 'primary.light', color: 'white' }}
          >
            <Typography fontWeight="medium">Scope 1 Emissions (Direct)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Natural Gas Heating (tCO₂e)"
                  name="scope1_naturalGasHeating"
                  type="number"
                  value={formData.scope1_naturalGasHeating}
                  onChange={handleChange}
                  error={!!errors.scope1_naturalGasHeating}
                  helperText={errors.scope1_naturalGasHeating}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Diesel Generator (tCO₂e)"
                  name="scope1_dieselGenerator"
                  type="number"
                  value={formData.scope1_dieselGenerator}
                  onChange={handleChange}
                  error={!!errors.scope1_dieselGenerator}
                  helperText={errors.scope1_dieselGenerator}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Diesel Fleet (tCO₂e)"
                  name="scope1_dieselFleet"
                  type="number"
                  value={formData.scope1_dieselFleet}
                  onChange={handleChange}
                  error={!!errors.scope1_dieselFleet}
                  helperText={errors.scope1_dieselFleet}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scope 1 Total (tCO₂e)"
                  name="scope1"
                  type="number"
                  value={formData.scope1}
                  onChange={handleChange}
                  error={!!errors.scope1}
                  helperText={errors.scope1 || "Auto-calculated from subcategories"}
                  inputProps={{ min: 0, step: 0.1 }}
                  disabled={true}
                  sx={{ 
                    bgcolor: 'action.hover',
                    '& .MuiInputBase-input.Mui-disabled': {
                      fontWeight: 'bold',
                      color: 'text.primary',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Scope 2 Section */}
        <Accordion 
          expanded={expanded === 'panel2'} 
          onChange={handleAccordionChange('panel2')}
          sx={{ mt: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{ bgcolor: 'secondary.light', color: 'white' }}
          >
            <Typography fontWeight="medium">Scope 2 Emissions (Indirect - Electricity)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="NY Grid Electricity (tCO₂e)"
                  name="scope2_nyGridElectricity"
                  type="number"
                  value={formData.scope2_nyGridElectricity}
                  onChange={handleChange}
                  error={!!errors.scope2_nyGridElectricity}
                  helperText={errors.scope2_nyGridElectricity}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="MF Grid Electricity (tCO₂e)"
                  name="scope2_mfGridElectricity"
                  type="number"
                  value={formData.scope2_mfGridElectricity}
                  onChange={handleChange}
                  error={!!errors.scope2_mfGridElectricity}
                  helperText={errors.scope2_mfGridElectricity}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scope 2 Total (tCO₂e)"
                  name="scope2"
                  type="number"
                  value={formData.scope2}
                  onChange={handleChange}
                  error={!!errors.scope2}
                  helperText={errors.scope2 || "Auto-calculated from subcategories"}
                  inputProps={{ min: 0, step: 0.1 }}
                  disabled={true}
                  sx={{ 
                    bgcolor: 'action.hover',
                    '& .MuiInputBase-input.Mui-disabled': {
                      fontWeight: 'bold',
                      color: 'text.primary',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
        {/* Scope 3 Section */}
        <Accordion 
          expanded={expanded === 'panel3'} 
          onChange={handleAccordionChange('panel3')}
          sx={{ mt: 2 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
            sx={{ bgcolor: 'info.light', color: 'white' }}
          >
            <Typography fontWeight="medium">Scope 3 Emissions (Other Indirect)</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Business Travel (tCO₂e)"
                  name="scope3_businessTravel"
                  type="number"
                  value={formData.scope3_businessTravel}
                  onChange={handleChange}
                  error={!!errors.scope3_businessTravel}
                  helperText={errors.scope3_businessTravel}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee Commuting (tCO₂e)"
                  name="scope3_employeeCommuting"
                  type="number"
                  value={formData.scope3_employeeCommuting}
                  onChange={handleChange}
                  error={!!errors.scope3_employeeCommuting}
                  helperText={errors.scope3_employeeCommuting}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Logistics (tCO₂e)"
                  name="scope3_logistics"
                  type="number"
                  value={formData.scope3_logistics}
                  onChange={handleChange}
                  error={!!errors.scope3_logistics}
                  helperText={errors.scope3_logistics}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Waste (tCO₂e)"
                  name="scope3_waste"
                  type="number"
                  value={formData.scope3_waste}
                  onChange={handleChange}
                  error={!!errors.scope3_waste}
                  helperText={errors.scope3_waste}
                  inputProps={{ min: 0, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Scope 3 Total (tCO₂e)"
                  name="scope3"
                  type="number"
                  value={formData.scope3}
                  onChange={handleChange}
                  error={!!errors.scope3}
                  helperText={errors.scope3 || "Auto-calculated from subcategories"}
                  inputProps={{ min: 0, step: 0.1 }}
                  disabled={true}
                  sx={{ 
                    bgcolor: 'action.hover',
                    '& .MuiInputBase-input.Mui-disabled': {
                      fontWeight: 'bold',
                      color: 'text.primary',
                      WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                    }
                  }}
                />
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
        
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
