// src/components/dashboard/EmissionsChart.jsx
import React, { useState, useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import ChartControls from '../Emission/ChartControls';
import DataToggles from '../Emission/DataToggles';
import EmissionsStats from '../Emission/EmissionsStats';
import ChartRenderer from '../Emission/ChartRenderer';

// Sample data to use when no data is provided
const SAMPLE_DATA = [
  { year: 2015, scope1: 250, scope2: 300, scope3: 450, },
  { year: 2016, scope1: 240, scope2: 280, scope3: 430,  },
  { year: 2017, scope1: 230, scope2: 270, scope3: 410,  },
  { year: 2018, scope1: 200, scope2: 250, scope3: 400,  },
  { year: 2019, scope1: 180, scope2: 230, scope3: 390, },
  { year: 2020, scope1: 160, scope2: 210, scope3: 380,  },
  { year: 2021, scope1: 150, scope2: 190, scope3: 360,  },
  { year: 2022, scope1: 140, scope2: 180, scope3: 340,  },
  { year: 2023, scope1: 130, scope2: 170, scope3: 320,  },
  { year: 2024, scope1: 120, scope2: 160, scope3: 310,  },
  { year: 2025, scope1: 110, scope2: 150, scope3: 300,  }
];

// Fixed colors for the chart
const FIXED_SERIES_COLORS = {
  scope1: '#1AC99F', // Green
  scope2: '#2E8B8B', // Teal
  scope3: '#3498db', // Blue
};

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
  });

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
          seriesColors={FIXED_SERIES_COLORS}
        />
      </Box>

      {/* Data series toggles (checkboxes to show/hide series) */}
      <Box mb={2}>
        <DataToggles toggles={toggles} onToggleChange={handleToggleChange} />
      </Box>
    </Box>
  );
}

export default EmissionsChart;