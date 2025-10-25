import React, { useState } from 'react';
import HomePage from './components/Home/HomePage';
import AssessmentPage from './components/Assessment/AssessmentPage';
import ResultsPage from './components/Results/ResultsPage';
import './styles/global.css';

export default function AssessmentApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentData, setAssessmentData] = useState(null);

  const handleStartAssessment = () => setCurrentPage('assessment');
  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };
  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('home');
  };

  return (
    <div className="assesment-app">
      {currentPage === 'home' && (
        <HomePage onStartAssessment={handleStartAssessment} />
      )}

      {currentPage === 'assessment' && (
        <AssessmentPage onComplete={handleAssessmentComplete} />
      )}

      {currentPage === 'results' && assessmentData && (
        <ResultsPage assessmentData={assessmentData} onStartNew={handleStartNew} />
      )}
    </div>
  );
}
