// src/components/Emission/DataTable.jsx
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
  alpha
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useTheme } from '@mui/material/styles';

function DataTable({ data, onDeleteData, onUpdateData, onImportData }) {
  const theme = useTheme();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditItem, setCurrentEditItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');

  // Fields to display in the table
  const dataFields = [
    { key: 'year', label: 'Year' },
    { key: 'scope1', label: 'Scope 1' },
    { key: 'scope2', label: 'Scope 2' },
    { key: 'scope3', label: 'Scope 3' },
    
  ];

  // Open edit dialog
  const handleEdit = (item) => {
    setCurrentEditItem(item);
    setEditFormData({...item});
    setErrors({});
    setEditDialogOpen(true);
  };

  // Handle edit form input changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Convert numeric values to numbers
    const updatedValue = name !== 'year' && value !== '' 
      ? parseFloat(value) 
      : name === 'year' ? parseInt(value, 10) : value;
    
    setEditFormData(prev => ({ ...prev, [name]: updatedValue }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
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
    
    // Numeric fields should be valid numbers
    ['scope1', 'scope2', 'scope3'].forEach(field => {
      if (editFormData[field] !== '' && (isNaN(editFormData[field]) || editFormData[field] < 0)) {
        newErrors[field] = 'Must be a positive number';
      }
    });
    
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
    const headers = dataFields.map(field => field.label).join(',');
    
    // Create CSV rows
    const csvRows = data
      .sort((a, b) => a.year - b.year)
      .map(row => {
        return dataFields.map(field => {
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
        const field = dataFields.find(f => f.label.toLowerCase() === header.toLowerCase());
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

  // Format CSV example for import dialog
  const getExampleCSV = () => {
    const headers = dataFields.map(f => f.label).join(',');
    const exampleRow = '2023,150,200,300,500,450,,';
    return `${headers}\n${exampleRow}`;
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
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                {dataFields.map(field => (
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
              {data
                .sort((a, b) => a.year - b.year)
                .map(item => (
                <TableRow 
                  key={item.year}
                  sx={{ 
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) } 
                  }}
                >
                  {dataFields.map(field => (
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
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteData(item)}
                        sx={{ color: theme.palette.error.main }}
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
      </Paper>
      
      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Emissions Data</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
              {/* Year */}
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
              />
              
              {/* Scope 1 */}
              <TextField
                label="Scope 1"
                name="scope1"
                type="number"
                value={editFormData.scope1 || ''}
                onChange={handleEditChange}
                error={!!errors.scope1}
                helperText={errors.scope1}
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
              />
              
              {/* Scope 2 */}
              <TextField
                label="Scope 2"
                name="scope2"
                type="number"
                value={editFormData.scope2 || ''}
                onChange={handleEditChange}
                error={!!errors.scope2}
                helperText={errors.scope2}
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
              />
              
              {/* Scope 3 */}
              <TextField
                label="Scope 3"
                name="scope3"
                type="number"
                value={editFormData.scope3 || ''}
                onChange={handleEditChange}
                error={!!errors.scope3}
                helperText={errors.scope3}
                fullWidth
                inputProps={{ min: 0, step: 0.1 }}
              />
              
            
            </Box>
          </Box>
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