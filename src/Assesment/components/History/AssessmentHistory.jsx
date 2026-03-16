import React, { useState, useEffect } from 'react';
import { assessmentAPI } from '../../services/api';
import { Clock, CheckCircle, ArrowRight, BarChart2 } from 'lucide-react';

export default function AssessmentHistory({ onBack, onViewResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await assessmentAPI.getMyHistory();
      
      if (res && res.success) {
        // Handle variations in array structure (e.g., res.data vs res.data.data)
        const docs = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setHistory(Array.isArray(docs) ? docs : []);
      } else {
        setHistory([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50 p-6 rounded-2xl mx-auto max-w-4xl mt-8">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Loading your assessment history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 rounded-2xl mx-auto max-w-4xl mt-8 p-6 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <Clock size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to load history</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <button 
          onClick={fetchHistory}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
        <button 
          onClick={onBack}
          className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Return to Assessment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 lg:p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="text-indigo-600" size={32} />
            Assessment History
          </h2>
          <p className="text-gray-500 mt-2">
            Track your career growth and personality evolution over time.
          </p>
        </div>
        <button 
          onClick={onBack}
          className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition flex items-center gap-2"
        >
          Go Back
        </button>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <BarChart2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Assessments Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            You haven't completed any career assessments yet. Start your first one to discover your unique Holland Code!
          </p>
          <button 
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
          >
            Start Assessment Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((assessment, index) => {
            const date = new Date(assessment.completedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });
            const { hollandCode, topThreeDomains } = assessment.results || {};
            const topDomain = topThreeDomains?.[0];

            return (
              <div 
                key={assessment._id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-100 rounded-2xl hover:border-indigo-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4 mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    {index === 0 ? <CheckCircle size={24} /> : <Clock size={24} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {hollandCode || 'N/A'}
                      </h4>
                      {index === 0 && (
                        <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          Latest
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm mb-1">{date}</p>
                    {topDomain && (
                      <p className="text-indigo-600 font-medium text-sm">
                        Dominant: {topDomain}
                      </p>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onViewResult(assessment.results)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition group-hover:shadow-md flex items-center justify-center gap-2"
                >
                  View Full Result
                  <ArrowRight size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
