// src/components/Emission/DataManagement.jsx
import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Divider, Tabs, Tab, Alert } from '@mui/material';
import DataInputForm from './DataInputForm';
import DataTable from './DataTable';

// Default sample data if no data is provided
const DEFAULT_SAMPLE_DATA = [
  { year: 2015, scope1: 250, scope2: 300, scope3: 450,  },
  { year: 2016, scope1: 240, scope2: 280, scope3: 430, },
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

// LocalStorage key for emissions data
const STORAGE_KEY = 'emissionsData';

function DataManagement({ initialData, onDataChange }) {
  // Initialize with provided data, localStorage data, or default sample data
  const [emissionsData, setEmissionsData] = useState(() => {
    // Check localStorage first
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Failed to parse stored emissions data:', e);
      }
    }
    
    // Fallback to initialData or default sample data
    return initialData || DEFAULT_SAMPLE_DATA;
  });
  
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [tabValue, setTabValue] = useState(0);

  // Update localStorage when emissions data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emissionsData));
    
    // Notify parent component of data change
    if (onDataChange) {
      onDataChange(emissionsData);
    }
  }, [emissionsData, onDataChange]);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Handle adding new data
  const handleAddData = (newDataPoint) => {
    // Check if we already have data for this year
    const existingIndex = emissionsData.findIndex(item => item.year === newDataPoint.year);
    
    if (existingIndex >= 0) {
      showNotification(`Failed to add data: Data for year ${newDataPoint.year} already exists.`, 'error');
      return;
    }
    
    // Add the new data point
    setEmissionsData(prevData => [...prevData, newDataPoint]);
    showNotification(`Added data for year ${newDataPoint.year}`);
  };

  // Handle updating existing data
  const handleUpdateData = (oldItem, updatedItem) => {
    // Check for duplicate year if year is being changed
    if (oldItem.year !== updatedItem.year) {
      const existingIndex = emissionsData.findIndex(item => item.year === updatedItem.year);
      if (existingIndex >= 0 && emissionsData[existingIndex].year !== oldItem.year) {
        showNotification(`Failed to update: Data for year ${updatedItem.year} already exists.`, 'error');
        return;
      }
    }
    
    // Update the data point
    setEmissionsData(prevData => 
      prevData.map(item => 
        item.year === oldItem.year ? updatedItem : item
      )
    );
    
    showNotification(`Updated data for year ${oldItem.year}`);
  };

  // Handle deleting data
  const handleDeleteData = (item) => {
    setEmissionsData(prevData => 
      prevData.filter(dataPoint => dataPoint.year !== item.year)
    );
    showNotification(`Deleted data for year ${item.year}`);
  };

  // Handle importing data (from CSV)
  const handleImportData = (importedData) => {
    // Check for conflicts with existing data
    const existingYears = emissionsData.map(item => item.year);
    const conflicts = importedData.filter(item => existingYears.includes(item.year));
    
    if (conflicts.length > 0) {
      // Replace conflicting data points
      const updatedData = [...emissionsData];
      
      // For each conflict, update the existing data point
      conflicts.forEach(conflict => {
        const index = updatedData.findIndex(item => item.year === conflict.year);
        if (index >= 0) {
          updatedData[index] = conflict;
        }
      });
      
      // Add non-conflicting data points
      const nonConflictingData = importedData.filter(item => !existingYears.includes(item.year));
      setEmissionsData([...updatedData, ...nonConflictingData]);
      
      showNotification(
        `Imported ${importedData.length} data points. ${conflicts.length} existing records were updated.`
      );
    } else {
      // No conflicts, just add all imported data
      setEmissionsData(prevData => [...prevData, ...importedData]);
      showNotification(`Imported ${importedData.length} data points.`);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get existing years for validation
  const existingYears = emissionsData.map(item => item.year);

  return (
    <Box>
      {/* Notification Alert */}
      {notification.show && (
        <Alert 
          severity={notification.type} 
          sx={{ mb: 2 }}
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        >
          {notification.message}
        </Alert>
      )}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label="Enter Data" />
          <Tab label="Manage Data" />
        </Tabs>
      </Paper>
      
      {/* Tab Panel Content */}
      {tabValue === 0 && (
        <DataInputForm 
          onAddData={handleAddData} 
          existingYears={existingYears} 
        />
      )}
      
      {tabValue === 1 && (
        <DataTable 
          data={emissionsData}
          onDeleteData={handleDeleteData}
          onUpdateData={handleUpdateData}
          onImportData={handleImportData}
        />
      )}
    </Box>
  );
}

export default DataManagement;