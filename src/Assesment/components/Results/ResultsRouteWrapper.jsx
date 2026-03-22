import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import ResultsPage from './ResultsPage';

export default function ResultsRouteWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        const res = await assessmentAPI.getById(id);
        // Sometimes APIs wrap in { success: true, data: {...} }
        const actualData = res?.data || res;
        setAssessmentData(actualData);
      } catch (err) {
        console.error("Failed to load result", err);
        setError("Could not load these assessment results.");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchResult();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] text-[#1d2b3e]">
        <div className="w-12 h-12 rounded-full border-4 border-[#1d2b3e]/20 border-t-[#1d2b3e] animate-spin mb-6"></div>
        <p className="font-serif italic text-xl text-[#505f76]">Loading your personalized results...</p>
      </div>
    );
  }

  if (error || !assessmentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] text-[#1f1b18] px-4">
        <div className="bg-white p-12 rounded-3xl border border-[#c5c6cd]/30 text-center max-w-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 font-serif text-[#ba1a1a]">Result Not Found</h2>
          <p className="text-[#515f74] mb-8">{error || "The assessment result you are looking for doesn't exist or you don't have permission to view it."}</p>
          <button 
            onClick={() => navigate('/assessment/history')} 
            className="bg-[#1d2b3e] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#004944] transition-colors"
          >
            Back to History
          </button>
        </div>
      </div>
    );
  }

  return (
    <ResultsPage
      assessmentData={assessmentData}
      onStartNew={() => navigate('/assessment')}
      onViewHistory={() => navigate('/assessment/history')}
    />
  );
}
