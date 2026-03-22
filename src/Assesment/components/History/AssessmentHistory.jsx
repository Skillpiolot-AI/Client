import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';
import { Clock, CheckCircle } from 'lucide-react';

// Shared RIASEC Domains for standard array ordering
const RIASEC_DOMAINS = ['R', 'I', 'A', 'S', 'E', 'C'];

export default function AssessmentHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [trends, setTrends] = useState(null);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await assessmentAPI.getMyHistory();
      
      if (res && (res.success || Array.isArray(res))) {
        if (Array.isArray(res)) {
            setHistory(res);
        } else if (res.data?.assessments) {
            setHistory(res.data.assessments);
            setTrends(res.data.trends);
            setTotalAssessments(res.data.totalAssessments || res.data.assessments.length);
        } else if (Array.isArray(res.data)) {
            setHistory(res.data);
            setTotalAssessments(res.data.length);
        } else if (Array.isArray(res.data?.data)) {
            setHistory(res.data.data);
            setTotalAssessments(res.data.data.length);
        } else {
            setHistory([]);
        }
      } else {
        setHistory([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assessment history');
    } finally {
      setLoading(false);
    }
  };

  const onBack = () => navigate('/assessment');
  const onViewResult = (id) => navigate(`/assessment/results/${id}`);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface-bright mt-8">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-secondary font-medium animate-pulse font-serif italic text-lg">Retrieving your archived results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-surface-bright mt-8 p-6 text-center">
        <div className="w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center mb-4">
          <Clock size={32} />
        </div>
        <h2 className="text-xl font-bold font-serif text-error mb-2">Failed to load history</h2>
        <p className="text-secondary mb-6">{error}</p>
        <button 
          onClick={fetchHistory}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-tertiary-container transition"
        >
          Try Again
        </button>
        <button 
          onClick={onBack}
          className="mt-4 text-primary hover:text-tertiary font-medium"
        >
          Return to Assessment
        </button>
      </div>
    );
  }

  if (history.length === 0) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center bg-[#fff8f5]">
            <div className="text-center p-12 bg-white rounded-3xl border border-[#eae1dc] max-w-lg shadow-sm">
                <div className="w-20 h-20 bg-[#fbf2ed] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-[#1d2b3e] text-4xl">history</span>
                </div>
                <h3 className="text-2xl font-bold font-serif text-[#1d2b3e] mb-3">No Assessments Yet</h3>
                <p className="text-[#505f76] mb-8 leading-relaxed">
                    You haven't completed any career assessments yet. Start your first session to discover your Holland Code and track your professional evolution over time.
                </p>
                <button 
                    onClick={onBack}
                    className="group flex items-center gap-3 bg-[#1d2b3e] mx-auto text-white pr-8 pl-4 py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[20px]">play_arrow</span>
                    </div>
                    <span className="font-bold tracking-tight">Start Assessment</span>
                </button>
            </div>
        </div>
      );
  }

  // Calculate highest trait logic from first assessment vs latest
  const firstAssessment = history[history.length - 1]; // Assuming sorted newest first
  const latestAssessment = history[0];
  const dominantTraitChangeStr = trends ? trends.dominantTraitChange : `${firstAssessment?.results?.hollandCode?.charAt(0)} → ${latestAssessment?.results?.hollandCode?.charAt(0)}`;

  return (
    <div className="bg-[#fff8f5] font-sans text-[#1f1b18] min-h-screen selection:bg-[#d0e1fb]">
      
      {/* Header Section (TopAppBar Shared Component Simulation) */}
      <header className="relative w-full bg-[#fff8f5] shadow-sm px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-[#eae1dc] gap-4">
        <div className="flex items-center gap-2">
            <span className="font-serif font-extrabold text-xl tracking-tight text-[#1d2b3e]">Career Navigator</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#1d2b3e] font-medium hover:bg-[#fbf2ed] transition-all active:scale-95 border border-[#eae1dc]">
                 <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span className="text-xs uppercase tracking-wider font-semibold">Back to Test</span>
            </button>
        </div>
      </header>

      <main className="min-h-screen">
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
            
            {/* Header Section */}
            <header className="mb-16">
                <span className="text-[0.65rem] font-bold tracking-[0.15em] text-[#00312d] uppercase bg-[#9cf2e8]/30 px-3 py-1 rounded-full">
                    Historical Archive
                </span>
                <h1 className="text-5xl md:text-6xl font-serif font-extrabold text-[#1d2b3e] mt-6 tracking-tight">Assessment Journey</h1>
                
                <div className="mt-8 max-w-2xl bg-[#fbf2ed] p-8 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#00312d]/5 rounded-full -mr-12 -mt-12 blur-3xl"></div>
                    <p className="text-lg md:text-xl text-[#44474c] leading-relaxed">
                        Your professional DNA has evolved over <span className="text-[#1d2b3e] font-bold">{totalAssessments} assessments</span>. 
                        Your core <span className="text-[#00312d] font-bold">{latestAssessment?.results?.hollandCode || 'traits'}</span> traits are currently dominant.
                        {trends && trends.percentageChange !== 0 && (
                             <span> You've seen a <span className="text-[#00312d] font-bold text-lg mx-1">{Math.abs(trends.percentageChange)}%</span> change in core alignment since your last session.</span>
                        )}
                    </p>
                </div>
            </header>

            {/* Assessment List (Vertical Chronology) */}
            <div className="space-y-10 relative">
                
                {/* Timeline Thread */}
                <div className="absolute left-6 top-0 bottom-0 w-px bg-[#75777d]/20 hidden lg:block"></div>

                {history.map((assessment, index) => {
                    const isLatest = index === 0;
                    const dateStr = new Date(assessment.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    });
                    const results = assessment.results || {};
                    const scores = results.percentages || {};
                    // Find highest domain to assign a 'title' for visual flair if no title exists
                    const topDomainKey = results.topThreeDomains?.[0] || 'R';
                    
                    const domainTitles = {
                        'R': 'The Builder',
                        'I': 'The Thinker',
                        'A': 'The Creator',
                        'S': 'The Helper',
                        'E': 'The Persuader',
                        'C': 'The Organizer'
                    };
                    const title = domainTitles[topDomainKey];

                    return (
                        <section key={assessment._id} className="group relative lg:pl-16">
                            
                            {/* Timeline Node */}
                            {isLatest ? (
                                <div className="absolute left-4 top-10 w-4 h-4 rounded-full border-4 border-[#fff8f5] bg-[#1d2b3e] hidden lg:block z-10"></div>
                            ) : (
                                <div className="absolute left-5 top-10 w-2 h-2 rounded-full bg-[#c5c6cd] hidden lg:block z-10"></div>
                            )}

                            <div className={`p-8 rounded-[2rem] transition-all duration-500 flex flex-col md:flex-row items-center gap-12 border ${
                                isLatest ? 'bg-white shadow-[0px_20px_40px_rgba(31,27,24,0.04)] hover:shadow-[0px_20px_40px_rgba(31,27,24,0.08)] border-[#eae1dc]' : 'bg-white/60 shadow-[0px_5px_15px_rgba(31,27,24,0.02)] hover:shadow-[0px_20px_40px_rgba(31,27,24,0.08)] border-[#eae1dc]/50'
                            }`}>
                                
                                <div className="flex-none text-center md:text-left min-w-[120px]">
                                    <p className="text-sm font-sans font-bold text-[#75777d] uppercase tracking-widest">{dateStr}</p>
                                    <h2 className={`text-3xl font-serif font-bold mt-1 ${isLatest ? 'text-[#1d2b3e]' : 'text-[#44474c]'}`}>{results.hollandCode}</h2>
                                    <p className={`font-semibold text-sm mt-1 ${isLatest ? 'text-[#00312d]' : 'text-[#505f76]'}`}>{title}</p>
                                </div>

                                {/* Sparkline Visualization Container */}
                                <div className={`flex-grow w-full md:w-auto h-24 flex items-end justify-between px-4 gap-2 ${!isLatest && 'opacity-50 grayscale-[50%]'}`}>
                                    {RIASEC_DOMAINS.map(domain => {
                                        // Score is 0-100 percentage. We set height relative to that.
                                        const score = scores[domain] || 10;
                                        // Colors: Top 3 domains get primary/blue colors, bottom 3 get muted colors
                                        const isTop = results.topThreeDomains?.includes(domain);
                                        const bgClass = isTop ? 'bg-[#334155]' : 'bg-[#fbf2ed]';
                                        
                                        return (
                                            <div key={domain} className={`w-full ${bgClass} rounded-t-lg relative group/bar transition-all hover:bg-[#80d5cb]/40`} style={{ height: `${Math.max(score, 15)}%` }}>
                                                 <span className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${isTop ? 'text-[#1d2b3e]' : 'text-[#75777d]'}`}>{domain}</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex-none mt-6 md:mt-0">
                                    {isLatest ? (
                                        <button 
                                            onClick={() => onViewResult(assessment._id)}
                                            className="bg-gradient-to-br from-[#1d2b3e] to-[#334155] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide shadow-xl shadow-[#1d2b3e]/10 hover:-translate-y-1 transition-all"
                                        >
                                            View Full Insights
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => onViewResult(assessment._id)}
                                            className="text-[#1d2b3e] border border-[#c5c6cd]/80 px-8 py-4 bg-white rounded-full font-bold text-sm tracking-wide hover:bg-[#fbf2ed] transition-all"
                                        >
                                            View Archive
                                        </button>
                                    )}
                                </div>

                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Bento Growth Summary Section */}
            {history.length > 1 && trends && (
                <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 bg-[#eae1dc] p-10 rounded-[2.5rem] flex flex-col justify-center">
                        <div className="flex items-center gap-4 mb-4">
                            <span className="material-symbols-outlined text-[#00312d]">trending_up</span>
                            <h3 className="text-xl font-serif font-bold text-[#1d2b3e]">Trajectory Insight</h3>
                        </div>
                        <p className="text-[#44474c] leading-relaxed text-lg">
                            Your dominant traits transitioned <span className="font-bold text-[#1d2b3e]">{dominantTraitChangeStr}</span> over your recorded history. 
                            {trends.hasImproved ? " You are showing increased alignment and clarity in your dominant domains." : " Your answers show a diversification of interests, opening up broader multidisciplinary fields."}
                        </p>
                    </div>
                    <div className="bg-[#334155] p-10 rounded-[2.5rem] text-white flex flex-col items-center justify-center text-center">
                        <span className="text-5xl font-serif font-extrabold mb-2 text-[#9cf2e8]">{latestAssessment?.results?.percentages?.[latestAssessment.results?.topThreeDomains?.[0]] || 80}%</span>
                        <p className="text-[#b9c7e0] text-xs font-bold uppercase tracking-widest">Primary Trait Strength</p>
                        <p className="mt-4 text-sm text-white/70">Your strongest defining Holland characteristic.</p>
                    </div>
                </section>
            )}

        </div>
      </main>

      {/* Contextual "Next Step" Floating Action */}
      <div className="fixed bottom-10 right-6 md:right-10 z-50">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 bg-[#00312d] text-white pr-8 pl-4 py-4 rounded-full shadow-2xl hover:scale-105 hover:bg-[#004944] active:scale-95 transition-all"
          >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">psychology</span>
              </div>
              <span className="font-bold text-sm tracking-tight">Retake Assessment</span>
          </button>
      </div>

    </div>
  );
}
