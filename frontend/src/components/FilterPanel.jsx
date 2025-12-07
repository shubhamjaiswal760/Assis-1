import React, { useState } from 'react';

const FilterPanel = ({ filterOptions, activeFilters, onFilterChange, onClearFilters }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggleFilter = (filterKey, value) => {
    const currentValues = activeFilters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterKey, newValues);
  };

  const handleAgeRangeChange = (type, value) => {
    const currentRange = activeFilters.ageRange || {};
    onFilterChange('ageRange', {
      ...currentRange,
      [type]: value ? parseInt(value) : undefined
    });
  };

  const handleDateRangeChange = (type, value) => {
    const currentRange = activeFilters.dateRange || {};
    onFilterChange('dateRange', {
      ...currentRange,
      [type]: value || undefined
    });
  };

  const FilterSection = ({ title, filterKey, options }) => {
    const selectedValues = activeFilters[filterKey] || [];
    const selectedCount = selectedValues.length;

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {selectedCount > 0 && (
            <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {options && options.length > 0 ? (
            options.map(option => (
              <button
                key={option}
                onClick={() => handleToggleFilter(filterKey, option)}
                className={`px-4 py-2 rounded-full border-2 transition-all whitespace-nowrap ${
                  selectedValues.includes(option)
                    ? 'bg-blue-500 border-blue-500 text-white font-medium'
                    : 'bg-white border-gray-300 text-gray-700 hover:border-blue-300'
                }`}
              >
                {option}
              </button>
            ))
          ) : (
            <p className="text-sm text-gray-500">No options available</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
        <div className="flex gap-3">
          <button
            onClick={onClearFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 border border-blue-600 rounded-lg hover:bg-blue-50"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-600 hover:text-gray-800 text-lg"
          >
            {isOpen ? '−' : '+'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-6">
          {/* Gender */}
          <FilterSection
            title="Gender"
            filterKey="genders"
            options={filterOptions.genders}
          />

          {/* Customer Region */}
          <FilterSection
            title="Customer Region"
            filterKey="regions"
            options={filterOptions.regions}
          />

          {/* Product Category */}
          <FilterSection
            title="Product Category"
            filterKey="categories"
            options={filterOptions.categories}
          />

          {/* Tags */}
          <FilterSection
            title="Tags"
            filterKey="tags"
            options={filterOptions.tags}
          />

          {/* Payment Method */}
          <FilterSection
            title="Payment Method"
            filterKey="paymentMethods"
            options={filterOptions.paymentMethods}
          />

          {/* Age Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Age Range</h3>
              {(activeFilters.ageRange?.min !== undefined || activeFilters.ageRange?.max !== undefined) && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                placeholder="Min Age"
                min={filterOptions.ageRange?.min || 0}
                max={filterOptions.ageRange?.max || 100}
                value={activeFilters.ageRange?.min || ''}
                onChange={(e) => handleAgeRangeChange('min', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                placeholder="Max Age"
                min={filterOptions.ageRange?.min || 0}
                max={filterOptions.ageRange?.max || 100}
                value={activeFilters.ageRange?.max || ''}
                onChange={(e) => handleAgeRangeChange('max', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Date Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Date Range</h3>
              {(activeFilters.dateRange?.start || activeFilters.dateRange?.end) && (
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={activeFilters.dateRange?.start || ''}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <span className="text-gray-400">to</span>
              <input
                type="date"
                value={activeFilters.dateRange?.end || ''}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;

