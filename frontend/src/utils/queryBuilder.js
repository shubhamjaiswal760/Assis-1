/**
 * Build query parameters for API calls
 */
export const buildQueryParams = (filters, search, sortBy, sortOrder, page) => {
  const params = {
    page: page || 1,
    pageSize: 10
  };

  // Add search
  if (search && search.trim()) {
    params.search = search.trim();
  }

  // Add sorting
  if (sortBy) {
    params.sortBy = sortBy;
    params.sortOrder = sortOrder || 'desc';
  }

  // Add filters
  if (filters.regions && filters.regions.length > 0) {
    params.regions = filters.regions.join(',');
  }

  if (filters.genders && filters.genders.length > 0) {
    params.genders = filters.genders.join(',');
  }

  if (filters.categories && filters.categories.length > 0) {
    params.categories = filters.categories.join(',');
  }

  if (filters.tags && filters.tags.length > 0) {
    params.tags = filters.tags.join(',');
  }

  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    params.paymentMethods = filters.paymentMethods.join(',');
  }

  if (filters.ageRange) {
    if (filters.ageRange.min !== undefined && filters.ageRange.min !== '') {
      params.ageMin = filters.ageRange.min;
    }
    if (filters.ageRange.max !== undefined && filters.ageRange.max !== '') {
      params.ageMax = filters.ageRange.max;
    }
  }

  if (filters.dateRange) {
    if (filters.dateRange.start) {
      params.dateStart = filters.dateRange.start;
    }
    if (filters.dateRange.end) {
      params.dateEnd = filters.dateRange.end;
    }
  }

  return params;
};

