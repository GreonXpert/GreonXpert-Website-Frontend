// src/components/Emission/ChartControls.jsx
import React from 'react';
import { Box, Grid, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function ChartControls({ title, startYear, endYear, chartType, onTitleChange, onStartYearChange, onEndYearChange, onChartTypeChange }) {
  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        {/* Chart Title Input */}
        <Grid item xs={12} md={4}>
        
        </Grid>
        {/* Start Year Selector */}
        <Grid item xs={6} md={3}>
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
        <Grid item xs={6} md={3}>
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
        <Grid item xs={12} md={2}>
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
              <MenuItem value="composed">Composed Chart</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChartControls;
