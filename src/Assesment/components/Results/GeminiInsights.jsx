/**
 * GeminiInsights.jsx
 * Calls the Gemini API directly from the frontend to generate
 * a personalised personality profile + career suggestions
 * based on the user's RIASEC domain scores and Holland code.
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const DOMAIN_NAMES = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

const GEMINI_API_KEY = 'AIzaSyAgCZgD0arBw44nV3cAs8d8xqUE7R9vvdc';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

function buildPrompt(results) {
  const { hollandCode, sorted, topThreeDomains } = results;
  const topDomains = (topThreeDomains || sorted.slice(0, 3).map(s => s.domain))
    .map(d => `${d} (${DOMAIN_NAMES[d]})`)
    .join(', ');

  const scoreLines = sorted
    .map(s => `  • ${DOMAIN_NAMES[s.domain]} (${s.domain}): ${Math.round(s.score)}%`)
    .join('\n');

  return `You are an expert career counsellor and organizational psychologist specializing in the RIASEC / Holland Code personality model.

A user has completed the RIASEC career assessment. Here are their detailed results:

Holland Code: ${hollandCode}
Top domains: ${topDomains}

Full domain scores:
${scoreLines}

Based on these results, please provide a deep, highly personalized, and encouraging analysis structured exactly as follows. Use professional yet accessible language. Do NOT use markdown headers (like # or ##); instead, separate sections with a blank line. Number your sections exactly as shown below:

1. PERSONALITY DEEP DIVE (2–3 sentences): Describe their unique personality profile and how these specific traits interact.

2. IDEAL WORK ENVIRONMENT (2 sentences): Describe the physical and cultural work environment where this person will thrive most.

3. CORE STRENGTHS & SUPERPOWER (3 brief bullet points): List 3 specific strengths, highlighting one as their ultimate "superpower" in the workplace.

4. TOP CAREER MATCHES: List 4 specific, modern career titles that best match ${hollandCode}. Each must be on its own line in this exact format:
   → [Career Title] — [One brief reason why]

CRITICAL INSTRUCTION: Keep the entire response strictly under 250 words total to prevent being cut off. Be empowering and highly specific.`;
}

const GeminiInsights = ({ results }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (results?.hollandCode) fetchInsight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results?.hollandCode]);

  const fetchInsight = async () => {
    setLoading(true);
    setError(null);
    setInsight('');

    try {
      const prompt = buildPrompt(results);
      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2000,
          },
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `API error ${res.status}`);
      }

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setInsight(text.trim());
    } catch (err) {
      console.error('Gemini error:', err);
      setError(err.message || 'Failed to generate insights. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format the plain-text response into styled paragraphs
  const renderInsight = (text) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={i} style={{ height: '12px' }} />;

      // Section headers like "1. PERSONALITY DEEP DIVE" or "**1. Ideal Work Environment**"
      const unbolded = trimmed.replace(/\*\*/g, '');
      if (/^\d+\.\s+[A-Za-z]/.test(unbolded)) {
        return (
          <h4 key={i} style={{ 
            fontWeight: 700, 
            color: '#4f46e5', 
            marginTop: '20px', 
            marginBottom: '8px', 
            fontSize: '14px', 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase',
            borderBottom: '1px solid #e0e7ff',
            paddingBottom: '4px'
          }}>
            {unbolded.replace(/^\d+\.\s+/, '').replace(/:$/, '')}
          </h4>
        );
      }

      // Career lines starting with →
      if (trimmed.startsWith('→')) {
        const parts = trimmed.slice(1).split('—');
        const title = parts[0];
        const rest = parts.slice(1);
        return (
          <div key={i} style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'flex-start', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #818cf8' }}>
            <span style={{ color: '#4f46e5', fontWeight: 700, marginTop: '2px', flexShrink: 0 }}>→</span>
            <span>
              <strong style={{ color: '#111827', display: 'block', marginBottom: '2px' }}>{title?.trim()}</strong>
              {rest.length > 0 && <span style={{ color: '#4b5563', fontSize: '13.5px', lineHeight: '1.5' }}>{rest.join('—').trim()}</span>}
            </span>
          </div>
        );
      }
      // Bullet points
      // Sometimes Gemini yields `* **Point:**`, so let's clean bolding globally first for this line
      const cleanLine = trimmed.replace(/\*\*/g, '').trim();
      
      if (cleanLine.startsWith('•') || cleanLine.startsWith('-') || cleanLine.startsWith('*')) {
        return (
          <div key={i} style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'flex-start' }}>
            <span style={{ color: '#4f46e5', flexShrink: 0, marginTop: '2px', fontSize: '18px', lineHeight: '1' }}>•</span>
            <span style={{ color: '#374151', fontSize: '14.5px', lineHeight: '1.6' }}>
              {cleanLine.replace(/^[•\-\*]\s*/, '')}
            </span>
          </div>
        );
      }

      // Standard paragraphs
      return (
        <p key={i} style={{ color: '#374151', fontSize: '14.5px', lineHeight: '1.7', marginTop: '6px' }}>
          {cleanLine}
        </p>
      );
    });
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e7ff',
      borderRadius: '16px',
      overflow: 'hidden',
      marginTop: '28px',
      boxShadow: '0 4px 24px rgba(79,70,229,0.08)',
    }}>
      {/* Header */}
      <div
        onClick={() => setExpanded(p => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 24px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={20} color="white" />
          <div>
            <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', margin: 0 }}>
              AI Personality Analysis
            </p>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', margin: 0 }}>
              Powered by Gemini · Personalised for Holland Code {results?.hollandCode}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {expanded ? <ChevronUp size={20} color="white" /> : <ChevronDown size={20} color="white" />}
        </div>
      </div>

      {/* Body */}
      {expanded && (
        <div style={{ padding: '24px' }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px', gap: '16px' }}>
              {/* Animated spinner */}
              <div style={{
                width: '40px', height: '40px',
                border: '3px solid #e0e7ff',
                borderTop: '3px solid #4f46e5',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                Gemini is analysing your personality profile…
              </p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {error && !loading && (
            <div style={{ textAlign: 'center', padding: '24px' }}>
              <p style={{ color: '#dc2626', fontSize: '14px', marginBottom: '12px' }}>⚠️ {error}</p>
              <button
                onClick={fetchInsight}
                style={{ background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', padding: '8px 16px', cursor: 'pointer', fontSize: '13px' }}
              >
                Try Again
              </button>
            </div>
          )}

          {insight && !loading && (
            <div>{renderInsight(insight)}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default GeminiInsights;
