// src/pages/Emissions.jsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Paper, 
  Tab, 
  Tabs,
  Divider
} from '@mui/material';
import EmissionsChart from '../components/dashboard/EmissionsChart';
import DataManagement from '../components/Emission/DataManagement';

const Emissions = () => {
  const [tabValue, setTabValue] = useState(0);
  const [emissionsData, setEmissionsData] = useState(null);

  // Handler for tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handler for data changes from DataManagement component
  const handleDataChange = (newData) => {
    setEmissionsData(newData);
  };

  // Calculate summary stats for the dashboard cards
// Fixed calculateSummaryStats function for Emissions.jsx
const calculateSummaryStats = () => {
  if (!emissionsData || emissionsData.length === 0) {
    return {
      totalEmissions: 0,
      targetProgress: 0,
      scope1And2: 0,
      scope3: 0,
      scope1Change: 0,
      scope2Change: 0,
      scope3Change: 0
    };
  }

  // Sort data by year
  const sortedData = [...emissionsData].sort((a, b) => a.year - b.year);
  
  // Get current year (latest year) data
  const currentYearData = sortedData[sortedData.length - 1];
  
  // Get previous year data (if available)
  const prevYearData = sortedData.length > 1 ? sortedData[sortedData.length - 2] : null;
  
  // Calculate totals - ensure we're using proper numeric values with fallbacks
  const scope1 = parseFloat(currentYearData.scope1 || 0);
  const scope2 = parseFloat(currentYearData.scope2 || 0);
  const scope3 = parseFloat(currentYearData.scope3 || 0);
  
  // Calculate total emissions correctly
  const totalEmissions = scope1 + scope2 + scope3;
  const scope1And2 = scope1 + scope2;
  
  // Calculate target progress
  const target = parseFloat(currentYearData.target || 0);
  const baselineYear = sortedData[0];
  const baselineScope1 = parseFloat(baselineYear.scope1 || 0);
  const baselineScope2 = parseFloat(baselineYear.scope2 || 0);
  const baselineScope3 = parseFloat(baselineYear.scope3 || 0);
  const baselineTotal = baselineScope1 + baselineScope2 + baselineScope3;
  
  // Calculate percent change from baseline to current
  const percentChange = baselineTotal > 0 
    ? ((baselineTotal - totalEmissions) / baselineTotal) * 100
    : 0;
  
  // If target exists use it, otherwise use the percent change from baseline
  const targetProgress = target > 0 
    ? Math.round((1 - (totalEmissions / target)) * 100)
    : Math.round(percentChange);
  
  // Calculate year-over-year changes
  let scope1Change = 0;
  let scope2Change = 0;
  let scope3Change = 0;
  
  if (prevYearData) {
    const prevScope1 = parseFloat(prevYearData.scope1 || 0);
    const prevScope2 = parseFloat(prevYearData.scope2 || 0);
    const prevScope3 = parseFloat(prevYearData.scope3 || 0);
    
    // Use proper percent change calculation and ensure we don't divide by zero
    scope1Change = prevScope1 > 0 
      ? ((scope1 - prevScope1) / prevScope1) * 100 
      : (scope1 > 0 ? 100 : 0);
      
    scope2Change = prevScope2 > 0 
      ? ((scope2 - prevScope2) / prevScope2) * 100 
      : (scope2 > 0 ? 100 : 0);
      
    scope3Change = prevScope3 > 0 
      ? ((scope3 - prevScope3) / prevScope3) * 100 
      : (scope3 > 0 ? 100 : 0);
  }
  
  return {
    totalEmissions,
    targetProgress,
    scope1And2,
    scope3,
    scope1Change,
    scope2Change,
    scope3Change
  };
};
  const stats = calculateSummaryStats();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Emissions Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor, analyze, and manage your organization's greenhouse gas emissions with interactive charts.
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Emissions
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {Math.round(stats.totalEmissions)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                tCO₂e
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Target Progress
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {stats.targetProgress}%
              </Typography>
              <Typography 
                variant="body2" 
                color={stats.targetProgress >= 0 ? "success.main" : "error.main"}
              >
                {stats.targetProgress >= 0 ? '+' : ''}{stats.targetProgress.toFixed(1)}% vs target
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Scope 1 & 2
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {Math.round(stats.scope1And2)}
              </Typography>
              <Typography 
                variant="body2" 
                color={stats.scope1Change + stats.scope2Change <= 0 ? "success.main" : "error.main"}
              >
                {stats.scope1Change + stats.scope2Change <= 0 ? '' : '+'}
                {((stats.scope1Change + stats.scope2Change) / 2).toFixed(1)}% vs last year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Scope 3
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {Math.round(stats.scope3)}
              </Typography>
              <Typography 
                variant="body2" 
                color={stats.scope3Change <= 0 ? "success.main" : "error.main"}
              >
                {stats.scope3Change <= 0 ? '' : '+'}
                {stats.scope3Change.toFixed(1)}% vs last year
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Tabs - Only keeping Emissions Overview and Data Management */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Emissions Overview" />
          <Tab label="Data Management" />
        </Tabs>
      </Paper>

      {/* Content based on selected tab */}
      <Paper elevation={2} sx={{ mb: 4, p: 3, overflow: 'hidden' }}>
        {tabValue === 0 && (
          <>
            <Typography variant="h6" gutterBottom>Emissions Overview</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Visualize your overall emissions trends and reduction progress.
            </Typography>
            <EmissionsChart data={emissionsData} />
          </>
        )}
        {tabValue === 1 && (
          <>
            <Typography variant="h6" gutterBottom>Data Management</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add, edit, import or export your emissions data.
            </Typography>
            <Divider sx={{ my: 2 }} />
            <DataManagement 
              initialData={emissionsData}
              onDataChange={handleDataChange}
            />
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Emissions;