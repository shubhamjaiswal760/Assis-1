import React, { useState } from 'react';
import { uploadCSVFile } from '../services/api';

const DataUploader = ({ onDataUploaded }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };


  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Check file size (limit to 500MB to handle large datasets)
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      setError(`File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds 500MB limit. Please use a smaller file.`);
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);
    setProgress(`Uploading file (${(file.size / 1024 / 1024).toFixed(2)}MB)...`);

    try {
      // Upload file directly to server for server-side parsing
      const response = await uploadCSVFile(file, (percent) => {
        setProgress(`Uploading: ${percent}%`);
      });

      setProgress('Processing CSV file on server...');

      if (response.success) {
        setSuccess(true);
        setProgress('');
        if (onDataUploaded) {
          onDataUploaded();
        }
      } else {
        setError(response.message || 'Failed to upload and process file');
        setProgress('');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setProgress('');
      let errorMsg = 'Unknown error';
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err.message) {
        errorMsg = err.message;
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMsg = 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5000';
      }
      
      setError('Error uploading file: ' + errorMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Sales Data</h2>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select CSV File
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            !file || uploading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
      {progress && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm">
          {progress}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          Data uploaded successfully!
        </div>
      )}
    </div>
  );
};

export default DataUploader;

