// src/store/slices/emissionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import emissionService from '../../services/emissionService';
import { showSnackbar } from './notificationSlice';

// Async thunk for fetching all emissions data
export const fetchAllEmissions = createAsyncThunk(
  'emissions/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await emissionService.getAllEmissions(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions data');
    }
  }
);

// Async thunk for fetching emissions by year range
export const fetchEmissionsByYearRange = createAsyncThunk(
  'emissions/fetchByYearRange',
  async ({ startYear, endYear }, { rejectWithValue }) => {
    try {
      const response = await emissionService.getEmissionsByYearRange(startYear, endYear);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions data by year range');
    }
  }
);

// Async thunk for fetching emissions statistics
export const fetchEmissionsStats = createAsyncThunk(
  'emissions/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await emissionService.getEmissionsStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch emissions statistics');
    }
  }
);

// Async thunk for creating new emissions data
export const createEmissionData = createAsyncThunk(
  'emissions/create',
  async (emissionData, { dispatch, rejectWithValue }) => {
    try {
      const response = await emissionService.createEmission(emissionData);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `Emissions data for year ${emissionData.year} created successfully`,
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to create emissions data',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to create emissions data');
    }
  }
);

// Async thunk for updating emissions data
export const updateEmissionData = createAsyncThunk(
  'emissions/update',
  async ({ year, emissionData }, { dispatch, rejectWithValue }) => {
    try {
      const response = await emissionService.updateEmission(year, emissionData);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `Emissions data for year ${year} updated successfully`,
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || `Failed to update emissions data for year ${year}`,
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to update emissions data');
    }
  }
);

// Async thunk for deleting emissions data
export const deleteEmissionData = createAsyncThunk(
  'emissions/delete',
  async (year, { dispatch, rejectWithValue }) => {
    try {
      const response = await emissionService.deleteEmission(year);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `Emissions data for year ${year} deleted successfully`,
        severity: 'success'
      }));
      
      return { year, ...response };
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || `Failed to delete emissions data for year ${year}`,
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to delete emissions data');
    }
  }
);

// Async thunk for bulk importing emissions data
export const bulkImportEmissionsData = createAsyncThunk(
  'emissions/bulkImport',
  async ({ data, overwrite }, { dispatch, rejectWithValue }) => {
    try {
      const response = await emissionService.bulkImportEmissions(data, overwrite);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `Successfully imported emissions data: ${response.results.created.length} created, ${response.results.updated.length} updated`,
        severity: 'success'
      }));
      
      return response;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to import emissions data',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to import emissions data');
    }
  }
);

// Initial state
const initialState = {
  emissions: [],
  stats: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Emissions slice
const emissionSlice = createSlice({
  name: 'emissions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all emissions
      .addCase(fetchAllEmissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEmissions.fulfilled, (state, action) => {
        state.loading = false;
        state.emissions = action.payload;
      })
      .addCase(fetchAllEmissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch emissions data';
      })
      
      // Fetch emissions by year range
      .addCase(fetchEmissionsByYearRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmissionsByYearRange.fulfilled, (state, action) => {
        state.loading = false;
        state.emissions = action.payload;
      })
      .addCase(fetchEmissionsByYearRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch emissions data by year range';
      })
      
      // Fetch emissions statistics
      .addCase(fetchEmissionsStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmissionsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchEmissionsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch emissions statistics';
      })
      
      // Create emissions data
      .addCase(createEmissionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmissionData.fulfilled, (state, action) => {
        state.loading = false;
        state.emissions.push(action.payload);
        state.successMessage = `Emissions data for year ${action.payload.year} created successfully`;
      })
      .addCase(createEmissionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create emissions data';
      })
      
      // Update emissions data
      .addCase(updateEmissionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmissionData.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the emissions array with the updated data
        const updatedEmission = action.payload;
        state.emissions = state.emissions.map(emission => 
          emission.year === updatedEmission.year ? updatedEmission : emission
        );
        
        state.successMessage = `Emissions data for year ${updatedEmission.year} updated successfully`;
      })
      .addCase(updateEmissionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update emissions data';
      })
      
      // Delete emissions data
      .addCase(deleteEmissionData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmissionData.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove the deleted emission from the array
        const year = action.payload.year;
        state.emissions = state.emissions.filter(emission => emission.year !== parseInt(year));
        
        state.successMessage = `Emissions data for year ${year} deleted successfully`;
      })
      .addCase(deleteEmissionData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete emissions data';
      })
      
      // Bulk import emissions data
      .addCase(bulkImportEmissionsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkImportEmissionsData.fulfilled, (state, action) => {
        state.loading = false;
        
        // Refetch all emissions data after bulk import
        // We'll need to dispatch fetchAllEmissions separately after this action completes
        
        state.successMessage = `Successfully imported emissions data: ${action.payload.results.created.length} created, ${action.payload.results.updated.length} updated`;
      })
      .addCase(bulkImportEmissionsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to import emissions data';
      });
  },
});

export const { clearError, clearSuccessMessage, setSuccessMessage } = emissionSlice.actions;
export default emissionSlice.reducer;