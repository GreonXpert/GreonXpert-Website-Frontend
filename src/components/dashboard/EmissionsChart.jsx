// src/components/dashboard/EmissionsChart.jsx
import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import ChartControls from '../Emission/ChartControls';
import DataToggles from '../Emission/DataToggles';
import EmissionsStats from '../Emission/EmissionsStats';
import ChartRenderer from '../Emission/ChartRenderer';
import AdvancedSettingsPanel from '../Emission/AdvancedSettingsPanel';

// Sample data to use when no data is provided
const SAMPLE_DATA = [
  { year: 2015, scope1: 250, scope2: 300, scope3: 450, target: 1000 },
  { year: 2016, scope1: 240, scope2: 280, scope3: 430, target: 950 },
  { year: 2017, scope1: 230, scope2: 270, scope3: 410, target: 900 },
  { year: 2018, scope1: 200, scope2: 250, scope3: 400, target: 850 },
  { year: 2019, scope1: 180, scope2: 230, scope3: 390, target: 800 },
  { year: 2020, scope1: 160, scope2: 210, scope3: 380, target: 750 },
  { year: 2021, scope1: 150, scope2: 190, scope3: 360, target: 700 },
  { year: 2022, scope1: 140, scope2: 180, scope3: 340, target: 650 },
  { year: 2023, scope1: 130, scope2: 170, scope3: 320, forecast: 620, target: 600 },
  { year: 2024, scope1: 120, scope2: 160, scope3: 310, forecast: 590, target: 550 },
  { year: 2025, scope1: 110, scope2: 150, scope3: 300, forecast: 560, target: 500, sbt: 550, initiatives: 520 }
];

function EmissionsChart({ data = SAMPLE_DATA }) {
  const theme = useTheme();

  // State for chart controls
  const [title, setTitle] = useState('Emissions Overview');
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2025);
  const [chartType, setChartType] = useState('line');

  // State for which data series are toggled on/off
  const [toggles, setToggles] = useState({
    scope1: true,
    scope2: true,
    scope3: true,
    forecast: false,
    target: false,
    sbt: false,
    initiatives: false,
  });

  // State for custom series colors (initialized from theme palette)
  const [seriesColors, setSeriesColors] = useState(() => ({
    scope1: theme.palette.primary.main || '#1AC99F',
    scope2: theme.palette.secondary.main || '#2E8B8B',
    scope3: theme.palette.info.main || '#3498db',
    forecast: theme.palette.warning.main || '#f39c12',
    target: theme.palette.success.dark || '#009a44',
    sbt: theme.palette.error.main || '#e74c3c',
    initiatives: theme.palette.grey[600] || '#6c757d',
  }));

  // Filter data based on selected year range
  const filteredData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.filter(item => item.year >= startYear && item.year <= endYear);
  }, [data, startYear, endYear]);

  // Compute key statistics (Total Emissions and Reduction % over the range, and number of tracked scopes)
  const stats = useMemo(() => {
    let totalEmissions = 0;
    let baselineEmissions = 0;
    if (filteredData.length > 0) {
      // Sort data by year to ensure we get correct first/last years
      const sorted = [...filteredData].sort((a, b) => a.year - b.year);
      const firstYearData = sorted[0];
      const lastYearData = sorted[sorted.length - 1];
      
      // Calculate baseline (first year) and total (last year) including only toggled scopes
      ['scope1', 'scope2', 'scope3'].forEach(scope => {
        if (toggles[scope]) {
          baselineEmissions += firstYearData[scope] ?? 0;
          totalEmissions += lastYearData[scope] ?? 0;
        }
      });
    }
    
    const reductionPercentage = baselineEmissions > 0 
      ? ((baselineEmissions - totalEmissions) / baselineEmissions) * 100 
      : 0;
      
    // Number of scopes being tracked (regardless of toggles – assuming data presence for scope1,2,3)
    const trackedScopesCount = ['scope1', 'scope2', 'scope3']
      .filter(scope => data && data.some(item => item[scope] !== undefined))
      .length;
      
    return {
      totalEmissions,
      reductionPercentage,
      trackedScopes: trackedScopesCount
    };
  }, [filteredData, toggles, data]);

  // Handlers for updating state from subcomponents
  const handleTitleChange = (newTitle) => setTitle(newTitle);
  const handleStartYearChange = (year) => setStartYear(year);
  const handleEndYearChange = (year) => setEndYear(year);
  const handleChartTypeChange = (type) => setChartType(type);
  const handleToggleChange = (seriesKey, value) => {
    setToggles(prev => ({ ...prev, [seriesKey]: value }));
  };
  const handleColorChange = (seriesKey, color) => {
    setSeriesColors(prev => ({ ...prev, [seriesKey]: color }));
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
      {/* Chart controls: title, year range, chart type selector */}
      <Box mb={2}>
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
      </Box>

      {/* Emissions statistics cards */}
      <Box mb={2}>
        <EmissionsStats 
          totalEmissions={stats.totalEmissions}
          reductionPercentage={stats.reductionPercentage}
          trackedScopes={stats.trackedScopes}
        />
      </Box>

      {/* Chart renderer (displays the chart based on type and filtered data) */}
      <Box mb={2}>
        <ChartRenderer 
          title={title}
          chartType={chartType}
          data={filteredData}
          toggles={toggles}
          seriesColors={seriesColors}
        />
      </Box>

      {/* Data series toggles (checkboxes to show/hide series) */}
      <Box mb={2}>
        <DataToggles toggles={toggles} onToggleChange={handleToggleChange} />
      </Box>

      {/* Advanced settings panel for customizing series colors */}
      <AdvancedSettingsPanel colors={seriesColors} onColorChange={handleColorChange} />
    </Box>
  );
}

export default EmissionsChart;