"use client"

import { useState } from "react"
import { domainNames, domainEmojis, careerRecommendations } from "../data/riasecData"
import "../styles/results.css"

export default function ResultsGraphs({ result }) {
  const [selectedDomain, setSelectedDomain] = useState(result.sorted[0].domain)

  const getRecommendations = () => {
    return careerRecommendations[result.hollandCode] || []
  }

  const renderBarChart = () => {
    const maxScore = Math.max(...Object.values(result.percentages))
    return (
      <div className="bar-chart">
        {result.sorted.map(({ domain, score }) => (
          <div key={domain} className="bar-item">
            <div className="bar-label">
              {domainEmojis[domain]} {domainNames[domain]}
            </div>
            <div className="bar-container">
              <div className="bar-fill" style={{ width: `${(score / maxScore) * 100}%` }}>
                <span className="bar-value">{score}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <h1>Your RIASEC Assessment Results</h1>
        <div className="holland-code">
          <h2>
            Holland Code: <span className="code-value">{result.hollandCode}</span>
          </h2>
        </div>
      </div>

      <div className="results-content">
        <div className="results-main">
          <div className="chart-section">
            <h3>Your Broad Interests</h3>
            {renderBarChart()}
          </div>

          <div className="recommendations-section">
            <h3>Recommended Careers</h3>
            <div className="careers-grid">
              {getRecommendations().map((career, idx) => (
                <div key={idx} className="career-card">
                  {career}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="results-sidebar">
          <div className="trait-insights">
            <h3>Trait Insights</h3>
            <div className="domain-selector">
              {result.sorted.map(({ domain }) => (
                <button
                  key={domain}
                  className={`domain-btn ${selectedDomain === domain ? "active" : ""}`}
                  onClick={() => setSelectedDomain(domain)}
                >
                  {domainEmojis[domain]} {domainNames[domain]}
                </button>
              ))}
            </div>
            <div className="insight-content">
              <p>
                {domainNames[selectedDomain]} - Score: {result.percentages[selectedDomain]}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
