// src/services/emissionService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: `${API_URL}/api/emissions`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Create a non-auth axios instance for public routes
const createPublicInstance = () => {
  return axios.create({
    baseURL: `${API_URL}/api/emissions`,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Fetch all emissions data (public route)
export const getAllEmissions = async (params = {}) => {
  try {
    const instance = createPublicInstance();
    const response = await instance.get('/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions data' };
  }
};

// Fetch emissions data for a specific year (public route)
export const getEmissionByYear = async (year) => {
  try {
    const instance = createPublicInstance();
    const response = await instance.get(`/${year}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching emissions data for year ${year}` };
  }
};

// Fetch emissions statistics (public route)
export const getEmissionsStats = async () => {
  try {
    const instance = createPublicInstance();
    const response = await instance.get('/stats/summary');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions statistics' };
  }
};

// Create new emissions data (protected route)
export const createEmission = async (emissionData) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.post('/', emissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error creating emissions data' };
  }
};

// Update emissions data for a specific year (protected route)
export const updateEmission = async (year, emissionData) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.put(`/${year}`, emissionData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error updating emissions data for year ${year}` };
  }
};

// Delete emissions data for a specific year (protected route)
export const deleteEmission = async (year) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.delete(`/${year}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error deleting emissions data for year ${year}` };
  }
};

// Bulk import emissions data (protected route)
export const bulkImportEmissions = async (data, overwrite = false) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.post('/bulk-import', { data, overwrite });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error importing emissions data' };
  }
};

// Fetch emissions data with year range filter (public route)
export const getEmissionsByYearRange = async (startYear, endYear) => {
  try {
    const instance = createPublicInstance();
    const response = await instance.get('/', { 
      params: { startYear, endYear } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching emissions data by year range' };
  }
};

export default {
  getAllEmissions,
  getEmissionByYear,
  getEmissionsStats,
  createEmission,
  updateEmission,
  deleteEmission,
  bulkImportEmissions,
  getEmissionsByYearRange
};