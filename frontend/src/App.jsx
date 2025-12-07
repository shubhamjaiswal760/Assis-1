import React, { useState, useEffect, useCallback } from 'react';
import { useSalesData } from './hooks/useSalesData';
import { buildQueryParams } from './utils/queryBuilder';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import SortingDropdown from './components/SortingDropdown';
import TransactionTable from './components/TransactionTable';
import PaginationControls from './components/PaginationControls';
import DataUploader from './components/DataUploader';

function App() {
  const { sales, loading, error, pagination, filterOptions, fetchSales } = useSalesData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on search
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Load data when filters, sort, or page changes
  useEffect(() => {
    loadData();
  }, [filters, sortBy, sortOrder, currentPage]);

  const loadData = useCallback(() => {
    const params = buildQueryParams(filters, searchTerm, sortBy, sortOrder, currentPage);
    console.log('Loading data with params:', params);
    console.log('Current filters:', filters);
    fetchSales(params);
  }, [filters, searchTerm, sortBy, sortOrder, currentPage, fetchSales]);

  const handleFilterChange = (filterKey, value) => {
    console.log('Filter changed:', filterKey, value);
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDataUploaded = () => {
    // Reload data after upload
    loadData();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Retail Sales Management System</h1>
          <p className="text-gray-600 mt-2">Manage and analyze your sales data efficiently</p>
        </header>

        <DataUploader onDataUploaded={handleDataUploaded} />

        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              filterOptions={filterOptions}
              activeFilters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            <SortingDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <TransactionTable sales={sales} loading={loading} />

            <PaginationControls
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

