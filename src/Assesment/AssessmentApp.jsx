import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AssessmentPage from './components/Assessment/AssessmentPage';
import ResultsPage from './components/Results/ResultsPage';
import AssessmentHistory from './components/History/AssessmentHistory';
import { useAuth } from '../AuthContext';
import { Lock } from 'lucide-react';
import './styles/global.css';

export default function AssessmentApp() {
  const [assessmentData, setAssessmentData] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Read view from query params (e.g. /assessment?view=history)
  const searchParams = new URLSearchParams(location.search);
  const initialView = searchParams.get('view') || 'assessment';
  const [currentPage, setCurrentPage] = useState(initialView);

  // Sync state if URL changes directly
  useEffect(() => {
    const view = new URLSearchParams(location.search).get('view') || 'assessment';
    setCurrentPage(view);
  }, [location.search]);

  if (authLoading) return null; // Wait for auth resolution

  if (!isAuthenticated()) {
    const fromPath = currentPage === 'history' ? '/assessment?view=history' : '/assessment';

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign in Required</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Please log in or create an account to view your assessment history or save new results to your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/login', { state: { from: fromPath } })}
              className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup', { state: { from: fromPath } })}
              className="flex-1 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-medium rounded-xl transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAssessmentComplete = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };
  
  const handleStartNew = () => {
    setAssessmentData(null);
    setCurrentPage('assessment');
  };

  const handleViewHistory = () => {
    setCurrentPage('history');
  };

  const handleViewHistoricalResult = (data) => {
    setAssessmentData(data);
    setCurrentPage('results');
  };

  return (
    <div className="assesment-app">
      {currentPage === 'assessment' && (
        <AssessmentPage 
          onComplete={handleAssessmentComplete} 
          onViewHistory={handleViewHistory} 
        />
      )}

      {currentPage === 'results' && assessmentData && (
        <ResultsPage 
          assessmentData={assessmentData} 
          onStartNew={handleStartNew} 
          onViewHistory={handleViewHistory}
        />
      )}

      {currentPage === 'history' && (
        <AssessmentHistory 
          onBack={handleStartNew}
          onViewResult={handleViewHistoricalResult}
        />
      )}
    </div>
  );
}