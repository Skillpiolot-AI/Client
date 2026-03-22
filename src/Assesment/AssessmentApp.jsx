import React from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import AssessmentPage from './components/Assessment/AssessmentPage';
import ResultsRouteWrapper from './components/Results/ResultsRouteWrapper';
import AssessmentHistory from './components/History/AssessmentHistory';
import { useAuth } from '../AuthContext';
import { Lock } from 'lucide-react';
import './styles/global.css';

export default function AssessmentApp() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (authLoading) return null; // Wait for auth resolution

  if (!isAuthenticated()) {
    // Determine where they were trying to go so we can bounce them back
    const isHistory = location.pathname.includes('/history');
    const fromPath = isHistory ? '/assessment/history' : '/assessment';

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 font-sans tracking-wide">
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-[#e2e8f0] max-w-md w-full text-center">
          <div className="w-16 h-16 bg-[#004944]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-[#004944]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1d2b3e] mb-3 font-serif">Sign in Required</h2>
          <p className="text-[#515f74] mb-8 leading-relaxed">
            Please log in or create an account to view your assessment history or save new results to your profile.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/login', { state: { from: fromPath } })}
              className="flex-1 px-6 py-3 bg-[#1d2b3e] hover:bg-[#004944] text-white font-semibold rounded-xl transition shadow-sm"
            >
              Log In
            </button>
            <button
              onClick={() => navigate('/signup', { state: { from: fromPath } })}
              className="flex-1 px-6 py-3 bg-white hover:bg-[#f8efeb] text-[#1d2b3e] border border-[#e2e8f0] font-semibold rounded-xl transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAssessmentComplete = (data) => {
    // Extract ID from the backend response
    const resultId = data?._id || data?.data?._id || data?.assessment?._id;
    if (resultId) {
      navigate(`/assessment/results/${resultId}`);
    } else {
      // Fallback if ID can't be found
      console.warn("Could not find assessment ID in response, falling back to history", data);
      navigate('/assessment/history');
    }
  };

  const handleViewHistory = () => {
    navigate('/assessment/history');
  };

  return (
    <div className="assesment-app">
      <Routes>
        <Route 
          path="/" 
          element={
            <AssessmentPage 
              onComplete={handleAssessmentComplete} 
              onViewHistory={handleViewHistory} 
            />
          } 
        />
        <Route path="/results/:id" element={<ResultsRouteWrapper />} />
        <Route path="/history" element={<AssessmentHistory />} />
      </Routes>
    </div>
  );
}