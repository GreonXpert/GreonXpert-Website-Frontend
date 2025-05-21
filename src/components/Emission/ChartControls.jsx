// src/components/Emission/ChartControls.jsx
import React from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, Divider } from '@mui/material';

function ChartControls({ title, startYear, endYear, chartType, onTitleChange, onStartYearChange, onEndYearChange, onChartTypeChange }) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chart Configuration
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2} alignItems="center">
        {/* Chart Title Input */}
        <Grid item xs={12} md={4}>
          <TextField 
            label="Chart Title" 
            value={title} 
            onChange={(e) => onTitleChange(e.target.value)}
            variant="outlined" 
            size="small" 
            fullWidth 
            placeholder="Emissions Overview"
          />
        </Grid>
        
        {/* Start Year Selector */}
        <Grid item xs={6} md={2}>
          <TextField 
            label="Start Year" 
            type="number" 
            value={startYear} 
            onChange={(e) => onStartYearChange(Number(e.target.value))}
            variant="outlined" 
            size="small" 
            fullWidth 
            inputProps={{ min: 1900, max: 2100 }} 
          />
        </Grid>
        
        {/* End Year Selector */}
        <Grid item xs={6} md={2}>
          <TextField 
            label="End Year" 
            type="number" 
            value={endYear} 
            onChange={(e) => onEndYearChange(Number(e.target.value))}
            variant="outlined" 
            size="small" 
            fullWidth 
            inputProps={{ min: 1900, max: 2100 }} 
          />
        </Grid>
        
        {/* Chart Type Dropdown */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Chart Type</InputLabel>
            <Select
              label="Chart Type"
              value={chartType}
              onChange={(e) => onChartTypeChange(e.target.value)}
            >
              <MenuItem value="line">Line Chart</MenuItem>
              <MenuItem value="area">Area Chart</MenuItem>
              <MenuItem value="bar">Bar Chart</MenuItem>
              <MenuItem value="pie">Pie Chart</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
        Use the toggles below to select which emission sources to display on the chart.
      </Typography>
    </Box>
  );
}

export default ChartControls;