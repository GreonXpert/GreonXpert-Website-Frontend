// src/services/contentService.js
import axios from 'axios';
import { getAuthToken } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with auth headers
const createAuthInstance = () => {
  const token = getAuthToken();
  return axios.create({
    baseURL: `${API_URL}/api/content`,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

// Get all content sections
export const getAllContent = async () => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching content' };
  }
};

// Get content for a specific section
export const getContentBySection = async (section) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get(`/${section}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${section} content` };
  }
};

// Update content for a section
export const updateContent = async (section, contentData) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.post(`/${section}`, {
      content: contentData
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error updating ${section} content` };
  }
};

// Delete content for a section
export const deleteContent = async (section) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.delete(`/${section}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error deleting ${section} content` };
  }
};

// Get content history for a section
export const getContentHistory = async (section) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.get(`/${section}/history`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: `Error fetching ${section} content history` };
  }
};

// Restore a previous content version
export const restoreContent = async (contentId) => {
  try {
    const instance = createAuthInstance();
    const response = await instance.post(`/restore/${contentId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error restoring content version' };
  }
};

export default {
  getAllContent,
  getContentBySection,
  updateContent,
  deleteContent,
  getContentHistory,
  restoreContent
};