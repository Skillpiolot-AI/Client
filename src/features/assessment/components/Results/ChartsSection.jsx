import React from 'react';
import {
  BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

// Professional color palette
const DOMAIN_INFO = {
  R: { name: 'Realistic', color: '#166534' },
  I: { name: 'Investigative', color: '#0f766e' },
  A: { name: 'Artistic', color: '#9f1239' },
  S: { name: 'Social', color: '#047857' },
  E: { name: 'Enterprising', color: '#b45309' },
  C: { name: 'Conventional', color: '#1e40af' }
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <p style={{
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '4px',
          fontSize: '14px'
        }}>
          {payload[0].payload.name}
        </p>
        <p style={{
          fontWeight: '700',
          color: payload[0].payload.color || '#166534',
          fontSize: '18px',
          margin: 0
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
    name: DOMAIN_INFO[domain]?.name || domain,
    score: score,
    fullMark: 100,
    color: DOMAIN_INFO[domain]?.color || '#166534'
  }));

  const barData = results.sorted.map(({ domain, score }) => ({
    domain,
    name: DOMAIN_INFO[domain]?.name || domain,
    score: score,
    color: DOMAIN_INFO[domain]?.color || '#166534'
  }));

  // Data for donut chart (top 3 domains)
  const pieData = results.sorted.slice(0, 3).map(({ domain, score }) => ({
    name: DOMAIN_INFO[domain]?.name || domain,
    value: score,
    color: DOMAIN_INFO[domain]?.color || '#166534'
  }));

  const topScore = results.sorted[0]?.score || 0;
  const topDomain = results.sorted[0]?.domain || 'N/A';

  return (
    <div className="charts-section">
      {/* Summary Stats Cards */}
      <div className="stats-row">
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-label">Dominant Trait</span>
          </div>
          <div className="stat-value">{DOMAIN_INFO[topDomain]?.name || topDomain}</div>
          <div className="stat-change">{topScore}% match score</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Secondary Trait</span>
          </div>
          <div className="stat-value">{DOMAIN_INFO[results.sorted[1]?.domain]?.name || 'N/A'}</div>
          <div className="stat-change">{results.sorted[1]?.score || 0}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Tertiary Trait</span>
          </div>
          <div className="stat-value">{DOMAIN_INFO[results.sorted[2]?.domain]?.name || 'N/A'}</div>
          <div className="stat-change">{results.sorted[2]?.score || 0}%</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-label">Career Matches</span>
          </div>
          <div className="stat-value">{results.recommendedCareers?.length || 0}</div>
          <div className="stat-change">Recommended careers</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Radar Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Personality Profile</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={radarData} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
                <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{
                    fill: '#374151',
                    fontSize: 11,
                    fontWeight: 500
                  }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{
                    fill: '#9ca3af',
                    fontSize: 10
                  }}
                  stroke="#e5e7eb"
                  tickCount={5}
                />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#166534"
                  fill="#16a34a"
                  fillOpacity={0.4}
                  strokeWidth={2}
                />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="chart-card">
          <h3 className="chart-title">Profile Breakdown</h3>
          <div className="donut-wrapper">
            <div className="donut-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-center">
                <span className="donut-value">{topScore}%</span>
                <span className="donut-label">Top Match</span>
              </div>
            </div>
            <div className="donut-legend">
              {pieData.map((entry, index) => (
                <div key={index} className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: entry.color }}></span>
                  <span className="legend-name">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart - Full Width */}
      <div className="chart-card">
        <h3 className="chart-title">Detailed Score Breakdown</h3>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={barData}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{
                  fill: '#374151',
                  fontSize: 11,
                  fontWeight: 500
                }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tick={{
                  fill: '#9ca3af',
                  fontSize: 11
                }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="score"
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              >
                {barData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <style>{`
        .charts-section {
          margin-bottom: 32px;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .stat-card.primary {
          background: #166534;
          color: white;
          border: none;
        }

        .stat-header {
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 13px;
          color: #6b7280;
        }

        .stat-card.primary .stat-label {
          color: rgba(255, 255, 255, 0.8);
        }

        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 4px;
        }

        .stat-card.primary .stat-value {
          color: white;
        }

        .stat-change {
          font-size: 12px;
          color: #6b7280;
        }

        .stat-card.primary .stat-change {
          color: rgba(255, 255, 255, 0.8);
        }

        .charts-row {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .chart-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
        }

        .chart-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 16px 0;
          padding-left: 12px;
          border-left: 3px solid #166534;
        }

        .chart-wrapper {
          width: 100%;
        }

        .donut-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .donut-container {
          position: relative;
          width: 100%;
          height: 200px;
        }

        .donut-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .donut-value {
          display: block;
          font-size: 24px;
          font-weight: 700;
          color: #166534;
        }

        .donut-label {
          display: block;
          font-size: 11px;
          color: #6b7280;
        }

        .donut-legend {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 12px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .legend-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .legend-name {
          font-size: 12px;
          color: #374151;
        }

        @media (max-width: 1024px) {
          .stats-row {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .charts-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .stats-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartsSection;