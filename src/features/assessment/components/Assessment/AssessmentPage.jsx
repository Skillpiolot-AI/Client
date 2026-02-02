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

const AssessmentPage = ({ onComplete }) => {
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
        // Submit assessment
        await submitAssessment(newAnswers);
      }
    }, 300);
  };

  const submitAssessment = async (finalAnswers) => {
    setSubmitting(true);
    try {
      // Use authenticated user ID from token if available
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