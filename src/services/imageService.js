// src/services/imageService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: `${API_URL}/api/images`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Create multipart form instance for file uploads
const createMultipartInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: `${API_URL}/api/images`,
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Upload image file
export const uploadImage = async (imageFile, category, purpose, metadata = {}) => {
  try {
    const instance = createMultipartInstance();
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('category', category);
    formData.append('purpose', purpose);
    
    // Add optional metadata
    if (metadata.altText) formData.append('altText', metadata.altText);
    if (metadata.description) formData.append('description', metadata.description);
    if (metadata.entityId) formData.append('entityId', metadata.entityId);
    
    const response = await instance.post('/upload', formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading image' };
  }
};

// Upload image as base64
export const uploadBase64Image = async (base64Image, originalName, category, purpose, metadata = {}) => {
  try {
    const instance = createAuthInstance();
    const payload = {
      base64Image,
      originalName,
      category,
      purpose,
      ...metadata
    };
    
    const response = await instance.post('/upload', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading image' };
  }
};

// Get all images with optional filters
export const getAllImages = async (filters = {}) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get('/', { params: filters });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching images' };
  }
};

// Get images by category
export const getImagesByCategory = async (category, purpose = null) => {
  try {
    const instance = createAuthInstance();
    const params = purpose ? { purpose } : {};
    const response = await instance.get(`/category/${category}`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${category} images` };
  }
};

// Get single image by ID
export const getImageById = async (id) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching image' };
  }
};

// Update image metadata
export const updateImage = async (id, metadata) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.put(`/${id}`, metadata);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating image' };
  }
};

// Replace image
export const replaceImage = async (id, imageFile) => {
  try {
    const instance = createMultipartInstance();
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await instance.put(`/${id}/replace`, formData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error replacing image' };
  }
};

// Replace image with base64
export const replaceImageWithBase64 = async (id, base64Image, originalName = null) => {
  try {
    const instance = createAuthInstance();
    const payload = { base64Image };
    if (originalName) payload.originalName = originalName;
    
    const response = await instance.put(`/${id}/replace`, payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error replacing image' };
  }
};

// Delete image
export const deleteImage = async (id, forceDelete = false) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.delete(`/${id}`, { 
      params: { forceDelete } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting image' };
  }
};

// Get image statistics
export const getImageStats = async () => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get('/stats/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching image statistics' };
  }
};

export default {
  uploadImage,
  uploadBase64Image,
  getAllImages,
  getImagesByCategory,
  getImageById,
  updateImage,
  replaceImage,
  replaceImageWithBase64,
  deleteImage,
  getImageStats
};