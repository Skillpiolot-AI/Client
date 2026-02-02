import React from 'react';
import { X } from 'lucide-react';

/**
 * FilterSidebar - Right-side filter panel with domain chips, pricing and experience sliders
 */
const FilterSidebar = ({
    selectedDomains,
    onDomainToggle,
    onClearDomains,
    menteeType,
    onMenteeTypeChange,
    priceRange,
    onPriceChange,
    experienceRange,
    onExperienceChange,
    isOpen,
    onClose
}) => {
    const domains = [
        'Frontend', 'Backend', 'Fullstack',
        'DevOps / SRE / Cloud', 'QA / Automation Testing',
        'Data Scientist / AI/ML', 'Data Analyst'
    ];

    const menteeTypes = [
        'Fresher',
        'Working Professional',
        'Student',
        'Career Switch'
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`filter-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            />

            <aside className={`filter-sidebar ${isOpen ? 'mobile-open' : ''}`}>
                <div className="filter-header">
                    <h3 className="filter-title">Filter By</h3>
                    {(selectedDomains.length > 0 || menteeType || priceRange[1] < 40000 || experienceRange[0] > 0) && (
                        <button
                            className="clear-filters"
                            onClick={() => {
                                onClearDomains();
                                onMenteeTypeChange('');
                                onPriceChange([0, 40000]);
                                onExperienceChange([0, 15]);
                            }}
                        >
                            ✕ Clear Filters
                        </button>
                    )}
                </div>

                {/* Domain Filter */}
                <div className="filter-section">
                    <h4 className="filter-section-title">Domain</h4>

                    {/* Selected domains as tags */}
                    {selectedDomains.length > 0 && (
                        <div className="selected-domains">
                            {selectedDomains.map((domain) => (
                                <span key={domain} className="selected-tag">
                                    {domain}
                                    <span
                                        className="remove-tag"
                                        onClick={() => onDomainToggle(domain)}
                                    >
                                        ✕
                                    </span>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Domain chips */}
                    <div className="domain-chips">
                        {domains.map((domain) => (
                            <button
                                key={domain}
                                className={`domain-chip ${selectedDomains.includes(domain) ? 'active' : ''}`}
                                onClick={() => onDomainToggle(domain)}
                            >
                                {domain}
                                {selectedDomains.includes(domain) && (
                                    <span className="remove">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mentee Type Filter */}
                <div className="filter-section">
                    <h4 className="filter-section-title">Offering Mentorship For</h4>
                    <select
                        className="filter-dropdown"
                        value={menteeType}
                        onChange={(e) => onMenteeTypeChange(e.target.value)}
                    >
                        <option value="">All Types</option>
                        {menteeTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                {/* Pricing Range */}
                <div className="filter-section">
                    <h4 className="filter-section-title">Max Pricing (per month)</h4>
                    <div className="range-slider-container">
                        <div className="range-values">
                            <span>₹0</span>
                            <span>₹{priceRange[1].toLocaleString()}{priceRange[1] === 40000 ? '+' : ''}</span>
                        </div>
                        <input
                            type="range"
                            className="range-slider"
                            min="0"
                            max="40000"
                            step="1000"
                            value={priceRange[1]}
                            onChange={(e) => onPriceChange([0, parseInt(e.target.value)])}
                        />
                    </div>
                </div>

                {/* Experience Range */}
                <div className="filter-section">
                    <h4 className="filter-section-title">Max Experience</h4>
                    <div className="range-slider-container">
                        <div className="range-values">
                            <span>0 years</span>
                            <span>{experienceRange[1]}{experienceRange[1] === 15 ? '+' : ''} years</span>
                        </div>
                        <input
                            type="range"
                            className="range-slider"
                            min="0"
                            max="15"
                            step="1"
                            value={experienceRange[1]}
                            onChange={(e) => onExperienceChange([0, parseInt(e.target.value)])}
                        />
                    </div>
                </div>
            </aside>
        </>
    );
};

export default FilterSidebar;
