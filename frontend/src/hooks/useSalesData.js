import { useState, useEffect, useCallback } from 'react';
import { getSales, getFilterOptions } from '../services/api';

export const useSalesData = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [filterOptions, setFilterOptions] = useState({
    regions: ['North', 'South', 'East', 'West', 'Central'],
    genders: ['Male', 'Female', 'Other'],
    categories: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Food & Beverages', 'Beauty', 'Books', 'Toys'],
    tags: ['On Sale', 'New', 'Popular', 'Limited Edition', 'Premium', 'Budget Friendly'],
    paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Wallet', 'Bank Transfer'],
    ageRange: { min: 0, max: 100 }
  });

  // Fetch filter options
  const loadFilterOptions = useCallback(async () => {
    try {
      const response = await getFilterOptions();
      console.log('Filter options response:', response);
      if (response.success) {
        setFilterOptions(response.data);
        console.log('Filter options loaded:', response.data);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  }, []);

  // Fetch filter options on mount
  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // Fetch sales data
  const fetchSales = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSales(params);
      if (response.success) {
        setSales(response.data);
        setPagination(response.pagination);
        // Also load filter options whenever data is fetched
        loadFilterOptions();
      } else {
        setError('Failed to fetch sales data');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching sales data');
      setSales([]);
    } finally {
      setLoading(false);
    }
  }, [loadFilterOptions]);

  return {
    sales,
    loading,
    error,
    pagination,
    filterOptions,
    fetchSales
  };
};

