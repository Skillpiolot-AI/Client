import React, { useState, useEffect } from 'react';
import { Sparkles, Bolt } from 'lucide-react';

const DOMAIN_NAMES = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional',
};

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY ;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function buildPrompt(results) {
  const { hollandCode, sorted } = results;
  const scoreLines = sorted.map(s => `  • ${DOMAIN_NAMES[s.domain]} (${s.domain}): ${Math.round(s.score)}%`).join('\n');

  return `You are an expert career counsellor. A user has completed the RIASEC career assessment.

Holland Code: ${hollandCode}
Full domain scores:
${scoreLines}

Based on these results, please provide a highly personalized and encouraging analysis structured exactly as follows. Use professional yet accessible language. Do NOT use markdown headers (like # or ##); separate sections with exactly this text markup so I can parse it:

[NARRATIVE]
Write 3 sentences describing their unique personality profile and ideal work environment.

[ACTION_ITEMS]
Write 3 specific bullet points starting with a dash (-) highlighting their strengths and actionable ways to use them in the workplace.

[CAREERS]
List 3 specific, modern career titles that best match ${hollandCode}. Each must be on its own line in this exact format:
→ [Career Title] — [One brief reason why]

Keep the entire response under 250 words total.`;
}

const GeminiInsights = ({ results }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (results?.hollandCode) fetchInsight();
  }, [results?.hollandCode]);

  const fetchInsight = async () => {
    setLoading(true); setError(null); setInsight('');
    try {
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(results) }] }] }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setInsight(text.trim());
    } catch (err) {
      console.error('Gemini error:', err);
      setError('Failed to generate insights.');
    } finally {
      setLoading(false);
    }
  };

  // Parsing logic
  const parseInsight = (text) => {
    const sections = { narrative: '', actions: [], careers: [] };
    
    const narrativeMatch = text.match(/\[NARRATIVE\]([\s\S]*?)\[ACTION_ITEMS\]/);
    if (narrativeMatch) sections.narrative = narrativeMatch[1].trim();

    const actionsMatch = text.match(/\[ACTION_ITEMS\]([\s\S]*?)\[CAREERS\]/);
    if (actionsMatch) {
      sections.actions = actionsMatch[1].split('\n')
        .map(line => line.replace(/^[\-\•\*]\s*/, '').trim())
        .filter(line => line.length > 0);
    }

    const careersMatch = text.match(/\[CAREERS\]([\s\S]*)/);
    if (careersMatch) {
      sections.careers = careersMatch[1].split('\n')
        .filter(line => line.trim().startsWith('→'))
        .map(line => {
          const parts = line.substring(1).split('—');
          return { title: parts[0]?.trim() || '', reason: parts[1]?.trim() || '' };
        });
    }

    // Fallbacks if formatting fails
    if (!sections.narrative) sections.narrative = "Gemini is still analyzing your unique organizational DNA.";
    
    return sections;
  };

  return (
    <section className="space-y-8 mt-16 font-sans antialiased text-[#1f1b18]">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Sparkles className="text-[#004944] w-8 h-8" />
          <h2 className="text-3xl font-serif font-bold tracking-tight">Gemini AI Synthesis</h2>
        </div>
        <p className="text-[#44474c]">Deep editorial insights into your professional DNA.</p>
      </div>

      {loading ? (
        <div className="bg-[#fbf2ed] p-12 rounded-[2rem] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#1d2b3e]/20 border-t-[#1d2b3e] rounded-full animate-spin"></div>
            <p className="text-sm text-[#44474c] animate-pulse">Consulting the AI Career Navigator...</p>
        </div>
      ) : error ? (
        <div className="bg-[#ffdad6]/50 p-8 rounded-[2rem] text-center">
            <p className="text-[#93000a] mb-4">{error}</p>
            <button onClick={fetchInsight} className="bg-[#ba1a1a] text-white px-6 py-2 rounded-xl text-sm font-bold">Try Again</button>
        </div>
      ) : insight ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* Main Narrative Card */}
          <div className="md:col-span-2 lg:col-span-2 bg-[#fbf2ed] p-8 rounded-[2rem] space-y-6">
            <h4 className="font-serif text-2xl font-bold leading-tight text-[#1d2b3e]">Your Narrative</h4>
            <p className="text-[#44474c] leading-relaxed text-[15px]">
                {parseInsight(insight).narrative}
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              {results.topThreeDomains.map(d => (
                 <span key={d} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-[#1d2b3e] shadow-sm">
                    {DOMAIN_NAMES[d]} Driven
                 </span>
              ))}
            </div>
          </div>

          {/* Action Items Card */}
          <div className="bg-[#334155] text-white p-8 rounded-[2rem] space-y-6">
            <h4 className="font-serif text-xl font-bold">Core Strengths</h4>
            <ul className="space-y-4">
              {parseInsight(insight).actions.map((act, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-0.5"><Bolt size={16} className="text-[#80d5cb]" /></div>
                  <span className="text-sm font-medium leading-relaxed text-white/90">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Modern Career Matches */}
          <div className="bg-[#eae1dc] p-8 rounded-[2rem] space-y-6 shadow-inner">
            <h4 className="font-serif text-xl font-bold text-[#1d2b3e]">AI Career Echoes</h4>
            <div className="space-y-5">
              {parseInsight(insight).careers.map((career, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="text-[10px] uppercase tracking-widest text-[#515f74] font-bold mb-1">
                      {i === 0 ? 'Optimal Pivot' : i === 1 ? 'Strategic Path' : 'Emerging Path'}
                  </div>
                  <div className="text-lg font-serif font-bold text-[#1d2b3e] group-hover:text-[#004944] transition-colors leading-tight">
                      {career.title}
                  </div>
                  {career.reason && <div className="text-xs text-[#515f74] mt-1 line-clamp-2 leading-relaxed">{career.reason}</div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}
    </section>
  );
};

export default GeminiInsights;
