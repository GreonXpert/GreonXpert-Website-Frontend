// src/components/Emission/ChartRenderer.jsx
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  LineChart, AreaChart, BarChart, PieChart, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  Line, Area, Bar, Pie, Cell
} from 'recharts';

function ChartRenderer({ title, chartType, data, toggles, seriesColors }) {
  const theme = useTheme();

  // Early return if no data
  if (!data || data.length === 0) {
    return (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No data to display for this time range
        </Typography>
      </Box>
    );
  }

  // Prepare data for Pie chart if needed (aggregate values by series)
  let pieData = [];
  if (chartType === 'pie') {
    // First, calculate the totals for each scope across all years
    const totals = {};
    
    // Initialize totals for each series
    Object.keys(toggles).forEach(key => {
      if (toggles[key] && key !== 'year') {
        totals[key] = 0;
      }
    });
    
    // Sum the values for each series across all years
    data.forEach(yearData => {
      Object.keys(totals).forEach(key => {
        // Only add valid numeric values
        if (yearData[key] !== undefined && yearData[key] !== null) {
          totals[key] += Number(yearData[key]) || 0;
        }
      });
    });
    
    // Convert totals to the format required by the Pie chart
    pieData = Object.keys(totals)
      .filter(key => totals[key] > 0) // Only include non-zero values
      .map(key => ({
        name: formatSeriesName(key),
        value: totals[key],
        key: key // Store the original key for color mapping
      }));
  }

  // Helper to format series keys into human-readable names for chart legend/labels
  function formatSeriesName(key) {
    switch (key) {
      case 'scope1': return 'Scope 1';
      case 'scope2': return 'Scope 2';
      case 'scope3': return 'Scope 3';
      
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  }

  // Common axes and grid styling for non-pie charts
  const renderAxes = () => (
    <>
      <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
      <XAxis dataKey="year" tick={{ fill: theme.palette.text.primary }} />
      <YAxis tick={{ fill: theme.palette.text.primary }} />
      <Tooltip />
      <Legend />
    </>
  );

  // Get default color if a specific series color is not defined
  const getSeriesColor = (key) => {
    if (seriesColors && seriesColors[key]) return seriesColors[key];
    
    // Default colors as fallback
    const defaultColors = {
      scope1: '#1AC99F',
      scope2: '#2E8B8B', 
      scope3: '#3498db',
     
    };
    
    return defaultColors[key] || theme.palette.primary.main;
  };

  // Define fallback colors for pie chart
  const fallbackColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.grey[600]
  ];

  // Depending on chartType, render the appropriate Recharts chart
  let chartContent;
  if (chartType === 'line') {
    chartContent = (
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {/* Render a Line for each toggled series */}
        {toggles.scope1 && <Line type="monotone" dataKey="scope1" name="Scope 1" stroke={getSeriesColor('scope1')} strokeWidth={2} dot={false} />}
        {toggles.scope2 && <Line type="monotone" dataKey="scope2" name="Scope 2" stroke={getSeriesColor('scope2')} strokeWidth={2} dot={false} />}
        {toggles.scope3 && <Line type="monotone" dataKey="scope3" name="Scope 3" stroke={getSeriesColor('scope3')} strokeWidth={2} dot={false} />}
        
      </LineChart>
    );
  } else if (chartType === 'area') {
    chartContent = (
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {/* Stacked Area chart for scopes, others overlaid */}
        {toggles.scope1 && <Area type="monotone" dataKey="scope1" name="Scope 1" stroke={getSeriesColor('scope1')} fill={getSeriesColor('scope1')} fillOpacity={0.3} />}
        {toggles.scope2 && <Area type="monotone" dataKey="scope2" name="Scope 2" stroke={getSeriesColor('scope2')} fill={getSeriesColor('scope2')} fillOpacity={0.3} />}
        {toggles.scope3 && <Area type="monotone" dataKey="scope3" name="Scope 3" stroke={getSeriesColor('scope3')} fill={getSeriesColor('scope3')} fillOpacity={0.3} />}
        
      </AreaChart>
    );
  } else if (chartType === 'bar') {
    chartContent = (
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        {renderAxes()}
        {/* Grouped Bar chart for each toggled series */}
        {toggles.scope1 && <Bar dataKey="scope1" name="Scope 1" fill={getSeriesColor('scope1')} />}
        {toggles.scope2 && <Bar dataKey="scope2" name="Scope 2" fill={getSeriesColor('scope2')} />}
        {toggles.scope3 && <Bar dataKey="scope3" name="Scope 3" fill={getSeriesColor('scope3')} />}
       
      
      </BarChart>
    );
  } else if (chartType === 'pie') {
    // Check if we have data to display
    if (pieData.length === 0) {
      chartContent = (
        <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No data to display. Please enable at least one data series.
          </Typography>
        </Box>
      );
    } else {
      chartContent = (
        <PieChart>
          <Tooltip formatter={(value) => [`${Math.round(value)} tCO₂e`, null]} />
          <Legend />
          <Pie 
            data={pieData} 
            dataKey="value" 
            nameKey="name" 
            cx="50%" 
            cy="50%" 
            outerRadius={130}
            innerRadius={0}
            paddingAngle={1}
            label={(entry) => `${entry.name}: ${Math.round(entry.value)}`}
            labelLine={true}
          >
            {pieData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={getSeriesColor(entry.key) || fallbackColors[index % fallbackColors.length]}
              />
            ))}
          </Pie>
        </PieChart>
      );
    }
  } else if (chartType === 'composed') {
    chartContent = (
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {/* Composed chart: combining lines and bars (example: bars for scopes, line for target) */}
        {toggles.scope1 && <Bar dataKey="scope1" name="Scope 1" fill={getSeriesColor('scope1')} />}
        {toggles.scope2 && <Bar dataKey="scope2" name="Scope 2" fill={getSeriesColor('scope2')} />}
        {toggles.scope3 && <Bar dataKey="scope3" name="Scope 3" fill={getSeriesColor('scope3')} />}
     
      </ComposedChart>
    );
  } else {
    // Fallback if chart type is not valid
    chartContent = (
      <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          Unsupported chart type: {chartType}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Optional title displayed above the chart */}
      {title && (
        <Typography variant="h6" align="center" gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={400}>
        {chartContent}
      </ResponsiveContainer>
    </Box>
  );
}

export default ChartRenderer;