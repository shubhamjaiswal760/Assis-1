import express from 'express';
import multer from 'multer';
import os from 'os';
import {
  getSales,
  getFilters,
  uploadSalesData,
  uploadCSVFile
} from '../controllers/salesController.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use system temp directory
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    cb(null, `csv_${Date.now()}_${Math.random().toString(36).substring(7)}.csv`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024 // 500MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.mimetype === 'application/vnd.ms-excel' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'), false);
    }
  }
});

// Get sales data with search, filter, sort, and pagination
router.get('/', getSales);

// Get filter options
router.get('/filters', getFilters);

// Upload/Set sales data (JSON array)
router.post('/upload', uploadSalesData);

// Upload CSV file (server-side parsing)
router.post('/upload-csv', (req, res, next) => {
  upload.single('csvfile')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            message: 'File size exceeds 500MB limit'
          });
        }
      }
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
}, uploadCSVFile);

export default router;

