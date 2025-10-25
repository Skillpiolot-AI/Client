// src/components/ui/MultiSelect.jsx

import React from 'react';
import { X } from 'lucide-react';

const MultiSelect = ({ options, selected, onChange, placeholder }) => {
  const handleToggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const handleRemove = (option) => {
    onChange(selected.filter(item => item !== option));
  };

  return (
    <div className="space-y-2">
      {/* Selected Items */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selected.map(item => (
            <div
              key={item}
              className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
            >
              <span>{item}</span>
              <button
                onClick={() => handleRemove(item)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Options List */}
      <div className="space-y-2">
        {options.map(option => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => handleToggle(option)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
        {options.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-2">{placeholder || 'No options available'}</p>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;