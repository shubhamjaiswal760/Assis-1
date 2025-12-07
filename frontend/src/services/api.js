import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get sales data with query parameters
 */
export const getSales = async (params = {}) => {
  try {
    const response = await api.get('/sales', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

/**
 * Get filter options
 */
export const getFilterOptions = async () => {
  try {
    const response = await api.get('/sales/filters');
    return response.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw error;
  }
};

/**
 * Upload sales data (JSON array)
 */
export const uploadSalesData = async (data) => {
  try {
    const response = await api.post('/sales/upload', { data });
    return response.data;
  } catch (error) {
    console.error('Error uploading sales data:', error);
    throw error;
  }
};

/**
 * Test server connection
 */
export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`);
    return response.data;
  } catch (error) {
    throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:5000');
  }
};

/**
 * Upload CSV file (server-side parsing)
 */
export const uploadCSVFile = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('csvfile', file);

    // Create a separate axios instance for file uploads without default JSON headers
    const uploadApi = axios.create({
      baseURL: API_BASE_URL,
      timeout: 600000, // 10 minutes timeout for large files
    });

    const response = await uploadApi.post('/sales/upload-csv', formData, {
      // Don't set Content-Type - axios will set it automatically with boundary for multipart/form-data
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading CSV file:', error);
    
    // Provide more detailed error information
    if (error.code === 'ECONNABORTED') {
      throw new Error('Upload timeout. The file is too large or the server is taking too long to respond.');
    } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      throw new Error('Network error. Please check if the backend server is running on http://localhost:5000');
    } else if (error.response) {
      // Server responded with error status
      throw new Error(error.response.data?.message || error.response.data?.error || `Server error: ${error.response.status}`);
    } else {
      throw error;
    }
  }
};

