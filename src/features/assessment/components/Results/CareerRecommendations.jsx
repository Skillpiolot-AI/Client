import React, { useState } from 'react';
import { Briefcase, TrendingUp, DollarSign, GraduationCap } from 'lucide-react';

const CareerRecommendations = ({ careers }) => {
  const [filter, setFilter] = useState('all');

  const filteredCareers = filter === 'all' 
    ? careers 
    : careers.filter(c => c.career_type === filter);

  const formatSalary = (range) => {
    if (!range || !range['0_2']) return 'N/A';
    const { salary_from, salary_to } = range['0_2'];
    return `₹${(salary_from / 100000).toFixed(1)}L - ₹${(salary_to / 100000).toFixed(1)}L`;
  };

  const getGrowthColor = (value) => {
    if (value >= 4) return '#047857';
    if (value >= 3) return '#0f766e';
    if (value >= 2) return '#c2410c';
    return '#64748b';
  };

  return (
    <div className="career-recommendations">
      <div className="recommendations-header">
        <h2 className="section-title">
          <Briefcase size={24} />
          Recommended Careers
        </h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'Professional' ? 'active' : ''}`}
            onClick={() => setFilter('Professional')}
          >
            Professional
          </button>
          <button 
            className={`filter-btn ${filter === 'Vocational' ? 'active' : ''}`}
            onClick={() => setFilter('Vocational')}
          >
            Vocational
          </button>
        </div>
      </div>

      <div className="careers-grid">
        {filteredCareers.map((career, idx) => (
          <div key={idx} className="career-card">
            <div className="career-header">
              <div className="career-info">
                <h4 className="career-name">{career.name}</h4>
                <span className="career-type">{career.career_type}</span>
              </div>
            </div>

            <div className="career-cluster">
              <GraduationCap size={14} />
              <span>{career.cluster}</span>
            </div>

            <div className="career-details">
              {career.salary_range && career.salary_range['0_2'] && (
                <div className="detail-item">
                  <DollarSign size={16} />
                  <span>{formatSalary(career.salary_range)}</span>
                </div>
              )}
              
              {career.future_growth && career.future_growth.very_long_term && (
                <div className="detail-item">
                  <TrendingUp 
                    size={16} 
                    color={getGrowthColor(career.future_growth.very_long_term.value)}
                  />
                  <span style={{ color: getGrowthColor(career.future_growth.very_long_term.value) }}>
                    {career.future_growth.very_long_term.text}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerRecommendations;