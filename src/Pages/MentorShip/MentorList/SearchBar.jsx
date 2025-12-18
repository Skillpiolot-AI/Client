import React from 'react';
import { Search } from 'lucide-react';

/**
 * SearchBar - Top search bar with search input and sort dropdown
 */
const SearchBar = ({
    searchTerm,
    onSearchChange,
    sortBy,
    onSortChange
}) => {
    return (
        <div className="search-bar">
            <div className="search-input-wrapper">
                <Search />
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search for any Skill, domain or name..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
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
