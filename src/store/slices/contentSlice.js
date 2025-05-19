// src/store/slices/contentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';
import { showSnackbar } from './notificationSlice';

// Async thunk for fetching all content
export const fetchAllContent = createAsyncThunk(
  'content/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contentService.getAllContent();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch content');
    }
  }
);

// Async thunk for fetching content by section
export const fetchContentBySection = createAsyncThunk(
  'content/fetchBySection',
  async (section, { rejectWithValue }) => {
    try {
      const response = await contentService.getContentBySection(section);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${section} content`);
    }
  }
);

// Async thunk for updating content
export const updateSectionContent = createAsyncThunk(
  'content/update',
  async ({ section, content }, { dispatch, rejectWithValue }) => {
    try {
      const response = await contentService.updateContent(section, content);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `${section} content updated successfully`,
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || `Failed to update ${section} content`,
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || `Failed to update ${section} content`);
    }
  }
);

// Async thunk for deleting content
export const deleteSectionContent = createAsyncThunk(
  'content/delete',
  async (section, { dispatch, rejectWithValue }) => {
    try {
      const response = await contentService.deleteContent(section);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `${section} content deleted successfully`,
        severity: 'success'
      }));
      
      return { section, ...response };
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || `Failed to delete ${section} content`,
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || `Failed to delete ${section} content`);
    }
  }
);

// Async thunk for fetching content history
export const fetchContentHistory = createAsyncThunk(
  'content/fetchHistory',
  async (section, { rejectWithValue }) => {
    try {
      const response = await contentService.getContentHistory(section);
      return { section, history: response.data };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${section} content history`);
    }
  }
);

// Async thunk for restoring content
export const restoreContentVersion = createAsyncThunk(
  'content/restore',
  async ({ contentId, section }, { dispatch, rejectWithValue }) => {
    try {
      const response = await contentService.restoreContent(contentId);
      
      // Show success notification
      dispatch(showSnackbar({
        message: `${section} content restored successfully`,
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to restore content version',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to restore content version');
    }
  }
);

// Initial state
const initialState = {
  sections: {},
  history: {},
  loading: false,
  error: null,
  successMessage: null,
};

// Content slice
const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all content
      .addCase(fetchAllContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContent.fulfilled, (state, action) => {
        state.loading = false;
        
        // Transform array to object with section as key
        const sections = {};
        action.payload.forEach(item => {
          sections[item.section] = item.content;
        });
        
        state.sections = sections;
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content';
      })
      
      // Fetch content by section
      .addCase(fetchContentBySection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentBySection.fulfilled, (state, action) => {
        state.loading = false;
        state.sections[action.meta.arg] = action.payload.content;
      })
      .addCase(fetchContentBySection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || `Failed to fetch ${action.meta.arg} content`;
      })
      
      // Update content
      .addCase(updateSectionContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSectionContent.fulfilled, (state, action) => {
        state.loading = false;
        state.sections[action.payload.section] = action.payload.content;
        state.successMessage = `${action.payload.section} content updated successfully`;
      })
      .addCase(updateSectionContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update content';
      })
      
      // Delete content
      .addCase(deleteSectionContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSectionContent.fulfilled, (state, action) => {
        state.loading = false;
        delete state.sections[action.payload.section];
        state.successMessage = `${action.payload.section} content deleted successfully`;
      })
      .addCase(deleteSectionContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete content';
      })
      
      // Fetch content history
      .addCase(fetchContentHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history[action.payload.section] = action.payload.history;
      })
      .addCase(fetchContentHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch content history';
      })
      
      // Restore content
      .addCase(restoreContentVersion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreContentVersion.fulfilled, (state, action) => {
        state.loading = false;
        state.sections[action.payload.section] = action.payload.content;
        state.successMessage = `${action.payload.section} content restored successfully`;
      })
      .addCase(restoreContentVersion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to restore content version';
      });
  },
});

export const { clearError, clearSuccessMessage } = contentSlice.actions;
export default contentSlice.reducer;