import React from 'react';

const ProgressBar = ({ current, total, progress }) => {
  return (
    <div className="progress-bar-container">
      <div className="progress-info">
        <span className="progress-label">Question {current} of {total}</span>
        <span className="progress-percentage">{Math.round(progress)}%</span>
      </div>
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;