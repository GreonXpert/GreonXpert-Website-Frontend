// src/components/dashboard/EmissionsChart.jsx
import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, Paper, alpha } from '@mui/material';
import ChartControls from '../Emission/ChartControls';
import DataToggles from '../Emission/DataToggles';
import EmissionsStats from '../Emission/EmissionsStats';
import ChartRenderer from '../Emission/ChartRenderer';

// Sample data to use when no data is provided
const SAMPLE_DATA = [
  { 
    year: 2023, 
    scope1: 84.8, 
    scope2: 70, 
    scope3: 143,
    scope1_naturalGasHeating: 20.0,
    scope1_dieselGenerator: 43.0,
    scope1_dieselFleet: 21.8,
    scope2_nyGridElectricity: 30,
    scope2_mfGridElectricity: 40,
    scope3_businessTravel: 120,
    scope3_employeeCommuting: 10,
    scope3_logistics: 5,
    scope3_waste: 8
  },
  { 
    year: 2022, 
    scope1: 95.0, 
    scope2: 80, 
    scope3: 160,
    scope1_naturalGasHeating: 22.0,
    scope1_dieselGenerator: 48.0,
    scope1_dieselFleet: 25.0,
    scope2_nyGridElectricity: 35,
    scope2_mfGridElectricity: 45,
    scope3_businessTravel: 130,
    scope3_employeeCommuting: 12,
    scope3_logistics: 8,
    scope3_waste: 10
  },
  { 
    year: 2021, 
    scope1: 105.0, 
    scope2: 90, 
    scope3: 175,
    scope1_naturalGasHeating: 25.0,
    scope1_dieselGenerator: 52.0,
    scope1_dieselFleet: 28.0,
    scope2_nyGridElectricity: 40,
    scope2_mfGridElectricity: 50,
    scope3_businessTravel: 140,
    scope3_employeeCommuting: 15,
    scope3_logistics: 10,
    scope3_waste: 10
  },
  { 
    year: 2020, 
    scope1: 115.0, 
    scope2: 100, 
    scope3: 190,
    scope1_naturalGasHeating: 28.0,
    scope1_dieselGenerator: 57.0,
    scope1_dieselFleet: 30.0,
    scope2_nyGridElectricity: 45,
    scope2_mfGridElectricity: 55,
    scope3_businessTravel: 150,
    scope3_employeeCommuting: 18,
    scope3_logistics: 12,
    scope3_waste: 10
  },
  { 
    year: 2019, 
    scope1: 125.0, 
    scope2: 110, 
    scope3: 200,
    scope1_naturalGasHeating: 30.0,
    scope1_dieselGenerator: 62.0,
    scope1_dieselFleet: 33.0,
    scope2_nyGridElectricity: 50,
    scope2_mfGridElectricity: 60,
    scope3_businessTravel: 155,
    scope3_employeeCommuting: 20,
    scope3_logistics: 15,
    scope3_waste: 10
  }
];

// Fixed colors for the chart series
const FIXED_SERIES_COLORS = {
  // Main scopes
  scope1: '#1AC99F',
  scope2: '#2E8B8B', 
  scope3: '#3498db',
  
  // Scope 1 subcategories
  scope1_naturalGasHeating: '#0d9e7f',
  scope1_dieselGenerator: '#1AC99F',
  scope1_dieselFleet: '#4edcb9',
  
  // Scope 2 subcategories
  scope2_nyGridElectricity: '#1e6565',
  scope2_mfGridElectricity: '#2E8B8B',
  
  // Scope 3 subcategories
  scope3_businessTravel: '#1a6bac',
  scope3_employeeCommuting: '#3498db',
  scope3_logistics: '#5dade2',
  scope3_waste: '#85c1e9'
};

