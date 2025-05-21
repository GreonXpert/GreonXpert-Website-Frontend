// src/components/Emission/DataTable.jsx (fixed)
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  Grid,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';

function DataTable({ data, onDeleteData, onUpdateData, onImportData, isLoading = false }) {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [editTabValue, setEditTabValue] = useState(0);

  // Main fields to display in the table
  const mainFields = [
    { key: 'year', label: 'Year' },
    { key: 'scope1', label: 'Scope 1' },
    { key: 'scope2', label: 'Scope 2' },
    { key: 'scope3', label: 'Scope 3' }
  ];

  // All fields including subcategories for export/import
  const allFields = [
    ...mainFields,
    // Scope 1 subcategories
    { key: 'scope1_naturalGasHeating', label: 'Natural Gas Heating' },
    { key: 'scope1_dieselGenerator', label: 'Diesel Generator' },
    { key: 'scope1_dieselFleet', label: 'Diesel Fleet' },
    // Scope 2 subcategories
    { key: 'scope2_nyGridElectricity', label: 'NY Grid Electricity' },
    { key: 'scope2_mfGridElectricity', label: 'MF Grid Electricity' },
    // Scope 3 subcategories
    { key: 'scope3_businessTravel', label: 'Business Travel' },
    { key: 'scope3_employeeCommuting', label: 'Employee Commuting' },
    { key: 'scope3_logistics', label: 'Logistics' },
    { key: 'scope3_waste', label: 'Waste' }
  ];

  // Open edit dialog
  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setEditFormData({...item});
    setErrors({});
    setEditDialogOpen(true);
    setEditTabValue(0); // Reset to first tab
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric values to numbers
    const updatedValue = name !== 'year' && value !== '' 
      ? parseFloat(value) 
      : name === 'year' ? parseInt(value, 10) : value;
    
    setEditFormData(prev => ({ ...prev, [name]: updatedValue }));
    
    // If changing a subcategory, update the total automatically
    if (name.startsWith('scope1_')) {
      updateScopeTotal('scope1');
    } else if (name.startsWith('scope2_')) {
      updateScopeTotal('scope2');
    } else if (name.startsWith('scope3_')) {
      updateScopeTotal('scope3');
    }
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Function to update scope totals based on subcategories
  const updateScopeTotal = (scopeName) => {
    const scopePrefix = scopeName + '_';
    let total = 0;
    
    // Sum all subcategories for this scope
    Object.keys(editFormData).forEach(key => {
      if (key.startsWith(scopePrefix) && editFormData[key] !== '') {
        total += parseFloat(editFormData[key] || 0);
      }
    });
    
    // Update the scope total
    setEditFormData(prev => ({ ...prev, [scopeName]: total }));
  };

  // Form validation for edit form
  const validateEditForm = () => {
    const newErrors = {};
    
    // Year is required and should be a valid year
    if (!editFormData.year) {
      newErrors.year = 'Year is required';
    } else if (editFormData.year < 1900 || editFormData.year > 2100) {
      newErrors.year = 'Please enter a valid year (1900-2100)';
    } else if (
      // Check if year exists in other data points (excluding the current one)
      data.some(item => item.year === editFormData.year && item.year !== currentEditItem.year)
    ) {
      newErrors.year = 'Data for this year already exists';
    }
    
    // At least one scope is required
    if (!editFormData.scope1 && !editFormData.scope2 && !editFormData.scope3) {
      newErrors.scope1 = 'At least one scope is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle update confirmation
  const handleUpdateConfirm = () => {
    if (validateEditForm()) {
      onUpdateData(currentEditItem, editFormData);
      setEditDialogOpen(false);
    }
  };

  // Handle export data (download CSV)
  const handleExportData = () => {
    // Create CSV header
    const headers = allFields.map(field => field.label).join(',');
    
    // Create CSV rows - Create a copy of data array before sorting
    const csvRows = [...data]
      .sort((a, b) => a.year - b.year)
      .map(row => {
        return allFields.map(field => {
          // Format each cell properly for CSV
          const value = row[field.key] ?? '';
          // Handle special case for values that might need to be quoted
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',');
      });
    
    // Combine header and rows
    const csvContent = [headers, ...csvRows].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'emissions_data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open import dialog
  const handleOpenImport = () => {
    setImportText('');
    setImportError('');
    setImportDialogOpen(true);
  };

  // Handle import data from CSV
  const handleImportData = () => {
    try {
      // Parse CSV input
      const rows = importText.trim().split('\n');
      if (rows.length < 2) {
        setImportError('CSV must contain a header row and at least one data row');
        return;
      }
      
      // Parse headers (first row)
      const headers = rows[0].split(',').map(h => h.trim());
      
      // Map headers to fields
      const fieldMap = {};
      headers.forEach((header, index) => {
        const field = allFields.find(f => f.label.toLowerCase() === header.toLowerCase());
        if (field) {
          fieldMap[index] = field.key;
        }
      });
      
      // Check if we have essential fields
      if (!Object.values(fieldMap).includes('year')) {
        setImportError('CSV must contain a "Year" column');
        return;
      }
      
      // Parse data rows
      const importedData = [];
      for (let i = 1; i < rows.length; i++) {
        const rowData = rows[i].split(',');
        if (rowData.length !== headers.length) {
          setImportError(`Row ${i+1} has incorrect number of fields`);
          return;
        }
        
        const rowObj = {};
        rowData.forEach((cell, index) => {
          const field = fieldMap[index];
          if (field) {
            // Convert to appropriate type
            if (field === 'year') {
              rowObj[field] = parseInt(cell, 10);
            } else if (cell.trim() !== '') {
              rowObj[field] = parseFloat(cell);
            }
          }
        });
        
        // Validate the row data
        if (isNaN(rowObj.year) || rowObj.year < 1900 || rowObj.year > 2100) {
          setImportError(`Row ${i+1} has an invalid year: ${rowObj.year}`);
          return;
        }
        
        // Calculate scope totals if missing
        if (!rowObj.scope1) {
          rowObj.scope1 = calculateScopeTotal(rowObj, 'scope1_');
        }
        if (!rowObj.scope2) {
          rowObj.scope2 = calculateScopeTotal(rowObj, 'scope2_');
        }
        if (!rowObj.scope3) {
          rowObj.scope3 = calculateScopeTotal(rowObj, 'scope3_');
        }
        
        // Check if at least one scope is present
        if (!rowObj.scope1 && !rowObj.scope2 && !rowObj.scope3) {
          setImportError(`Row ${i+1} is missing scope data`);
          return;
        }
        
        importedData.push(rowObj);
      }
      
      // Check for duplicate years
      const years = importedData.map(item => item.year);
      const uniqueYears = new Set(years);
      if (years.length !== uniqueYears.size) {
        setImportError('CSV contains duplicate years');
        return;
      }
      
      // Process import
      onImportData(importedData);
      setImportDialogOpen(false);
    } catch (error) {
      console.error('Import error:', error);
      setImportError('Failed to parse CSV data. Please check the format and try again.');
    }
  };

  // Helper function to calculate scope total from subcategories
  const calculateScopeTotal = (data, prefix) => {
    let total = 0;
    Object.keys(data).forEach(key => {
      if (key.startsWith(prefix)) {
        total += parseFloat(data[key] || 0);
      }
    });
    return total;
  };

  // Format CSV example for import dialog
  const getExampleCSV = () => {
    const headers = allFields.map(f => f.label).join(',');
    const exampleRow = '2023,84.8,70,143,20,43,21.8,30,40,120,10,5,8';
    return `${headers}\n${exampleRow}`;
  };

  // Handle edit tab change
  const handleEditTabChange = (event, newValue) => {
    setEditTabValue(newValue);
  };

  if (!data || data.length === 0) {
    return (
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No emissions data available. Use the form above to add data points.
        </Typography>
      </Paper>
    );
  }

  // Sort data for table rendering
  const sortedData = [...data].sort((a, b) => a.year - b.year);
  // Sort data for accordions (newest first)
  const sortedDataReverse = [...data].sort((a, b) => b.year - a.year);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" fontWeight="600" color="primary">
          Emissions Data
        </Typography>
        <Box>
          <Tooltip title="Import CSV">
            <IconButton 
              onClick={handleOpenImport}
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
              }}
              disabled={isLoading}
            >
              <FileUploadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export as CSV">
            <IconButton 
              onClick={handleExportData}
              sx={{ 
                color: theme.palette.primary.main,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
              }}
              disabled={isLoading}
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      {/* Main Table - Showing only the main fields for clarity */}
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden', mb: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                {mainFields.map(field => (
                  <TableCell 
                    key={field.key}
                    align={field.key === 'year' ? 'left' : 'right'}
                    sx={{ 
                      fontWeight: 600, 
                      color: theme.palette.text.primary
                    }}
                  >
                    {field.label}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Use sorted data array instead of sorting in place */}
              {sortedData.map(item => (
                <TableRow 
                  key={item.year}
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                  }}
                >
                  {mainFields.map(field => (
                    <TableCell 
                      key={`${item.year}-${field.key}`}
                      align={field.key === 'year' ? 'left' : 'right'}
                    >
                      {item[field.key] !== undefined && item[field.key] !== '' 
                        ? field.key === 'year' 
                          ? item[field.key] 
                          : item[field.key].toFixed(1)
                        : '—'
                      }
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEdit(item)}
                        sx={{ color: theme.palette.info.main }}
                        disabled={isLoading}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteData(item)}
                        sx={{ color: theme.palette.error.main }}
                        disabled={isLoading}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress size={40} />
          </Box>
        )}
      </Paper>
      
      {/* Detailed Breakdown Accordion for each year */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Detailed Breakdown by Year
      </Typography>
      
      {/* Use sorted data array for accordions instead of sorting in place */}
      {sortedDataReverse.map(item => (
        <Accordion key={item.year} sx={{ mb: 2 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel-${item.year}-content`}
            id={`panel-${item.year}-header`}
          >
            <Typography fontWeight="medium">
              Year {item.year} - Total: {(parseFloat(item.scope1 || 0) + parseFloat(item.scope2 || 0) + parseFloat(item.scope3 || 0)).toFixed(1)} tCO₂e
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {/* Scope 1 Breakdown */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                    Scope 1 - Total {item.scope1?.toFixed(1) || 0} tCO₂e
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      Natural Gas Heating: {item.scope1_naturalGasHeating?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      Diesel Generator: {item.scope1_dieselGenerator?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      Diesel Fleet: {item.scope1_dieselFleet?.toFixed(1) || 0} tCO₂e
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Scope 2 Breakdown */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.secondary.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="secondary" gutterBottom>
                    Scope 2 - Total {item.scope2?.toFixed(1) || 0} tCO₂e
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      NY Grid Electricity: {item.scope2_nyGridElectricity?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      MF Grid Electricity: {item.scope2_mfGridElectricity?.toFixed(1) || 0} tCO₂e
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              
              {/* Scope 3 Breakdown */}
              <Grid item xs={12} md={4}>
                <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="info.dark" gutterBottom>
                    Scope 3 - Total {item.scope3?.toFixed(1) || 0} tCO₂e
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Box component="li" sx={{ mb: 1 }}>
                      Business Travel: {item.scope3_businessTravel?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      Employee Commuting: {item.scope3_employeeCommuting?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      Logistics: {item.scope3_logistics?.toFixed(1) || 0} tCO₂e
                    </Box>
                    <Box component="li" sx={{ mb: 1 }}>
                      Waste: {item.scope3_waste?.toFixed(1) || 0} tCO₂e
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
      
      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Emissions Data</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={editTabValue} onChange={handleEditTabChange}>
              <Tab label="Year" />
              <Tab label="Scope 1" />
              <Tab label="Scope 2" />
              <Tab label="Scope 3" />
            </Tabs>
          </Box>
          
          {/* Year Tab */}
          {editTabValue === 0 && (
            <Box sx={{ p: 1 }}>
              <TextField
                label="Year"
                name="year"
                type="number"
                value={editFormData.year || ''}
                onChange={handleEditChange}
                error={!!errors.year}
                helperText={errors.year}
                fullWidth
                inputProps={{ min: 1900, max: 2100 }}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                Scope totals are automatically calculated from subcategories.
                Navigate to each scope tab to edit the detailed breakdown.
              </Typography>
            </Box>
          )}
          
          {/* Scope 1 Tab */}
          {editTabValue === 1 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" color="primary" gutterBottom>
                Scope 1 - Direct Emissions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Natural Gas Heating (tCO₂e)"
                    name="scope1_naturalGasHeating"
                    type="number"
                    value={editFormData.scope1_naturalGasHeating || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Diesel Generator (tCO₂e)"
                    name="scope1_dieselGenerator"
                    type="number"
                    value={editFormData.scope1_dieselGenerator || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Diesel Fleet (tCO₂e)"
                    name="scope1_dieselFleet"
                    type="number"
                    value={editFormData.scope1_dieselFleet || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scope 1 Total (tCO₂e)"
                    name="scope1"
                    type="number"
                    value={editFormData.scope1 || ''}
                    onChange={handleEditChange}
                    error={!!errors.scope1}
                    helperText={errors.scope1 || "Auto-calculated from subcategories"}
                    inputProps={{ min: 0, step: 0.1 }}
                    disabled={true}
                    sx={{ 
                      bgcolor: 'action.hover',
                      '& .MuiInputBase-input.Mui-disabled': {
                        fontWeight: 'bold',
                        color: 'text.primary',
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Scope 2 Tab */}
          {editTabValue === 2 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" color="secondary" gutterBottom>
                Scope 2 - Indirect Emissions (Electricity)
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="NY Grid Electricity (tCO₂e)"
                    name="scope2_nyGridElectricity"
                    type="number"
                    value={editFormData.scope2_nyGridElectricity || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="MF Grid Electricity (tCO₂e)"
                    name="scope2_mfGridElectricity"
                    type="number"
                    value={editFormData.scope2_mfGridElectricity || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scope 2 Total (tCO₂e)"
                    name="scope2"
                    type="number"
                    value={editFormData.scope2 || ''}
                    onChange={handleEditChange}
                    error={!!errors.scope2}
                    helperText={errors.scope2 || "Auto-calculated from subcategories"}
                    inputProps={{ min: 0, step: 0.1 }}
                    disabled={true}
                    sx={{ 
                      bgcolor: 'action.hover',
                      '& .MuiInputBase-input.Mui-disabled': {
                        fontWeight: 'bold',
                        color: 'text.primary',
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          
          {/* Scope 3 Tab */}
          {editTabValue === 3 && (
            <Box sx={{ p: 1 }}>
              <Typography variant="h6" color="info.dark" gutterBottom>
                Scope 3 - Other Indirect Emissions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Business Travel (tCO₂e)"
                    name="scope3_businessTravel"
                    type="number"
                    value={editFormData.scope3_businessTravel || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Employee Commuting (tCO₂e)"
                    name="scope3_employeeCommuting"
                    type="number"
                    value={editFormData.scope3_employeeCommuting || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Logistics (tCO₂e)"
                    name="scope3_logistics"
                    type="number"
                    value={editFormData.scope3_logistics || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Waste (tCO₂e)"
                    name="scope3_waste"
                    type="number"
                    value={editFormData.scope3_waste || ''}
                    onChange={handleEditChange}
                    inputProps={{ min: 0, step: 0.1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Scope 3 Total (tCO₂e)"
                    name="scope3"
                    type="number"
                    value={editFormData.scope3 || ''}
                    onChange={handleEditChange}
                    error={!!errors.scope3}
                    helperText={errors.scope3 || "Auto-calculated from subcategories"}
                    inputProps={{ min: 0, step: 0.1 }}
                    disabled={true}
                    sx={{ 
                      bgcolor: 'action.hover',
                      '& .MuiInputBase-input.Mui-disabled': {
                        fontWeight: 'bold',
                        color: 'text.primary',
                        WebkitTextFillColor: 'rgba(0, 0, 0, 0.8)'
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdateConfirm} 
            variant="contained"
            color="primary"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Import Emissions Data (CSV)</DialogTitle>
        <DialogContent dividers>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Paste your CSV data below. The first row should be a header row with the following column names:
          </Typography>
          <Typography 
            variant="code" 
            component="pre" 
            sx={{ 
              bgcolor: theme.palette.grey[100], 
              p: 2, 
              borderRadius: 1,
              overflowX: 'auto',
              fontFamily: 'monospace'
            }}
          >
            {getExampleCSV()}
          </Typography>
          
          {importError && (
            <Alert severity="error" sx={{ my: 2 }}>
              {importError}
            </Alert>
          )}
          
          <TextField
            label="CSV Data"
            multiline
            rows={8}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            fullWidth
            placeholder="Paste CSV data here..."
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImportData}
            variant="contained"
            color="primary"
            disabled={!importText.trim()}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DataTable;