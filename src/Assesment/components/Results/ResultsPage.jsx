import React from 'react';
import { Share2, Download, Home, CheckCircle, History, Verified } from 'lucide-react';
import ChartsSection from './ChartsSection';
import CareerRecommendations from './CareerRecommendations';
import DomainInsights from './DomainInsights';
import GeminiInsights from './GeminiInsights';

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
    const text = `My Holland Code is ${results.hollandCode}! I just discovered my ideal career profile.`;
    if (navigator.share) {
      try { await navigator.share({ title: 'My RIASEC Career Assessment Results', text, url: window.location.href }); } catch (err) { fallbackShare(text); }
    } else { fallbackShare(text); }
  };

  const fallbackShare = (text) => {
    if (navigator.clipboard) { navigator.clipboard.writeText(`${text}\n${window.location.href}`); alert('Link copied!'); } else { alert(text); }
  };

  const handleDownload = () => alert('PDF download feature coming soon!');

  if (!sorted.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff8f5] px-4 font-sans text-[#1f1b18]">
        <div className="bg-white p-12 rounded-3xl border border-[#c5c6cd]/30 text-center max-w-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-4 font-serif">No Results Available</h2>
          <p className="text-[#515f74] mb-8">Unable to load assessment findings.</p>
          <button onClick={onStartNew} className="bg-[#1d2b3e] text-white px-8 py-3 rounded-xl font-semibold">Return Home</button>
        </div>
      </div>
    );
  }

  // Helper strings for UI
  const getArchetype = (code) => {
    const map = {
      'SEC': 'Community Architect',
      'IRE': 'Strategic Innovator',
      'AIR': 'Creative Builder',
      'SRE': 'Frontline Leader',
      'IEC': 'Analytical Strategist',
      'ASE': 'Visionary Director'
    };
    return map[code] || 'Professional Navigator';
  };

  const topString = sorted.length >= 3 ? `${sorted[0].domain} · ${sorted[1].domain} · ${sorted[2].domain}` : 'RIASEC Profile';

  return (
    <div className="bg-[#fff8f5] text-[#1f1b18] min-h-screen font-sans selection:bg-[#d0e1fb]">
      
      {/* Header Section (TopAppBar Shared Component Simulation) */}
      <header className="relative w-full bg-[#fff8f5] shadow-sm px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-[#eae1dc] gap-4">
        <div className="flex items-center gap-2">
            <span className="font-serif font-extrabold text-xl tracking-tight text-[#1d2b3e]">Career Navigator</span>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#1d2b3e] font-medium hover:bg-[#fbf2ed] transition-all active:scale-95 border border-[#eae1dc]">
                <Share2 size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Share</span>
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[white] bg-[#1d2b3e] font-medium hover:bg-[#004944] transition-all active:scale-95">
                <Download size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">Download</span>
            </button>
            <button onClick={onViewHistory} className="flex items-center gap-2 px-4 py-2 rounded-xl text-[#1d2b3e] font-medium hover:bg-[#fbf2ed] transition-all active:scale-95 border border-[#eae1dc]">
                <History size={16} />
                <span className="text-xs uppercase tracking-wider font-semibold">History</span>
            </button>
        </div>
      </header>

      <main className="pt-12 pb-20 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        
        {/* Section 1: Core RIASEC Profile */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#004944]/10 text-[#004944] rounded-full">
                <Verified size={14} className="fill-current" />
                <span className="text-xs font-bold uppercase tracking-widest">Assessment Finalized</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif font-extrabold text-[#1d2b3e] tracking-widest leading-none">
                {hollandCode.split('').join(' ')}
            </h1>
            
            <p className="text-xl text-[#44474c] max-w-xl font-sans leading-relaxed">
                {topString}. You are a <span className="text-[#1d2b3e] font-semibold">{getArchetype(hollandCode)}</span>—driven by your unique combination of traits.
            </p>
            
            {improvement && improvement.hasImproved !== null && (
                <div className="flex items-center gap-4 pt-2">
                    <div className="px-4 py-2 bg-[#fbf2ed] rounded-xl flex items-center gap-3">
                        <TrendingUp size={18} className={improvement.hasImproved ? "text-[#004944]" : "text-[#ba1a1a]"} />
                        <span className="text-sm font-medium">{improvement.percentageChange}% Change from previous</span>
                    </div>
                </div>
            )}
          </div>
          
          <div className="lg:col-span-5 relative group mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#334155] rounded-3xl rotate-3 opacity-5 transition-transform group-hover:rotate-1"></div>
            <div className="bg-white p-8 rounded-3xl relative border border-[#c5c6cd]/15 shadow-sm">
                <div className="space-y-4">
                    <h3 className="font-serif font-bold text-2xl mb-6">Trait Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm border-b border-[#c5c6cd]/10 pb-3">
                            <span className="text-[#44474c]">Primary Driver</span>
                            <span className="font-semibold">{results.sorted[0]?.domain}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-b border-[#c5c6cd]/10 pb-3">
                            <span className="text-[#44474c]">Secondary Catalyst</span>
                            <span className="font-semibold">{results.sorted[1]?.domain}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-[#44474c]">Tertiary Support</span>
                            <span className="font-semibold">{results.sorted[2]?.domain}</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

        {/* Section 2: Gemini AI Personality Analysis */}
        <GeminiInsights results={results} />

        {/* Section 3: Visual Data & Breakdown */}
        <ChartsSection results={results} />

        {/* Section 4: Detailed Domain Insights */}
        <DomainInsights results={results} />

        {/* Section 5: Curated Career Recommendations */}
        {results.recommendedCareers.length > 0 && (
          <CareerRecommendations careers={results.recommendedCareers} />
        )}
        
      </main>
    </div>
  );
};

export default ResultsPage;