function EmissionsChart({ data = null }) {
  const theme = useTheme();
  // If no data is provided, use the sample data
  const emissionsData = data || SAMPLE_DATA;

  // State for chart controls
  const [title, setTitle] = useState('Emissions Overview');
  const [startYear, setStartYear] = useState(
    // Find the earliest year in the data
    Math.min(...emissionsData.map(d => d.year))
  );
  const [endYear, setEndYear] = useState(
    // Find the latest year in the data
    Math.max(...emissionsData.map(d => d.year))
  );
  const [chartType, setChartType] = useState('line');

  // State for which data series are toggled on/off - initialize all to true
  const [toggles, setToggles] = useState(() => {
    // Initialize with all toggles on for main scopes
    const initialToggles = {
      scope1: true,
      scope2: true,
      scope3: true
    };
    
    // Check if we have any subcategories and add them
    const firstDataPoint = emissionsData[0] || {};
    Object.keys(firstDataPoint).forEach(key => {
      if (key.includes('_')) {
        initialToggles[key] = false; // Start with subcategories off
      }
    });
    
    return initialToggles;
  });

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    if (!emissionsData || emissionsData.length === 0) return [];
    return emissionsData.filter(item => item.year >= startYear && item.year <= endYear);
  }, [emissionsData, startYear, endYear]);

  // Compute key statistics (Total Emissions and Reduction % over the range)
  const stats = useMemo(() => {
    // Default values
    let totalEmissions = 0;
    let reductionPercentage = 0;
    let trackedScopes = 0;

    if (filteredData.length > 0) {
      // Sort data by year to ensure we get correct first/last years
      const sorted = [...filteredData].sort((a, b) => a.year - b.year);
      const firstYearData = sorted[0];
      const lastYearData = sorted[sorted.length - 1];
      
      // Count tracked scopes
      trackedScopes = ['scope1', 'scope2', 'scope3'].filter(
        scope => lastYearData[scope] !== undefined && lastYearData[scope] !== null
      ).length;
      
      // Calculate total emissions for last year (most recent)
      // Only include toggled scopes in the total
      totalEmissions = ['scope1', 'scope2', 'scope3'].reduce((total, scope) => {
        if (toggles[scope] && lastYearData[scope] !== undefined) {
          return total + (parseFloat(lastYearData[scope]) || 0);
        }
        return total;
      }, 0);
      
      // Calculate baseline emissions (first year in range)
      const baselineEmissions = ['scope1', 'scope2', 'scope3'].reduce((total, scope) => {
        if (toggles[scope] && firstYearData[scope] !== undefined) {
          return total + (parseFloat(firstYearData[scope]) || 0);
        }
        return total;
      }, 0);
      
      // Calculate reduction percentage (positive means reduction, negative means increase)
      if (baselineEmissions > 0) {
        reductionPercentage = ((baselineEmissions - totalEmissions) / baselineEmissions) * 100;
      }
    }
    
    return {
      totalEmissions,
      reductionPercentage,
      trackedScopes
    };
  }, [filteredData, toggles]);

  // Handlers for updating state from subcomponents
  const handleTitleChange = (newTitle) => setTitle(newTitle);
  const handleStartYearChange = (year) => setStartYear(year);
  const handleEndYearChange = (year) => setEndYear(year);
  const handleChartTypeChange = (type) => setChartType(type);
  
  // Handle toggle changes for data series
  const handleToggleChange = (seriesKey, value) => {
    setToggles(prev => ({ ...prev, [seriesKey]: value }));
  };

  // Check if we have valid data to render
  if (!filteredData || filteredData.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No emissions data available for the selected year range.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Chart Controls */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <ChartControls 
          title={title}
          startYear={startYear}
          endYear={endYear}
          chartType={chartType}
          onTitleChange={handleTitleChange}
          onStartYearChange={handleStartYearChange}
          onEndYearChange={handleEndYearChange}
          onChartTypeChange={handleChartTypeChange}
        />
      </Paper>

      {/* Emissions Statistics */}
      <EmissionsStats 
        totalEmissions={stats.totalEmissions}
        reductionPercentage={stats.reductionPercentage}
        trackedScopes={stats.trackedScopes}
      />

      {/* Chart Renderer */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <ChartRenderer 
          title={title}
          chartType={chartType}
          data={filteredData}
          toggles={toggles}
          seriesColors={FIXED_SERIES_COLORS}
        />
      </Paper>

      {/* Data Toggles */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          bgcolor: alpha(theme.palette.background.paper, 0.5),
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}
      >
        <DataToggles 
          toggles={toggles} 
          onToggleChange={handleToggleChange} 
        />
      </Paper>
    </Box>
  );
}

export default EmissionsChart;