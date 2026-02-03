// src/Pages/Colleges/CollegeList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import config from '../../config/config';
import CollegeCard from './CollegeCard';
import FilterSidebar from './FilterSidebar';
import FilterBar from './FilterBar';
import { Loader2, Filter, X } from 'lucide-react';

const CollegeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState(null);
  const [pagination, setPagination] = useState({});
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    ownership: searchParams.get('ownership')?.split(',') || [],
    listingType: searchParams.get('listingType')?.split(',') || [],
    location: searchParams.get('location') || '',
    minFees: searchParams.get('minFees') || '',
    maxFees: searchParams.get('maxFees') || '',
    minSalary: searchParams.get('minSalary') || '',
    maxSalary: searchParams.get('maxSalary') || '',
    minRating: searchParams.get('minRating') || '',
    exams: searchParams.get('exams')?.split(',') || [],
    minEligibilityX: searchParams.get('minEligibilityX') || '',
    minEligibilityXII: searchParams.get('minEligibilityXII') || '',
    workExpMin: searchParams.get('workExpMin') || '',
    workExpMax: searchParams.get('workExpMax') || '',
    page: parseInt(searchParams.get('page')) || 1
  });

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch colleges when filters change
  useEffect(() => {
    fetchColleges();
    updateURLParams();
  }, [filters]);

  const fetchFilterOptions = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/colleges/filter-options`);
      setFilterOptions(response.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const fetchColleges = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value);
          }
        }
      });

      const response = await axios.get(
        `${config.API_BASE_URL}/colleges/filter?${params.toString()}`
      );
      
      setColleges(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching colleges:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateURLParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : value !== '')) {
        if (Array.isArray(value)) {
          params.set(key, value.join(','));
        } else {
          params.set(key, value);
        }
      }
    });
    setSearchParams(params);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      ownership: [],
      listingType: [],
      location: '',
      minFees: '',
      maxFees: '',
      minSalary: '',
      maxSalary: '',
      minRating: '',
      exams: [],
      minEligibilityX: '',
      minEligibilityXII: '',
      workExpMin: '',
      workExpMax: '',
      page: 1
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key !== 'page' && key !== 'search') {
        if (Array.isArray(value) && value.length > 0) count++;
        else if (value !== '') count++;
      }
    });
    return count;
  };

  if (!filterOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect College</h1>
          <p className="text-gray-600 mt-2">
            Explore {pagination.total || 0} colleges across India
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        activeFiltersCount={getActiveFiltersCount()}
      />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-6">
              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <span className="font-medium">Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </div>
              </button>
            </div>

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-700">
                  Showing <span className="font-semibold">{colleges.length}</span> of{' '}
                  <span className="font-semibold">{pagination.total || 0}</span> colleges
                </p>
                <select
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  defaultValue="rating"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="fees">Lowest Fees</option>
                  <option value="placement">Best Placement</option>
                </select>
              </div>
            </div>

            {/* College Cards */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              </div>
            ) : colleges.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-20 h-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No colleges found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more results
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {colleges.map(college => (
                  <CollegeCard key={college._id} college={college} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(filters.page - 1)}
                  disabled={filters.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                
                {[...Array(pagination.pages)].map((_, idx) => {
                  const page = idx + 1;
                  if (
                    page === 1 ||
                    page === pagination.pages ||
                    (page >= filters.page - 2 && page <= filters.page + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 border rounded-lg ${
                          page === filters.page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === filters.page - 3 || page === filters.page + 3) {
                    return <span key={page}>...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(filters.page + 1)}
                  disabled={filters.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterSidebar
                filters={filters}
                filterOptions={filterOptions}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeList;