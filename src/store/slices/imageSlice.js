// src/store/slices/imageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import imageService from '../../services/imageService';
import { showSnackbar } from './notificationSlice';

// Async thunk for uploading an image
export const uploadImage = createAsyncThunk(
  'images/upload',
  async ({ file, category, purpose, metadata }, { dispatch, rejectWithValue }) => {
    try {
      const response = await imageService.uploadImage(file, category, purpose, metadata);
      
      // Show success notification
      dispatch(showSnackbar({
        message: 'Image uploaded successfully',
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to upload image',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

// Async thunk for uploading a base64 image
export const uploadBase64Image = createAsyncThunk(
  'images/uploadBase64',
  async ({ base64Image, originalName, category, purpose, metadata }, { dispatch, rejectWithValue }) => {
    try {
      const response = await imageService.uploadBase64Image(base64Image, originalName, category, purpose, metadata);
      
      // Show success notification
      dispatch(showSnackbar({
        message: 'Image uploaded successfully',
        severity: 'success'
      }));
      
      return response.data;
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to upload image',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to upload image');
    }
  }
);

// Async thunk for fetching images by category
export const fetchImagesByCategory = createAsyncThunk(
  'images/fetchByCategory',
  async ({ category, purpose }, { rejectWithValue }) => {
    try {
      const response = await imageService.getImagesByCategory(category, purpose);
      return { category, purpose, images: response.data };
    } catch (error) {
      return rejectWithValue(error.message || `Failed to fetch ${category} images`);
    }
  }
);

// Async thunk for deleting an image
export const deleteImage = createAsyncThunk(
  'images/delete',
  async ({ id, forceDelete }, { dispatch, rejectWithValue }) => {
    try {
      const response = await imageService.deleteImage(id, forceDelete);
      
      // Show success notification
      dispatch(showSnackbar({
        message: 'Image deleted successfully',
        severity: 'success'
      }));
      
      return { id, ...response };
    } catch (error) {
      // Show error notification
      dispatch(showSnackbar({
        message: error.message || 'Failed to delete image',
        severity: 'error'
      }));
      
      return rejectWithValue(error.message || 'Failed to delete image');
    }
  }
);

// Initial state
const initialState = {
  images: {},  // Organized by category
  currentImage: null,
  loading: false,
  error: null,
};

// Image slice
const imageSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentImage: (state, action) => {
      state.currentImage = action.payload;
    },
    clearCurrentImage: (state) => {
      state.currentImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload image cases
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        const { category } = action.payload;
        
        // Add the new image to the images state
        if (!state.images[category]) {
          state.images[category] = [];
        }
        
        state.images[category].unshift(action.payload);
        state.currentImage = action.payload;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Upload base64 image cases (same logic as uploadImage)
      .addCase(uploadBase64Image.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadBase64Image.fulfilled, (state, action) => {
        state.loading = false;
        const { category } = action.payload;
        
        if (!state.images[category]) {
          state.images[category] = [];
        }
        
        state.images[category].unshift(action.payload);
        state.currentImage = action.payload;
      })
      .addCase(uploadBase64Image.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch images by category cases
      .addCase(fetchImagesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImagesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { category, images } = action.payload;
        
        // Store images organized by category
        state.images[category] = images;
      })
      .addCase(fetchImagesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete image cases
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        const { id } = action.payload;
        
        // Remove the deleted image from all categories
        Object.keys(state.images).forEach(category => {
          state.images[category] = state.images[category].filter(img => img.id !== id);
        });
        
        // Clear current image if it's the one that was deleted
        if (state.currentImage && state.currentImage.id === id) {
          state.currentImage = null;
        }
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentImage, clearCurrentImage } = imageSlice.actions;
export default imageSlice.reducer;