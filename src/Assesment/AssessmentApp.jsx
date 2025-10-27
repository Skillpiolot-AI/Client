import React, { useState } from 'react';
<<<<<<< HEAD
import HomePage from './components/Home/HomePage';
=======
>>>>>>> backup-feature-update
import AssessmentPage from './components/Assessment/AssessmentPage';
import ResultsPage from './components/Results/ResultsPage';
import './styles/global.css';

export default function AssessmentApp() {
<<<<<<< HEAD
  const [currentPage, setCurrentPage] = useState('home');
  const [assessmentData, setAssessmentData] = useState(null);

  const handleStartAssessment = () => setCurrentPage('assessment');
=======
  const [currentPage, setCurrentPage] = useState('assessment'); // Changed from 'home' to 'assessment'
  const [assessmentData, setAssessmentData] = useState(null);

>>>>>>> backup-feature-update
  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };
<<<<<<< HEAD
  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('home');
=======
  
  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('assessment'); // Changed from 'home' to 'assessment'
>>>>>>> backup-feature-update
  };

  return (
    <div className="assesment-app">
<<<<<<< HEAD
      {currentPage === 'home' && (
        <HomePage onStartAssessment={handleStartAssessment} />
      )}

=======
>>>>>>> backup-feature-update
      {currentPage === 'assessment' && (
        <AssessmentPage onComplete={handleAssessmentComplete} />
      )}

      {currentPage === 'results' && assessmentData && (
        <ResultsPage assessmentData={assessmentData} onStartNew={handleStartNew} />
      )}
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> backup-feature-update
