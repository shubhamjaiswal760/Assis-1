import React from 'react';

const SortingDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const sortOptions = [
    { value: 'date', label: 'Date (Newest First)', defaultOrder: 'desc' },
    { value: 'quantity', label: 'Quantity', defaultOrder: 'desc' },
    { value: 'customerName', label: 'Customer Name (A-Z)', defaultOrder: 'asc' }
  ];

  const handleSortChange = (e) => {
    const selectedOption = sortOptions.find(opt => opt.value === e.target.value);
    if (selectedOption) {
      onSortChange(selectedOption.value, selectedOption.defaultOrder);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <select
        value={sortBy || ''}
        onChange={handleSortChange}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
      >
        <option value="">Select sorting option...</option>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortingDropdown;

