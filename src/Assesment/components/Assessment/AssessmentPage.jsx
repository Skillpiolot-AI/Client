import React, { useState, useEffect } from 'react';
import { questionAPI, assessmentAPI } from '../../services/api';
import QuestionCard from './QuestionCard';
import ProgressBar from './ProgressBar';
import '../../styles/assessment.css';

// Professional icons instead of emojis
const DOMAIN_INFO = {
  R: { name: 'Realistic', color: '#166534' },
  I: { name: 'Investigative', color: '#0f766e' },
  A: { name: 'Artistic', color: '#9f1239' },
  S: { name: 'Social', color: '#047857' },
  E: { name: 'Enterprising', color: '#b45309' },
  C: { name: 'Conventional', color: '#1e40af' }
};

const AssessmentPage = ({ onComplete, onViewHistory }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await questionAPI.getAll();
      setQuestions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to load questions. Please try again.');
    }
  };

  const handleAnswer = async (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setAnimating(true);

    setTimeout(async () => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnimating(false);
      } else {
        await submitAssessment(newAnswers);
      }
    }, 300);
  };

  // ── Auto-select all questions randomly (for testing) ─────────────────────
  const handleAutoSelect = async () => {
    if (questions.length === 0) return;
    const randomAnswers = {};
    questions.forEach(q => {
      randomAnswers[q.id] = Math.floor(Math.random() * 5) + 1; // 1–5
    });
    setAnswers(randomAnswers);
    setCurrentQuestion(questions.length - 1);
    await submitAssessment(randomAnswers);
  };

  const submitAssessment = async (finalAnswers) => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId') || 'user-' + Date.now();

      if (!token) {
        localStorage.setItem('userId', userId);
      }

      const response = await assessmentAPI.create({
        userId,
        answers: finalAnswers
      });

      onComplete(response.data);
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Failed to submit assessment. Please try again.');
      setSubmitting(false);
      setAnimating(false);
    }
  };

  if (loading) {
    return (
      <div className="assessment-loading">
        <div className="loader"></div>
        <p>Loading assessment...</p>
      </div>
    );
  }

  if (submitting) {
    return (
      <div className="assessment-loading">
        <div className="loader"></div>
        <p>Analyzing your responses...</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const domain = DOMAIN_INFO[question.domain];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="assessment-page">
      <div className="assessment-container">
        <ProgressBar
          current={currentQuestion + 1}
          total={questions.length}
          progress={progress}
        />

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={onViewHistory}
            style={{
              background: '#ffffff',
              color: '#4f46e5',
              border: '1px solid #e0e7ff',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
            onMouseOut={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.borderColor = '#e0e7ff'; }}
          >
            📋 View History
          </button>
          
          <button
            onClick={handleAutoSelect}
            style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(102,126,234,0.4)',
              transition: 'opacity 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
            onMouseOut={e => e.currentTarget.style.opacity = '1'}
            title="Randomly answers all questions instantly (testing only)"
          >
            🎲 Auto-Select All (Test)
          </button>
        </div>

        <QuestionCard
          question={question}
          domain={domain}
          onAnswer={handleAnswer}
          animating={animating}
        />
      </div>
    </div>
  );
};

export default AssessmentPage;