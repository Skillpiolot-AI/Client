// src/Pages/Colleges/CollegeCard.jsx

import React from 'react';
import { MapPin, IndianRupee, TrendingUp, Star, Award, Users, Building2 } from 'lucide-react';

const CollegeCard = ({ college }) => {
  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return `₹${(amount / 100000).toFixed(2)}L`;
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    return num.toLocaleString('en-IN');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Logo Section */}
        <div className="md:w-48 bg-gray-50 p-6 flex items-center justify-center border-r border-gray-200">
          {college.logoImageUrl ? (
            <img
              src={college.logoImageUrl}
              alt={college.name}
              className="w-32 h-32 object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/128?text=No+Logo';
              }}
            />
          ) : (
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer">
                {college.name}
              </h3>
              
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{college.displayLocationString || 'Location not specified'}</span>
                </div>
                {college.ownership && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {college.ownership}
                  </span>
                )}
                {college.listingType && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {college.listingType}
                  </span>
                )}
              </div>

              {college.rankingString && (
                <div className="flex items-center gap-1 text-sm text-amber-600 mb-2">
                  <Award className="w-4 h-4" />
                  <span className="font-medium">{college.rankingString}</span>
                </div>
              )}
            </div>

            {/* Rating Badge */}
            {college.averageCourseRating > 0 && (
              <div className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold">{college.averageCourseRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Fees */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-600 mb-1">
                <IndianRupee className="w-4 h-4" />
                <span className="text-xs font-medium">Fees</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {college.minFees && college.maxFees ? (
                  <>
                    {formatCurrency(college.minFees)} - {formatCurrency(college.maxFees)}
                  </>
                ) : (
                  'Contact College'
                )}
              </div>
            </div>

            {/* Placement */}
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-medium">Avg. Package</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {college.minMedianSalary && college.maxMedianSalary ? (
                  <>
                    {formatCurrency(college.minMedianSalary)} - {formatCurrency(college.maxMedianSalary)}
                  </>
                ) : (
                  'Not Available'
                )}
              </div>
            </div>

            {/* Courses */}
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-medium">Courses</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {formatNumber(college.courseCount)} Available
              </div>
            </div>

            {/* Seats */}
            <div className="bg-amber-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Users className="w-4 h-4" />
                <span className="text-xs font-medium">Total Seats</span>
              </div>
              <div className="text-sm font-bold text-gray-900">
                {formatNumber(college.totalSeats)}
              </div>
            </div>
          </div>

          {/* Exams Accepted */}
          {college.exams && college.exams.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Exams Accepted:</p>
              <div className="flex flex-wrap gap-2">
                {college.exams.slice(0, 6).map((exam, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium border border-gray-200"
                  >
                    {exam.name}
                  </span>
                ))}
                {college.exams.length > 6 && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                    +{college.exams.length - 6} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Eligibility Info */}
          {(college.minEligibilityX || college.minEligibilityXII || college.workExpMin !== undefined) && (
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-600 mb-2">Eligibility:</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-700">
                {college.minEligibilityX && (
                  <span>10th: {college.minEligibilityX}%+</span>
                )}
                {college.minEligibilityXII && (
                  <span>12th: {college.minEligibilityXII}%+</span>
                )}
                {college.workExpMin !== undefined && (
                  <span>
                    Work Exp: {college.workExpMin}-{college.workExpMax || '+'} years
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <button className="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              View Details
            </button>
            {college.placementUrl && (
              <a
                href={college.placementUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Placements
              </a>
            )}
            {college.reviewUrl && (
              <a
                href={college.reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Reviews
              </a>
            )}
            <button className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeCard;