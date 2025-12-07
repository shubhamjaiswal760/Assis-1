import React, { useMemo } from 'react';

const TransactionTable = ({ sales, loading }) => {
  // Define the exact column sequence to display - these will be auto-cleaned by backend
  const columnSequence = [
    'TransactionID',
    'Date',
    'CustomerID',
    'CustomerName',
    'PhoneNumber',
    'Gender',
    'Age',
    'CustomerRegion',
    'CustomerType',
    'ProductID',
    'ProductName',
    'Brand',
    'ProductCategory',
    'Tags',
    'Quantity',
    'PriceperUnit',
    'DiscountPercentage',
    'TotalAmount',
    'FinalAmount',
    'PaymentMethod',
    'OrderStatus',
    'DeliveryType',
    'StoreID',
    'StoreLocation',
    'SalespersonID',
    'EmployeeName'
  ];

  // Get all unique column names from the data and filter by sequence
  const columns = useMemo(() => {
    if (!sales || sales.length === 0) return columnSequence;
    
    // Get first record to see actual column names
    const firstRecord = sales[0];
    const actualColumns = Object.keys(firstRecord);
    
    // Try to match with sequence - prioritize sequence order
    const orderedColumns = columnSequence.filter(col => actualColumns.includes(col));
    
    // If no matches found, use actual columns as they are
    if (orderedColumns.length === 0) {
      return actualColumns.sort();
    }
    
    // Add any remaining columns not in sequence
    const remainingColumns = actualColumns
      .filter(col => !columnSequence.includes(col))
      .sort();
    
    return [...orderedColumns, ...remainingColumns];
  }, [sales]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (sales.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-600">No sales data found</div>
      </div>
    );
  }

  // Format column header name
  const formatHeader = (header) => {
    return header
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Format cell value based on content type
  const formatCellValue = (value, columnName) => {
    if (value === null || value === undefined || value === '') {
      return '-';
    }

    // Format numeric values
    if (typeof value === 'number') {
      if (columnName.toLowerCase().includes('price') || 
          columnName.toLowerCase().includes('amount') ||
          columnName.toLowerCase().includes('total')) {
        return `$${parseFloat(value).toFixed(2)}`;
      }
      return value;
    }

    // Format percentage values
    if (columnName.toLowerCase().includes('discount') && 
        columnName.toLowerCase().includes('percentage')) {
      return `${value}%`;
    }

    return String(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {formatHeader(column)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sales.map((sale, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={`${index}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                  >
                    {formatCellValue(sale[column], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;

