"use client"

import { useState } from "react"
import { itemOrder, itemText, domainNames, domainEmojis } from "../data/riasecData"
import { scoreAssessment } from "../utils/scoring"
import ResultsGraphs from "./ResultsGraphs"
import "../styles/questionnaire.css"

export default function QuestionnaireForm() {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (itemId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [itemId]: Number.parseInt(value),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const scoredResult = scoreAssessment(answers)

      // Save to backend
      const response = await fetch("http://localhost:5000/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user-" + Date.now(),
          answers,
          results: scoredResult,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setResult(scoredResult)
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted && result) {
    return <ResultsGraphs result={result} />
  }

  const progress = Object.keys(answers).length
  const total = itemOrder.length

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h1>RIASEC Career Assessment</h1>
        <p>Rate each statement from 1 (Strongly Disagree) to 5 (Strongly Agree)</p>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(progress / total) * 100}%` }}></div>
        </div>
        <p className="progress-text">
          {progress} of {total} answered
        </p>
      </div>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {Object.keys(domainNames).map((domain) => (
          <div key={domain} className="domain-section">
            <h2 className="domain-title">
              <span className="domain-emoji">{domainEmojis[domain]}</span>
              {domainNames[domain]}
            </h2>
            <div className="items-grid">
              {itemOrder
                .filter((id) => id.charAt(0) === domain)
                .map((id) => (
                  <div key={id} className="item-card">
                    <label htmlFor={id} className="item-label">
                      {itemText[id]}
                    </label>
                    <div className="likert-scale">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <label key={value} className="likert-option">
                          <input
                            type="radio"
                            name={id}
                            value={value}
                            checked={answers[id] === value}
                            onChange={(e) => handleChange(id, e.target.value)}
                          />
                          <span className="likert-label">{value}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading || progress < total} className="submit-btn">
          {loading ? "Submitting..." : "Submit Assessment"}
        </button>
      </form>
    </div>
  )
}
