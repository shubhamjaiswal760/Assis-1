import {
  searchSales,
  filterSales,
  sortSales,
  paginateSales,
  getFilterOptions
} from '../services/salesService.js';
import { parseCSVStream } from '../utils/dataLoader.js';
import fs from 'fs';

// In-memory storage for sales data
let salesData = [];

/**
 * Set sales data (called when data is uploaded)
 */
export const setSalesData = (data) => {
  salesData = data;
};

/**
 * Get all sales data with search, filter, sort, and pagination
 */
export const getSales = (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      pageSize = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      regions = '',
      genders = '',
      categories = '',
      tags = '',
      paymentMethods = '',
      ageMin = '',
      ageMax = '',
      dateStart = '',
      dateEnd = ''
    } = req.query;
    
    console.log('=== getSales called ===');
    console.log('Query params:', { regions, genders, categories, paymentMethods, ageMin, ageMax });
    console.log('Sales data length:', salesData.length);
    if (salesData.length > 0) {
      console.log('First record keys:', Object.keys(salesData[0]));
      console.log('First record:', salesData[0]);
    }
    
    // Start with all data
    let result = [...salesData];
    
    // Apply search
    if (search) {
      result = searchSales(result, search);
    }
    
    // Build filters object
    const filters = {};
    
    if (regions) {
      filters.regions = regions.split(',').filter(r => r.trim());
    }
    
    if (genders) {
      filters.genders = genders.split(',').filter(g => g.trim());
    }
    
    if (categories) {
      filters.categories = categories.split(',').filter(c => c.trim());
    }
    
    if (tags) {
      filters.tags = tags.split(',').filter(t => t.trim());
    }
    
    if (paymentMethods) {
      filters.paymentMethods = paymentMethods.split(',').filter(p => p.trim());
    }
    
    if (ageMin || ageMax) {
      filters.ageRange = {};
      if (ageMin) filters.ageRange.min = parseInt(ageMin);
      if (ageMax) filters.ageRange.max = parseInt(ageMax);
    }
    
    if (dateStart || dateEnd) {
      filters.dateRange = {};
      if (dateStart) filters.dateRange.start = dateStart;
      if (dateEnd) filters.dateRange.end = dateEnd;
    }
    
    console.log('Built filters:', JSON.stringify(filters, null, 2));
    
    // Apply filters
    if (Object.keys(filters).length > 0) {
      result = filterSales(result, filters);
      console.log('After filtering:', result.length, 'records');
    }
    
    // Apply sorting
    result = sortSales(result, sortBy, sortOrder);
    
    // Apply pagination
    const paginated = paginateSales(result, parseInt(page), parseInt(pageSize));
    
    res.json({
      success: true,
      data: paginated.data,
      pagination: paginated.pagination
    });
  } catch (error) {
    console.error('Error getting sales:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sales data',
      error: error.message
    });
  }
};

/**
 * Get filter options
 */
export const getFilters = (req, res) => {
  try {
    console.log('getFilters endpoint called');
    console.log('salesData length:', salesData.length);
    const options = getFilterOptions(salesData);
    console.log('Filter options returned:', options);
    res.json({
      success: true,
      data: options
    });
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching filter options',
      error: error.message
    });
  }
};

/**
 * Upload/Set sales data (JSON array)
 */
export const uploadSalesData = (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !Array.isArray(data)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid data format. Expected an array.'
      });
    }
    
    setSalesData(data);
    
    res.json({
      success: true,
      message: `Successfully loaded ${data.length} sales records`,
      count: data.length
    });
  } catch (error) {
    console.error('Error uploading sales data:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading sales data',
      error: error.message
    });
  }
};

/**
 * Upload CSV file and parse on server
 */
export const uploadCSVFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    console.log(`Processing CSV file: ${req.file.originalname} (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);

    // Parse CSV using streaming (memory efficient)
    console.log('Parsing CSV using streaming parser...');
    const data = await parseCSVStream(req.file.path);
    
    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    if (!data || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid data found in CSV file'
      });
    }

    console.log(`Parsed ${data.length} records from CSV`);
    
    // Store the data
    setSalesData(data);
    
    res.json({
      success: true,
      message: `Successfully loaded ${data.length} sales records from CSV`,
      count: data.length
    });
  } catch (error) {
    // Clean up file if it exists
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
    }
    
    console.error('Error processing CSV file:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing CSV file',
      error: error.message
    });
  }
};

