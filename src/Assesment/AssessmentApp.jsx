import React, { useState } from 'react';
import AssessmentPage from './components/Assessment/AssessmentPage';
import ResultsPage from './components/Results/ResultsPage';
import './styles/global.css';

export default function AssessmentApp() {
  const [currentPage, setCurrentPage] = useState('assessment'); // Changed from 'home' to 'assessment'
  const [assessmentData, setAssessmentData] = useState(null);

  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };
  
  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('assessment'); // Changed from 'home' to 'assessment'
  };

  return (
    <div className="assesment-app">
      {currentPage === 'assessment' && (
        <AssessmentPage onComplete={handleAssessmentComplete} />
      )}

      {currentPage === 'results' && assessmentData && (
        <ResultsPage assessmentData={assessmentData} onStartNew={handleStartNew} />
      )}
    </div>
  );
}