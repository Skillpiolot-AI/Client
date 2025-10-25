import React from 'react';
import { Share2, Download, Home } from 'lucide-react';
import ChartsSection from './ChartsSection';
import CareerRecommendations from './CareerRecommendations';
import DomainInsights from './DomainInsights';
import '../../styles/results.css';

const ResultsPage = ({ assessmentData, onStartNew }) => {
  // Extract data from the backend response
  const rawResults = assessmentData?.data?.results || assessmentData?.results || {};
  
  const domainScores = rawResults.domainScores || {};
  const percentages = rawResults.percentages || {};
  const hollandCode = rawResults.hollandCode || 'N/A';
  let recommendedCareers = rawResults.recommendedCareers || [];

  // Recalculate match scores if they're all the same (bug fix)
//   if (recommendedCareers.length > 0) {
//     const uniqueScores = new Set(recommendedCareers.map(c => c.matchScore));
//     if (uniqueScores.size === 1 && uniqueScores.has(80)) {
//       // Recalculate match scores
//       recommendedCareers = recommendedCareers.map(career => {
//         const matchScore = calculateMatchScore(hollandCode, career.holland_codes || []);
//         return { ...career, matchScore };
//       }).sort((a, b) => b.matchScore - a.matchScore);
//     }
//   }

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

  // Helper function to calculate match score
//   function calculateMatchScore(userHollandCode, careerHollandCodes) {
//     if (!careerHollandCodes || careerHollandCodes.length === 0) return 0;
    
//     const userCodes = userHollandCode.split('');
//     let score = 0;
//     let matchCount = 0;
    
//     userCodes.forEach((code, index) => {
//       if (careerHollandCodes.includes(code)) {
//         matchCount++;
//         // Weight: first code = 50 points, second = 30 points, third = 20 points
//         if (index === 0) score += 50;
//         else if (index === 1) score += 30;
//         else if (index === 2) score += 20;
//       }
//     });
    
//     // Bonus points for exact matches in same position
//     careerHollandCodes.forEach((code, index) => {
//       if (index < userCodes.length && userCodes[index] === code) {
//         score += 10;
//       }
//     });
    
//     return Math.min(Math.round(score), 100);
//   }

  const handleShare = async () => {
    const text = `My Holland Code is ${results.hollandCode}! I just discovered my ideal career path. 🎯`;
    
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
      alert('Link copied to clipboard! 📋');
    } else {
      alert(text);
    }
  };

  const handleDownload = () => {
    alert('PDF download feature coming soon! 📄');
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
            <span className="badge-icon">✓</span>
            Assessment Complete!
          </div>
          <h1 className="results-title">Your Career Profile</h1>
          <p className="results-subtitle">
            Based on your responses, here's your personalized career guidance
          </p>
          <div className="holland-code-display">
            <span className="holland-label">Holland Code:</span>
            <span className="holland-code">{results.hollandCode}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleShare} className="btn-secondary">
            <Share2 size={18} />
            <span>Share Results</span>
          </button>
          <button onClick={handleDownload} className="btn-secondary">
            <Download size={18} />
            <span>Download PDF</span>
          </button>
          <button onClick={onStartNew} className="btn-primary">
            <Home size={18} />
            <span>Start New</span>
          </button>
        </div>

        {/* Charts Section */}
        <ChartsSection results={results} />

        {/* Domain Insights */}
        <DomainInsights results={results} />

        {/* Career Recommendations */}
        {results.recommendedCareers.length > 0 && (
          <CareerRecommendations careers={results.recommendedCareers} />
        )}
      </div>
    </div>
  );
};

export default ResultsPage;