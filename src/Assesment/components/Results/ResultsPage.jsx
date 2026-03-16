import React from 'react';
import { Share2, Download, Home, CheckCircle, History } from 'lucide-react';
import ChartsSection from './ChartsSection';
import CareerRecommendations from './CareerRecommendations';
import DomainInsights from './DomainInsights';
import GeminiInsights from './GeminiInsights';
import '../../styles/results.css';

const ResultsPage = ({ assessmentData, onStartNew, onViewHistory }) => {
  // Extract data from the backend response
  const rawResults = assessmentData?.data?.results || assessmentData?.results || {};

  const domainScores = rawResults.domainScores || {};
  const percentages = rawResults.percentages || {};
  const hollandCode = rawResults.hollandCode || 'N/A';
  const recommendedCareers = rawResults.recommendedCareers || [];
  const improvement = assessmentData?.data?.improvement || null;

  // Convert percentages to sorted array format expected by child components
  const sorted = Object.entries(percentages)
    .map(([domain, score]) => ({ domain, score }))
    .sort((a, b) => b.score - a.score);

  // Build the normalized results object
  const results = {
    domainScores,
    percentages,
    sorted,
    hollandCode,
    recommendedCareers,
    topThreeDomains: sorted.slice(0, 3).map(item => item.domain)
  };

  const handleShare = async () => {
    const text = `My Holland Code is ${results.hollandCode}! I just discovered my ideal career path.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My RIASEC Career Assessment Results',
          text,
          url: window.location.href
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackShare(text);
        }
      }
    } else {
      fallbackShare(text);
    }
  };

  const fallbackShare = (text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      alert('Link copied to clipboard!');
    } else {
      alert(text);
    }
  };

  const handleDownload = () => {
    alert('PDF download feature coming soon!');
  };

  // Check if we have valid data
  if (!sorted.length || sorted.length === 0) {
    return (
      <div className="results-page">
        <div className="results-container">
          <div className="error-state">
            <h2>No Results Available</h2>
            <p>Unable to load assessment results. Please try again.</p>
            <button onClick={onStartNew} className="btn-primary">
              <Home size={18} />
              <span>Return Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Header */}
        <div className="results-header">
          <div className="completion-badge">
            <CheckCircle size={16} />
            <span>Assessment Complete</span>
          </div>
          <h1 className="results-title">Your Career Profile</h1>
          <p className="results-subtitle">
            Based on your responses, here's your personalized career guidance
          </p>

          {/* Holland Code Display */}
          <div className="holland-code-box">
            <span className="holland-label">Holland Code:</span>
            <span className="results-holland-code">{results.hollandCode}</span>
            {improvement && improvement.hasImproved !== null && (
              <span className={`improvement-badge ${improvement.hasImproved ? 'positive' : 'negative'}`}>
                {improvement.hasImproved ? '+' : ''}{improvement.percentageChange}% from last assessment
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleShare} className="btn-secondary">
            <Share2 size={16} />
            <span>Share Results</span>
          </button>
          <button onClick={handleDownload} className="btn-secondary">
            <Download size={16} />
            <span>Download PDF</span>
          </button>
          <button onClick={onViewHistory} className="btn-secondary">
            <History size={16} />
            <span>View History</span>
          </button>
          <button onClick={onStartNew} className="btn-primary">
            <Home size={16} />
            <span>Start New</span>
          </button>
        </div>

        {/* Gemini AI Personality Analysis */}
        <GeminiInsights results={results} />

        {/* Charts Section */}
        <ChartsSection results={results} />

        {/* Domain Insights */}
        <DomainInsights results={results} />

        {/* Career Recommendations */}
        {results.recommendedCareers.length > 0 && (
          <CareerRecommendations careers={results.recommendedCareers} />
        )}
      </div>

      <style>{`
        .results-page {
          min-height: 100vh;
          background: #f8fafc;
          padding: 80px 24px 40px;
        }

        .results-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .results-header {
          text-align: center;
          margin-bottom: 28px;
        }

        .completion-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #dcfce7;
          color: #166534;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 16px;
        }

        .results-title {
          font-size: 28px;
          font-weight: 700;
          color: #111827;
          margin: 0 0 8px 0;
        }

        .results-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin: 0 0 20px 0;
        }

        .holland-code-box {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          padding: 12px 24px;
          border-radius: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .holland-label {
          font-size: 14px;
          color: #6b7280;
        }

        .results-holland-code {
          font-size: 24px;
          font-weight: 800;
          color: #000000 !important;
          background: #dcfce7 !important;
          -webkit-text-fill-color: initial !important;
          -webkit-background-clip: initial !important;
          background-clip: initial !important;
          padding: 8px 20px;
          border-radius: 8px;
          letter-spacing: 4px;
        }

        .improvement-badge {
          font-size: 12px;
          padding: 5px 10px;
          border-radius: 16px;
          font-weight: 500;
        }

        .improvement-badge.positive {
          background: #dcfce7;
          color: #166534;
        }

        .improvement-badge.negative {
          background: #fef2f2;
          color: #991b1b;
        }

        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #166534;
          color: white;
        }

        .btn-primary:hover {
          background: #14532d;
        }

        .btn-secondary {
          background: white;
          color: #374151;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .error-state {
          text-align: center;
          padding: 60px 20px;
          background: white;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }

        .error-state h2 {
          color: #111827;
          margin-bottom: 8px;
        }

        .error-state p {
          color: #6b7280;
          margin-bottom: 20px;
        }

        @media (max-width: 640px) {
          .results-page {
            padding: 70px 16px 30px;
          }

          .results-title {
            font-size: 24px;
          }

          .holland-code {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;