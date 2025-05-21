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

  // Map database keys to display keys
  const keyMapping = {
    // Main scopes
    scope1: 'scope1',
    scope2: 'scope2',
    scope3: 'scope3',
    
    // Scope 1 subcategories
    scope1_naturalGasHeating: 'scope1_naturalGasHeating',
    scope1_dieselGenerator: 'scope1_dieselGenerator',
    scope1_dieselFleet: 'scope1_dieselFleet',
    
    // Scope 2 subcategories
    scope2_nyGridElectricity: 'scope2_nyGridElectricity',
    scope2_mfGridElectricity: 'scope2_mfGridElectricity',
    
    // Scope 3 subcategories
    scope3_businessTravel: 'scope3_businessTravel',
    scope3_employeeCommuting: 'scope3_employeeCommuting',
    scope3_logistics: 'scope3_logistics',
    scope3_waste: 'scope3_waste'
  };

  // Transform the data to match the keys expected by the chart
  const transformedData = data.map(item => {
    const transformed = { year: item.year };
    
    // Add main scope totals
    if (item.scope1 !== undefined) transformed.scope1 = item.scope1;
    if (item.scope2 !== undefined) transformed.scope2 = item.scope2;
    if (item.scope3 !== undefined) transformed.scope3 = item.scope3;
    
    // Add scope 1 subcategories
    if (item.scope1_naturalGasHeating !== undefined) 
      transformed.scope1_naturalGasHeating = item.scope1_naturalGasHeating;
    if (item.scope1_dieselGenerator !== undefined) 
      transformed.scope1_dieselGenerator= item.scope1_dieselGenerator;
    if (item.scope1_dieselFleet !== undefined) 
      transformed.scope1_dieselFleet = item.scope1_dieselFleet;
    
    // Add scope 2 subcategories
    if (item.scope2_nyGridElectricity !== undefined) 
      transformed.scope2_nyGridElectricity = item.scope2_nyGridElectricity;
    if (item.scope2_mfGridElectricity !== undefined) 
      transformed.scope2_mfGridElectricity = item.scope2_mfGridElectricity;
    
    // Add scope 3 subcategories
    if (item.scope3_businessTravel !== undefined) 
      transformed.scope3_businessTravel = item.scope3_businessTravel;
    if (item.scope3_employeeCommuting !== undefined) 
      transformed.scope3_employeeCommuting = item.scope3_employeeCommuting;
    if (item.scope3_logistics !== undefined) 
      transformed.scope3_logistics = item.scope3_logistics;
    if (item.scope3_waste !== undefined) 
      transformed.scope3_waste = item.scope3_waste;
    
    return transformed;
  });

  // Prepare data for Pie chart if needed (aggregate values by series)
  let pieData = [];
  if (chartType === 'pie') {
    // First, calculate the totals for each scope and subcategory across all years
    const totals = {};
    
    // Initialize totals for each series
    Object.keys(toggles).forEach(key => {
      if (toggles[key] && key !== 'year') {
        // Convert key to chart key if it's a subcategory
        const chartKey = keyMapping[key] || key;
        totals[chartKey] = 0;
      }
    });
    
    // Sum the values for each series across all years
    transformedData.forEach(yearData => {
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
      // Main scopes
      case 'scope1': return 'Scope 1';
      case 'scope2': return 'Scope 2';
      case 'scope3': return 'Scope 3';
      
      // Scope 1 subcategories
      case 'scope1_naturalGasHeating': return 'NY - Natural Gas Heating';
      case 'scope1_dieselGenerator': return 'MF - Diesel Generator';
      case 'scope1_dieselFleet': return 'MF - Diesel Fleet';
      
      // Scope 2 subcategories
      case 'scope2_nyGridElectricity': return 'NY - Grid Electricity';
      case 'scope2_mfGridElectricity': return 'MF - Grid Electricity';
      
      // Scope 3 subcategories
      case 'scope3_businessTravel': return 'Business Travel';
      case 'scope3_employeeCommuting': return 'Employee Commuting';
      case 'scope3_logistics': return 'Logistics';
      case 'scope3_waste': return 'Waste';
      
      default: return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
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

  // Custom color scheme for different series
  const customColors = {
    // Main scopes - use distinct colors
    scope1: '#1AC99F',
    scope2: '#2E8B8B', 
    scope3: '#3498db',
    
    // Scope 1 subcategories - shades of green
    scope1_naturalGasHeating: '#0d9e7f',
    scope1_dieselGenerator: '#1AC99F',
    scope1_dieselFleet: '#4edcb9',
    
    // Scope 2 subcategories - shades of teal
    scope2_nyGridElectricity: '#1e6565',
    scope2_mfGridElectricity: '#2E8B8B',
    
    // Scope 3 subcategories - shades of blue
    scope3_businessTravel: '#1a6bac',
    scope3_employeeCommuting: '#3498db',
    scope3_logistics: '#5dade2',
    scope3_waste: '#85c1e9'
  };

  // Get series color, either from provided colors, custom colors, or theme
  const getSeriesColor = (key) => {
    // First check if a specific color was provided
    if (seriesColors && seriesColors[key]) return seriesColors[key];
    
    // Then check custom color scheme
    if (customColors[key]) return customColors[key];
    
    // Default to theme colors
    return theme.palette.primary.main;
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

  // Helper function to render all toggled series for a given chart type and component
 const renderSeries = (Component, props = {}) => {
  const series = [];

  // Determine which scopes have subcategories selected
  const scopeHasSubSelected = {
    scope1: Object.keys(toggles).some(k => k.startsWith('scope1_') && toggles[k]),
    scope2: Object.keys(toggles).some(k => k.startsWith('scope2_') && toggles[k]),
    scope3: Object.keys(toggles).some(k => k.startsWith('scope3_') && toggles[k]),
  };

  Object.keys(toggles).forEach(key => {
    if (toggles[key] && key !== 'year') {
      const chartKey = keyMapping[key] || key;

      // Skip main scope if subcategories are selected
      if ((key === 'scope1' && scopeHasSubSelected.scope1) ||
          (key === 'scope2' && scopeHasSubSelected.scope2) ||
          (key === 'scope3' && scopeHasSubSelected.scope3)) {
        return;
      }

      const keyExists = transformedData.some(item => item[chartKey] !== undefined);
      if (keyExists) {
        series.push(
          <Component 
            key={chartKey} 
            dataKey={chartKey} 
            name={formatSeriesName(chartKey)}
            {...props} 
            stroke={getSeriesColor(chartKey)}
            fill={getSeriesColor(chartKey)}
          />
        );
      }
    }
  });

  return series;
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  const subToScopeMap = {
    scope1_naturalGasHeating: 'scope1',
    scope1_dieselGenerator: 'scope1',
    scope1_dieselFleet: 'scope1',
    scope2_nyGridElectricity: 'scope2',
    scope2_mfGridElectricity: 'scope2',
    scope3_businessTravel: 'scope3',
    scope3_employeeCommuting: 'scope3',
    scope3_logistics: 'scope3',
    scope3_waste: 'scope3'
  };

  return (
    <Box sx={{ bgcolor: 'white', p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
      <Typography variant="subtitle2">{`Year: ${label}`}</Typography>
      {payload.map(entry => {
        const { name, value, dataKey } = entry;
        const parentKey = subToScopeMap[dataKey];
        const parentValue = parentKey ? payload.find(p => p.dataKey === parentKey)?.value : null;

        return (
          <Box key={dataKey}>
            <Typography variant="body2">
              {name}: {value?.toFixed(1)} tCO₂e
              {parentValue !== undefined && dataKey !== parentKey && (
                <>
                  <br />
                  <Typography variant="caption" color="text.secondary">
                    (Scope Total: {parentValue?.toFixed(1)} tCO₂e)
                  </Typography>
                </>
              )}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

  // Depending on chartType, render the appropriate Recharts chart
  let chartContent;
  if (chartType === 'line') {
    chartContent = (
      <LineChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {renderSeries(Line, { type: "monotone", strokeWidth: 2, dot: false })}
      </LineChart>
    );
  } else if (chartType === 'area') {
    chartContent = (
      <AreaChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {renderSeries(Area, { type: "monotone", fillOpacity: 0.3 })}
      </AreaChart>
    );
  } else if (chartType === 'bar') {
    chartContent = (
      <BarChart data={transformedData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        {renderAxes()}
        {renderSeries(Bar)}
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
<Tooltip content={<CustomTooltip />} />
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
      <ComposedChart data={transformedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {renderSeries(Bar)}
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