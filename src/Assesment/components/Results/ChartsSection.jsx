import React from 'react';
import {
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const DOMAIN_INFO = {
  R: { name: 'Realistic', color: '#8b5cf6', gradient: ['#8b5cf6', '#6d28d9'] },
  I: { name: 'Investigative', color: '#06b6d4', gradient: ['#06b6d4', '#0891b2'] },
  A: { name: 'Artistic', color: '#f43f5e', gradient: ['#f43f5e', '#e11d48'] },
  S: { name: 'Social', color: '#10b981', gradient: ['#10b981', '#059669'] },
  E: { name: 'Enterprising', color: '#f59e0b', gradient: ['#f59e0b', '#d97706'] },
  C: { name: 'Conventional', color: '#3b82f6', gradient: ['#3b82f6', '#2563eb'] }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        padding: '12px 16px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        border: '2px solid #e2e8f0'
      }}>
        <p style={{ 
          fontWeight: '700', 
          color: '#1e293b',
          marginBottom: '4px',
          fontSize: '14px'
        }}>
          {payload[0].payload.name}
        </p>
        <p style={{ 
          fontWeight: '900', 
          color: payload[0].fill,
          fontSize: '18px'
        }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const ChartsSection = ({ results }) => {
  const radarData = results.sorted.map(({ domain, score }) => ({
    domain,
    name: DOMAIN_INFO[domain].name,
    score: score,
    fullMark: 100
  }));

  const barData = results.sorted.map(({ domain, score }) => ({
    domain,
    name: DOMAIN_INFO[domain].name,
    score: score,
    color: DOMAIN_INFO[domain].color
  }));

  return (
    <div className="charts-section">
      {/* Radar Chart */}
      <div className="chart-card">
        <h3 className="chart-title">
          🎯 Personality Profile
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <defs>
              {Object.entries(DOMAIN_INFO).map(([key, info]) => (
                <linearGradient key={key} id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={info.gradient[0]} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={info.gradient[1]} stopOpacity={0.3} />
                </linearGradient>
              ))}
            </defs>
            <PolarGrid 
              stroke="#cbd5e1" 
              strokeWidth={2}
            />
            <PolarAngleAxis 
              dataKey="name" 
              tick={{ 
                fill: '#475569', 
                fontSize: 13,
                fontWeight: 700
              }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ 
                fill: '#64748b',
                fontSize: 12,
                fontWeight: 600
              }}
              stroke="#cbd5e1"
            />
            <Radar 
              name="Score" 
              dataKey="score" 
              stroke="#667eea" 
              fill="url(#gradient-R)" 
              fillOpacity={0.6}
              strokeWidth={3}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="chart-card">
        <h3 className="chart-title">
          📊 Detailed Scores
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart 
            data={barData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <defs>
              {Object.entries(DOMAIN_INFO).map(([key, info]) => (
                <linearGradient key={key} id={`bar-gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={info.gradient[0]} />
                  <stop offset="100%" stopColor={info.gradient[1]} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              tick={{ 
                fill: '#475569', 
                fontSize: 12,
                fontWeight: 700
              }}
              angle={-15}
              textAnchor="end"
              height={80}
              stroke="#cbd5e1"
            />
            <YAxis 
              tick={{ 
                fill: '#64748b',
                fontSize: 12,
                fontWeight: 600
              }}
              stroke="#cbd5e1"
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="score" 
              radius={[12, 12, 0, 0]}
              maxBarSize={80}
            >
              {barData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#bar-gradient-${entry.domain})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;