// src/Pages/Colleges/FilterBar.jsx

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const FilterBar = ({ filters, onFilterChange, onClearFilters, activeFiltersCount }) => {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange('search', searchInput);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const getActiveFilterChips = () => {
    const chips = [];

    if (filters.ownership.length > 0) {
      filters.ownership.forEach(o => {
        chips.push({ key: 'ownership', value: o, label: o });
      });
    }

    if (filters.listingType.length > 0) {
      filters.listingType.forEach(l => {
        chips.push({ key: 'listingType', value: l, label: l });
      });
    }

    if (filters.location) {
      chips.push({ key: 'location', value: filters.location, label: `📍 ${filters.location}` });
    }

    if (filters.minFees || filters.maxFees) {
      const feeLabel = `💰 ₹${(filters.minFees / 100000 || 0).toFixed(1)}L - ₹${(filters.maxFees / 100000 || 10).toFixed(1)}L`;
      chips.push({ key: 'fees', value: 'fees', label: feeLabel });
    }

    if (filters.minSalary || filters.maxSalary) {
      const salaryLabel = `💼 ₹${(filters.minSalary / 100000 || 0).toFixed(1)}L - ₹${(filters.maxSalary / 100000 || 20).toFixed(1)}L`;
      chips.push({ key: 'salary', value: 'salary', label: salaryLabel });
    }

    if (filters.minRating) {
      chips.push({ key: 'rating', value: filters.minRating, label: `⭐ ${filters.minRating}+ Rating` });
    }

    if (filters.exams.length > 0) {
      filters.exams.forEach(exam => {
        chips.push({ key: 'exams', value: exam, label: `🧾 ${exam}` });
      });
    }

    if (filters.minEligibilityX) {
      chips.push({ key: 'eligX', value: filters.minEligibilityX, label: `10th: ${filters.minEligibilityX}%+` });
    }

    if (filters.minEligibilityXII) {
      chips.push({ key: 'eligXII', value: filters.minEligibilityXII, label: `12th: ${filters.minEligibilityXII}%+` });
    }

    if (filters.workExpMin || filters.workExpMax) {
      const expLabel = `⏳ ${filters.workExpMin || 0}-${filters.workExpMax || '+'} years`;
      chips.push({ key: 'workExp', value: 'workExp', label: expLabel });
    }

    return chips;
  };

  const handleRemoveChip = (chip) => {
    switch (chip.key) {
      case 'ownership':
        onFilterChange('ownership', filters.ownership.filter(o => o !== chip.value));
        break;
      case 'listingType':
        onFilterChange('listingType', filters.listingType.filter(l => l !== chip.value));
        break;
      case 'location':
        onFilterChange('location', '');
        break;
      case 'fees':
        onFilterChange('minFees', '');
        onFilterChange('maxFees', '');
        break;
      case 'salary':
        onFilterChange('minSalary', '');
        onFilterChange('maxSalary', '');
        break;
      case 'rating':
        onFilterChange('minRating', '');
        break;
      case 'exams':
        onFilterChange('exams', filters.exams.filter(e => e !== chip.value));
        break;
      case 'eligX':
        onFilterChange('minEligibilityX', '');
        break;
      case 'eligXII':
        onFilterChange('minEligibilityXII', '');
        break;
      case 'workExp':
        onFilterChange('workExpMin', '');
        onFilterChange('workExpMax', '');
        break;
      default:
        break;
    }
  };

  const activeChips = getActiveFilterChips();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search colleges by name..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
            {activeChips.map((chip, idx) => (
              <div
                key={`${chip.key}-${idx}`}
                className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
              >
                <span>{chip.label}</span>
                <button
                  onClick={() => handleRemoveChip(chip)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={onClearFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium ml-2"
            >
              Clear All ({activeFiltersCount})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;