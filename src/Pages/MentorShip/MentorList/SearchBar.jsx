import React, { useState, useEffect } from 'react';
import './SearchBar.css';

/**
 * SearchBar - Redesigned with animated orb and cycling placeholder text
 */
const SearchBar = ({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange
}) => {
    const placeholders = [
        "Search for Skill, domain or name...",
        "What should we learn today?",
        "Find your dream mentor...",
        "Search for Google Mentors...",
        "Explore Fullstack Experts...",
        "Level up your career with AI...",
    ];

    const [index, setIndex] = useState(0);
    const [animationState, setAnimationState] = useState('active'); // active, exit

    useEffect(() => {
        const interval = setInterval(() => {
            setAnimationState('exit');

            setTimeout(() => {
                setIndex((prev) => (prev + 1) % placeholders.length);
                setAnimationState('enter');

                // Trigger entry
                setTimeout(() => {
                    setAnimationState('active');
                }, 100);
            }, 1200); // Wait for exit animation (matched to CSS)
        }, 4500); // Wait longer between cycles

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="search-bar-redesign">
            {/* Animated Orb */}
            <div className="search-orb-wrapper">
                <div className="search-orb"></div>
            </div>

            {/* Input & Animated Placeholder */}
            <div className="search-input-container">
                {searchTerm === '' && (
                    <div className="placeholder-animation-wrapper">
                        <span className={`placeholder-text ${animationState}`}>
                            {placeholders[index]}
                        </span>
                    </div>
                )}
                <input
                    type="text"
                    className="search-input-field"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Sort Dropdown */}
            <div className="sort-wrapper">
                <span className="sort-label">Sort by:</span>
                <select
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="recommended">Recommended</option>
                    <option value="rating">Highest Rated</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="experience">Most Experienced</option>
                    <option value="placements">Most Placements</option>
                </select>
            </div>
        </div>
    );
};

export default SearchBar;
