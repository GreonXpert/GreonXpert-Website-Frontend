// src/components/Emission/DataManagement.jsx - Updated to use backend API
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Paper, 
  Typography, 
  Divider, 
  Tabs, 
  Tab, 
  Alert,
  CircularProgress 
} from '@mui/material';
import DataInputForm from './DataInputForm';
import DataTable from './DataTable';
import { 
  fetchAllEmissions, 
  createEmissionData, 
  updateEmissionData, 
  deleteEmissionData,
  bulkImportEmissionsData
} from '../../store/slices/emissionSlice';

// Default sample data if no data is provided
const DEFAULT_SAMPLE_DATA = [
  { 
    year: 2023, 
    // Main scope totals
    scope1: 84.8, 
    scope2: 70, 
    scope3: 143,
    // Scope 1 subcategories
    scope1_naturalGasHeating: 20.0,
    scope1_dieselGenerator: 43.0,
    scope1_dieselFleet: 21.8,
    // Scope 2 subcategories
    scope2_nyGridElectricity: 30,
    scope2_mfGridElectricity: 40,
    // Scope 3 subcategories
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
  // Add similar structure for other years with slightly different values
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

function DataManagement({ initialData, onDataChange }) {
  const dispatch = useDispatch();
  
  // Get emissions data from Redux store
  const { emissions, loading, error, successMessage } = useSelector((state) => state.emissions);
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const [emissionsData, setEmissionsData] = useState(initialData || DEFAULT_SAMPLE_DATA);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [tabValue, setTabValue] = useState(0);
  const [dataFetched, setDataFetched] = useState(false);

  // Fetch emissions data from API on component mount
  useEffect(() => {
    if (!dataFetched) {
      dispatch(fetchAllEmissions());
      setDataFetched(true);
    }
  }, [dispatch, dataFetched]);

  // Update local state when emissions data changes in Redux store
  useEffect(() => {
    if (emissions && emissions.length > 0) {
      setEmissionsData(emissions);
      
      // Notify parent component of data change
      if (onDataChange) {
        onDataChange(emissions);
      }
    }
  }, [emissions, onDataChange]);

  // Handle Redux success messages
  useEffect(() => {
    if (successMessage) {
      showNotification(successMessage);
    }
  }, [successMessage]);

  // Handle Redux errors
  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
    }
  }, [error]);

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
    // Check if we already have data for this year (client-side validation)
    const existingIndex = emissionsData.findIndex(item => item.year === newDataPoint.year);
    
    if (existingIndex >= 0) {
      showNotification(`Failed to add data: Data for year ${newDataPoint.year} already exists.`, 'error');
      return;
    }
    
    // Add the new data point to the backend
    if (isAuthenticated) {
      dispatch(createEmissionData(newDataPoint));
    } else {
      // Fallback to local handling if not authenticated
      setEmissionsData(prevData => [...prevData, newDataPoint]);
      showNotification(`Added data for year ${newDataPoint.year}`);
      
      // Notify parent component
      if (onDataChange) {
        onDataChange([...emissionsData, newDataPoint]);
      }
    }
  };

  // Handle updating existing data
  const handleUpdateData = (oldItem, updatedItem) => {
    // Check for duplicate year if year is being changed (client-side validation)
    if (oldItem.year !== updatedItem.year) {
      const existingIndex = emissionsData.findIndex(item => item.year === updatedItem.year);
      if (existingIndex >= 0 && emissionsData[existingIndex].year !== oldItem.year) {
        showNotification(`Failed to update: Data for year ${updatedItem.year} already exists.`, 'error');
        return;
      }
    }
    
    // Update the data point in the backend
    if (isAuthenticated) {
      dispatch(updateEmissionData({ year: oldItem.year, emissionData: updatedItem }));
    } else {
      // Fallback to local handling if not authenticated
      setEmissionsData(prevData => 
        prevData.map(item => 
          item.year === oldItem.year ? updatedItem : item
        )
      );
      
      showNotification(`Updated data for year ${oldItem.year}`);
      
      // Notify parent component
      if (onDataChange) {
        onDataChange(emissionsData.map(item => 
          item.year === oldItem.year ? updatedItem : item
        ));
      }
    }
  };

  // Handle deleting data
  const handleDeleteData = (item) => {
    // Delete the data point from the backend
    if (isAuthenticated) {
      dispatch(deleteEmissionData(item.year));
    } else {
      // Fallback to local handling if not authenticated
      setEmissionsData(prevData => 
        prevData.filter(dataPoint => dataPoint.year !== item.year)
      );
      
      showNotification(`Deleted data for year ${item.year}`);
      
      // Notify parent component
      if (onDataChange) {
        onDataChange(emissionsData.filter(dataPoint => dataPoint.year !== item.year));
      }
    }
  };

  // Handle importing data
  const handleImportData = (importedData) => {
    // Import data to the backend
    if (isAuthenticated) {
      dispatch(bulkImportEmissionsData({ 
        data: importedData,
        overwrite: true // Allow overwriting existing data
      }));
      
      // Refetch all data after import
      setTimeout(() => {
        dispatch(fetchAllEmissions());
      }, 1000);
    } else {
      // Fallback to local handling if not authenticated
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
        const newData = [...updatedData, ...nonConflictingData];
        
        setEmissionsData(newData);
        
        showNotification(
          `Imported ${importedData.length} data points. ${conflicts.length} existing records were updated.`
        );
        
        // Notify parent component
        if (onDataChange) {
          onDataChange(newData);
        }
      } else {
        // No conflicts, just add all imported data
        const newData = [...emissionsData, ...importedData];
        setEmissionsData(newData);
        
        showNotification(`Imported ${importedData.length} data points.`);
        
        // Notify parent component
        if (onDataChange) {
          onDataChange(newData);
        }
      }
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get existing years for validation
  const existingYears = emissionsData.map(item => item.year);

  // Show loading state
  if (loading && !emissionsData.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
      
      {/* Authentication Status Alert - Only show when not authenticated */}
      {!isAuthenticated && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
        >
          You are currently in demo mode. Log in to save changes to the database.
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
          isLoading={loading}
        />
      )}
    </Box>
  );
}

export default DataManagement;