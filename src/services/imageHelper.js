// src/services/imageHelper.js

/**
 * Ensures that image URLs are fully qualified with the server domain
 * @param {string} url - The image URL to process
 * @returns {string} - A fully qualified URL
 */
export const getFullImageUrl = (url) => {
  if (!url) return '';
  
  // If the URL is already absolute, return it as is
  if (url.startsWith('http')) {
    return url;
  }
  
  // Add the server base URL for relative paths
  const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  return `${serverUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Creates a handler function for image loading errors
 * @param {Event} event - The error event
 */
export const handleImageError = (event) => {
  const target = event.target;
  
  // Prevent infinite loops
  target.onerror = null;
  
  // Log the error
  console.warn("Image failed to load:", target.src);
  
  // Find parent container with the fallback avatar
  const parent = target.closest('.image-container');
  if (parent) {
    // Hide the image
    target.style.display = 'none';
    
    // Show the fallback avatar
    const fallback = parent.querySelector('.fallback-avatar');
    if (fallback) {
      fallback.style.display = 'flex';
    }
  }
};

/**
 * Adds the correct CORS headers to an image request
 * @param {string} url - The image URL
 * @returns {string} - URL with CORS parameters
 */
export const addCorsToImageUrl = (url) => {
  // If it's an external URL, add CORS parameters
  if (url && url.startsWith('http') && !url.includes(window.location.hostname)) {
    // For some services that support CORS parameters
    if (url.includes('?')) {
      return `${url}&cors=true`;
    } else {
      return `${url}?cors=true`;
    }
  }
  return url;
};

export default {
  getFullImageUrl,
  handleImageError,
  addCorsToImageUrl
};