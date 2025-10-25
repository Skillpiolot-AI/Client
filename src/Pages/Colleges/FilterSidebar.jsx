// src/Pages/Colleges/FilterSidebar.jsx

import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import RangeSlider from '../../components/ui/RangeSlider';
import MultiSelect from '../../components/ui/MultiSelect';

const FilterSidebar = ({ filters, filterOptions, onFilterChange, onClearFilters }) => {
  const [expandedSections, setExpandedSections] = useState({
    ownership: true,
    listingType: true,
    location: true,
    fees: true,
    placement: true,
    rating: true,
    exams: false,
    eligibility: false,
    workExp: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const FilterSection = ({ title, section, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between text-left mb-3"
      >
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {expandedSections[section] ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {expandedSections[section] && <div>{children}</div>}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Filters</h2>
        <button
          onClick={onClearFilters}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Ownership Filter */}
      <FilterSection title="🏛️ Ownership" section="ownership">
        <MultiSelect
          options={filterOptions.ownership}
          selected={filters.ownership}
          onChange={(value) => onFilterChange('ownership', value)}
          placeholder="Select ownership types"
        />
      </FilterSection>

      {/* Listing Type Filter */}
      <FilterSection title="🎓 Type" section="listingType">
        <MultiSelect
          options={filterOptions.listingType}
          selected={filters.listingType}
          onChange={(value) => onFilterChange('listingType', value)}
          placeholder="Select types"
        />
      </FilterSection>

      {/* Location Filter */}
      <FilterSection title="📍 Location" section="location">
        <select
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Locations</option>
          {filterOptions.locations.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </FilterSection>

      {/* Fees Range Filter */}
      <FilterSection title="💰 Fees Range" section="fees">
        <RangeSlider
          min={0}
          max={filterOptions.feeRange.maxFee || 1000000}
          step={10000}
          values={[
            filters.minFees || 0,
            filters.maxFees || filterOptions.feeRange.maxFee || 1000000
          ]}
          onChange={([min, max]) => {
            onFilterChange('minFees', min);
            onFilterChange('maxFees', max);
          }}
          formatLabel={(val) => `₹${(val / 100000).toFixed(1)}L`}
        />
      </FilterSection>

      {/* Placement Range Filter */}
      <FilterSection title="💼 Placement Package" section="placement">
        <RangeSlider
          min={0}
          max={filterOptions.salaryRange.maxSalary || 2000000}
          step={50000}
          values={[
            filters.minSalary || 0,
            filters.maxSalary || filterOptions.salaryRange.maxSalary || 2000000
          ]}
          onChange={([min, max]) => {
            onFilterChange('minSalary', min);
            onFilterChange('maxSalary', max);
          }}
          formatLabel={(val) => `₹${(val / 100000).toFixed(1)}L`}
        />
      </FilterSection>

      {/* Rating Filter */}
      <FilterSection title="⭐ Rating" section="rating">
        <div className="space-y-2">
          {[4, 3.5, 3, 2.5, 0].map(rating => (
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={parseFloat(filters.minRating) === rating}
                onChange={() => onFilterChange('minRating', rating || '')}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-sm text-gray-700">
                {rating > 0 ? `${rating}★ & above` : 'All Ratings'}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Exams Accepted Filter */}
      <FilterSection title="🧾 Exams Accepted" section="exams">
        <div className="max-h-48 overflow-y-auto space-y-2">
          {filterOptions.exams.map(exam => (
            <label key={exam} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.exams.includes(exam)}
                onChange={(e) => {
                  const newExams = e.target.checked
                    ? [...filters.exams, exam]
                    : filters.exams.filter(ex => ex !== exam);
                  onFilterChange('exams', newExams);
                }}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">{exam}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Eligibility Filter */}
      <FilterSection title="🧠 Eligibility" section="eligibility">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Min 10th %</label>
            <input
              type="number"
              value={filters.minEligibilityX}
              onChange={(e) => onFilterChange('minEligibilityX', e.target.value)}
              placeholder="e.g., 60"
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Min 12th %</label>
            <input
              type="number"
              value={filters.minEligibilityXII}
              onChange={(e) => onFilterChange('minEligibilityXII', e.target.value)}
              placeholder="e.g., 70"
              min="0"
              max="100"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FilterSection>

      {/* Work Experience Filter */}
      <FilterSection title="⏳ Work Experience" section="workExp">
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Min (years)</label>
            <input
              type="number"
              value={filters.workExpMin}
              onChange={(e) => onFilterChange('workExpMin', e.target.value)}
              placeholder="0"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Max (years)</label>
            <input
              type="number"
              value={filters.workExpMax}
              onChange={(e) => onFilterChange('workExpMax', e.target.value)}
              placeholder="5"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;