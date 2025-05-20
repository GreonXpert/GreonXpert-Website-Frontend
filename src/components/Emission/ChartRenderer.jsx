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

  // Debug logging to help troubleshoot rendering issues
  console.log('ChartRenderer props:', { 
    chartType, 
    dataLength: data?.length, 
    toggles, 
    hasColors: !!seriesColors 
  });

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
    pieData = Object.keys(toggles)
      .filter(key => toggles[key] && key !== 'year')  // include only toggled series (excluding any 'year' key)
      .map(key => {
        // Sum values for this series over the data range
        const totalValue = data.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
        return { name: formatSeriesName(key), value: totalValue };
      })
      .filter(item => item.value > 0);
  }

  // Helper to format series keys into human-readable names for chart legend/labels
  const formatSeriesName = (key) => {
    switch (key) {
      case 'scope1': return 'Scope 1';
      case 'scope2': return 'Scope 2';
      case 'scope3': return 'Scope 3';
      case 'forecast': return 'Forecast';
      case 'target': return 'Target';
      case 'sbt': return 'SBT';
      case 'initiatives': return 'Initiatives';
      default: return key.charAt(0).toUpperCase() + key.slice(1);
    }
  };

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
      forecast: '#f39c12',
      target: '#009a44',
      sbt: '#e74c3c',
      initiatives: '#6c757d'
    };
    
    return defaultColors[key] || theme.palette.primary.main;
  };

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
        {toggles.forecast && <Line type="monotone" dataKey="forecast" name="Forecast" stroke={getSeriesColor('forecast')} strokeDasharray="4 2" />}
        {toggles.target && <Line type="monotone" dataKey="target" name="Target" stroke={getSeriesColor('target')} strokeDasharray="5 5" />}
        {toggles.sbt && <Line type="monotone" dataKey="sbt" name="SBT" stroke={getSeriesColor('sbt')} strokeWidth={2} />}
        {toggles.initiatives && <Line type="monotone" dataKey="initiatives" name="Initiatives" stroke={getSeriesColor('initiatives')} strokeWidth={2} />}
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
        {toggles.forecast && <Area type="monotone" dataKey="forecast" name="Forecast" stroke={getSeriesColor('forecast')} fill={getSeriesColor('forecast')} fillOpacity={0.2} strokeDasharray="4 2" />}
        {toggles.target && <Line type="monotone" dataKey="target" name="Target" stroke={getSeriesColor('target')} strokeDasharray="5 5" />}
        {toggles.sbt && <Area type="monotone" dataKey="sbt" name="SBT" stroke={getSeriesColor('sbt')} fill={getSeriesColor('sbt')} fillOpacity={0.3} />}
        {toggles.initiatives && <Area type="monotone" dataKey="initiatives" name="Initiatives" stroke={getSeriesColor('initiatives')} fill={getSeriesColor('initiatives')} fillOpacity={0.3} />}
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
        {toggles.forecast && <Bar dataKey="forecast" name="Forecast" fill={getSeriesColor('forecast')} />}
        {toggles.sbt && <Bar dataKey="sbt" name="SBT" fill={getSeriesColor('sbt')} />}
        {toggles.initiatives && <Bar dataKey="initiatives" name="Initiatives" fill={getSeriesColor('initiatives')} />}
        {toggles.target && 
          <Line 
            type="monotone" 
            dataKey="target" 
            name="Target" 
            stroke={getSeriesColor('target')} 
            strokeDasharray="5 5" 
            legendType="line"   // show target in legend as line
          />
        }
      </BarChart>
    );
  } else if (chartType === 'pie') {
    chartContent = (
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie 
          data={pieData} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" cy="50%" 
          outerRadius={80} 
          label 
        >
          {pieData.map((entry, index) => {
            // Convert entry name to the key format (lowercase)
            const key = entry.name.toLowerCase().replace(/\s+/g, '');
            return (
              <Cell 
                key={`cell-${index}`} 
                fill={getSeriesColor(key)} 
              />
            );
          })}
        </Pie>
      </PieChart>
    );
  } else if (chartType === 'composed') {
    chartContent = (
      <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        {renderAxes()}
        {/* Composed chart: combining lines and bars (example: bars for scopes, line for target) */}
        {toggles.scope1 && <Bar dataKey="scope1" name="Scope 1" fill={getSeriesColor('scope1')} />}
        {toggles.scope2 && <Bar dataKey="scope2" name="Scope 2" fill={getSeriesColor('scope2')} />}
        {toggles.scope3 && <Bar dataKey="scope3" name="Scope 3" fill={getSeriesColor('scope3')} />}
        {toggles.forecast && <Line type="monotone" dataKey="forecast" name="Forecast" stroke={getSeriesColor('forecast')} strokeDasharray="4 2" />}
        {toggles.target && <Line type="monotone" dataKey="target" name="Target" stroke={getSeriesColor('target')} strokeDasharray="5 5" />}
        {toggles.sbt && <Line type="monotone" dataKey="sbt" name="SBT" stroke={getSeriesColor('sbt')} />}
        {toggles.initiatives && <Area type="monotone" dataKey="initiatives" name="Initiatives" stroke={getSeriesColor('initiatives')} fill={getSeriesColor('initiatives')} fillOpacity={0.3} />}
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