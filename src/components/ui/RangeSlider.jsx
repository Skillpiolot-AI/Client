// src/components/ui/RangeSlider.jsx

import React, { useState, useEffect } from 'react';

const RangeSlider = ({ min, max, step, values, onChange, formatLabel }) => {
  const [localValues, setLocalValues] = useState(values);

  useEffect(() => {
    setLocalValues(values);
  }, [values]);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    const newValues = [Math.min(newMin, localValues[1] - step), localValues[1]];
    setLocalValues(newValues);
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    const newValues = [localValues[0], Math.max(newMax, localValues[0] + step)];
    setLocalValues(newValues);
  };

  const handleMouseUp = () => {
    onChange(localValues);
  };

  const getPercentage = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="space-y-4">
      {/* Value Display */}
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">
          {formatLabel ? formatLabel(localValues[0]) : localValues[0]}
        </span>
        <span className="text-gray-500">to</span>
        <span className="font-medium text-gray-700">
          {formatLabel ? formatLabel(localValues[1]) : localValues[1]}
        </span>
      </div>

      {/* Slider Container */}
      <div className="relative h-2">
        {/* Track Background */}
        <div className="absolute w-full h-2 bg-gray-200 rounded-full"></div>

        {/* Active Track */}
        <div
          className="absolute h-2 bg-blue-600 rounded-full"
          style={{
            left: `${getPercentage(localValues[0])}%`,
            right: `${100 - getPercentage(localValues[1])}%`
          }}
        ></div>

        {/* Min Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValues[0]}
          onChange={handleMinChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10 range-slider"
        />

        {/* Max Slider */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValues[1]}
          onChange={handleMaxChange}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none z-10 range-slider"
        />

        <style jsx>{`
          .range-slider::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            background: white;
            border: 2px solid #2563eb;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: all;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .range-slider::-moz-range-thumb {
            width: 18px;
            height: 18px;
            background: white;
            border: 2px solid #2563eb;
            border-radius: 50%;
            cursor: pointer;
            pointer-events: all;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .range-slider::-webkit-slider-thumb:hover {
            background: #eff6ff;
          }

          .range-slider::-moz-range-thumb:hover {
            background: #eff6ff;
          }
        `}</style>
      </div>
    </div>
  );
};

export default RangeSlider;