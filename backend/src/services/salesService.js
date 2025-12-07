/**
 * Sales Service - Business logic for sales data operations
 */

/**
 * Search sales data by customer name or phone number
 */
export const searchSales = (data, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }
  
  const term = searchTerm.toLowerCase().trim();
  
  return data.filter(item => {
    const customerName = (item['CustomerName'] || item['Customer Name'] || '').toLowerCase();
    const phoneNumber = (item['PhoneNumber'] || item['Phone Number'] || '').toLowerCase();
    
    return customerName.includes(term) || phoneNumber.includes(term);
  });
};

/**
 * Filter sales data based on multiple criteria
 */
export const filterSales = (data, filters) => {
  if (!filters || Object.keys(filters).length === 0) {
    return data;
  }
  
  return data.filter(item => {
    // Region filter - check both formats (with and without spaces)
    if (filters.regions && filters.regions.length > 0) {
      const region = (item['CustomerRegion'] || item['Customer Region'] || '').trim().toLowerCase();
      const matchesRegion = filters.regions.some(selectedRegion => 
        region === selectedRegion.toLowerCase()
      );
      if (!matchesRegion) {
        return false;
      }
    }
    
    // Gender filter
    if (filters.genders && filters.genders.length > 0) {
      const gender = (item['Gender'] || '').trim().toLowerCase();
      const matchesGender = filters.genders.some(selectedGender => 
        gender === selectedGender.toLowerCase()
      );
      if (!matchesGender) {
        return false;
      }
    }
    
    // Age Range filter
    if (filters.ageRange) {
      const age = parseInt(item['Age'] || 0);
      if (filters.ageRange.min !== undefined && age < filters.ageRange.min) {
        return false;
      }
      if (filters.ageRange.max !== undefined && age > filters.ageRange.max) {
        return false;
      }
    }
    
    // Product Category filter - check both formats
    if (filters.categories && filters.categories.length > 0) {
      const category = (item['ProductCategory'] || item['Product Category'] || '').trim().toLowerCase();
      const matchesCategory = filters.categories.some(selectedCategory => 
        category === selectedCategory.toLowerCase()
      );
      if (!matchesCategory) {
        return false;
      }
    }
    
    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const itemTags = (item['Tags'] || '').split(',').map(t => t.trim().toLowerCase());
      const hasMatchingTag = filters.tags.some(tag => 
        itemTags.includes(tag.toLowerCase())
      );
      if (!hasMatchingTag) {
        return false;
      }
    }
    
    // Payment Method filter - check both formats
    if (filters.paymentMethods && filters.paymentMethods.length > 0) {
      const paymentMethod = (item['PaymentMethod'] || item['Payment Method'] || '').trim().toLowerCase();
      const matchesPayment = filters.paymentMethods.some(selectedMethod => 
        paymentMethod === selectedMethod.toLowerCase()
      );
      if (!matchesPayment) {
        return false;
      }
    }
    
    // Date Range filter
    if (filters.dateRange) {
      const itemDate = new Date(item['Date'] || '');
      if (filters.dateRange.start && itemDate < new Date(filters.dateRange.start)) {
        return false;
      }
      if (filters.dateRange.end && itemDate > new Date(filters.dateRange.end)) {
        return false;
      }
    }
    
    return true;
    
    return true;
  });
};

/**
 * Sort sales data
 */
export const sortSales = (data, sortBy, sortOrder = 'asc') => {
  if (!sortBy) {
    return data;
  }
  
  const sorted = [...data];
  
  sorted.sort((a, b) => {
    let aValue, bValue;
    
    switch (sortBy) {
      case 'date':
        aValue = new Date(a['Date'] || 0);
        bValue = new Date(b['Date'] || 0);
        break;
      case 'quantity':
        aValue = parseFloat(a['Quantity'] || 0);
        bValue = parseFloat(b['Quantity'] || 0);
        break;
      case 'customerName':
        aValue = (a['CustomerName'] || a['Customer Name'] || '').toLowerCase();
        bValue = (b['CustomerName'] || b['Customer Name'] || '').toLowerCase();
        break;
      default:
        return 0;
    }
    
    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  return sorted;
};

/**
 * Paginate sales data
 */
export const paginateSales = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  return {
    data: data.slice(startIndex, endIndex),
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      hasNextPage: endIndex < data.length,
      hasPreviousPage: page > 1
    }
  };
};

/**
 * Get filter options - using hardcoded values for reliability
 */
export const getFilterOptions = (data) => {
  let minAge = 18;
  let maxAge = 100;
  
  // Calculate actual age range from data
  if (data && data.length > 0) {
    let foundMinAge = Infinity;
    let foundMaxAge = -Infinity;
    
    data.forEach(item => {
      // Try both possible column names
      const age = parseInt(item['Age'] || item['CustomerAge'] || 0);
      if (age > 0) {
        foundMinAge = Math.min(foundMinAge, age);
        foundMaxAge = Math.max(foundMaxAge, age);
      }
    });
    
    if (foundMinAge !== Infinity) minAge = foundMinAge;
    if (foundMaxAge !== -Infinity) maxAge = foundMaxAge;
  }
  
  // Hardcoded filter options - these are manually defined
  const filterOptions = {
    regions: ['North', 'South', 'East', 'West', 'Central'],
    genders: ['Male', 'Female', 'Other'],
    categories: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Food & Beverages', 'Beauty', 'Books', 'Toys'],
    tags: ['On Sale', 'New', 'Popular', 'Limited Edition', 'Premium', 'Budget Friendly'],
    paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'UPI', 'Wallet', 'Bank Transfer'],
    ageRange: {
      min: minAge,
      max: maxAge
    }
  };
  
  console.log('Filter options loaded (hardcoded)');
  console.log('Regions:', filterOptions.regions);
  console.log('Genders:', filterOptions.genders);
  console.log('Categories:', filterOptions.categories);
  console.log('Age Range:', filterOptions.ageRange);
  
  return filterOptions;
};

