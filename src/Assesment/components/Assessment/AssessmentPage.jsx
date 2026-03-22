import React, { useState, useEffect } from 'react';
import { questionAPI, assessmentAPI } from '../../services/api';
import QuestionCard from './QuestionCard';

const AssessmentPage = ({ onComplete, onViewHistory }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSelect = (value) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleContinue = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      await submitAssessment(answers);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      // Go back to the dashboard/history
      onViewHistory();
    }
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
    }
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

  if (loading || submitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fdfcfb] text-[#1d2b3e] font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-[#1d2b3e]/20 border-t-[#1d2b3e] animate-spin mb-6"></div>
        <p className="font-serif italic text-xl text-[#505f76]">{submitting ? 'Analyzing your responses...' : 'Loading assessment...'}</p>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const selectedValue = answers[question.id];
  const isValidToContinue = selectedValue !== undefined;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-[#fdfcfb] text-[#1d2b3e] font-sans antialiased relative">
      
      {/* Background grain texture for visual polish */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03] mix-blend-multiply" 
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/asfalt-light.png')" }}
      ></div>

      {/* Modern Top Progress Bar Component inline */}
      <div className="fixed top-16 left-0 w-full h-1 bg-[#e2e8f0]/30 z-40">
        <div 
            className="h-full bg-[#1d2b3e]/40 transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center flex-1 justify-center max-w-4xl mx-auto">
        
        {/* Render the core radial scale question module */}
        <QuestionCard
          question={question}
          step={currentQuestion + 1}
          totalSteps={questions.length}
          selectedValue={selectedValue}
          onSelect={handleSelect}
        />

        {/* Action Controls Footer */}
        <div className="fixed bottom-0 md:bottom-12 w-full max-w-4xl px-6 flex flex-col-reverse justify-center md:flex-row md:justify-between items-center bg-[#fdfcfb]/95 md:bg-transparent py-4 md:py-0 z-[60] backdrop-blur-sm md:backdrop-blur-none border-t border-[#e2e8f0]/30 md:border-none">
          
          <button 
             onClick={handleBack} 
             className="flex items-center gap-3 text-[#505f76] hover:text-[#1d2b3e] transition-colors text-sm group mt-4 md:mt-0 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span className="tracking-wide">Back</span>
          </button>
          
          <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
            {/* Dev helper hidden inside a subtle div to not ruin the layout */}
            <button 
                onClick={handleAutoSelect} 
                className="text-[#505f76]/40 hover:text-[#505f76] transition-colors text-[10px] uppercase tracking-[0.2em] font-semibold hidden md:block"
                title="Randomly fill remainder"
            >
                Auto-Fill Test
            </button>

            <button 
                onClick={handleContinue}
                disabled={!isValidToContinue}
                className={`w-full md:w-auto px-12 py-4 text-sm font-semibold tracking-[0.1em] transition-all duration-500 flex items-center justify-center gap-4 group rounded-xl md:rounded-full
                  ${isValidToContinue ? 'bg-[#1d2b3e] text-white hover:bg-[#004944]' : 'bg-[#e2e8f0] text-[#505f76]/50 cursor-not-allowed'}
                `}
            >
                <span>{currentQuestion === questions.length - 1 ? 'SUBMIT' : 'CONTINUE'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${isValidToContinue ? 'group-hover:translate-x-1 transition-transform' : 'opacity-50'}`}>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
          </div>

        </div>

        {/* Subtle Brand Detail (Side Rotated Typography) */}
        <div className="fixed left-12 top-1/2 -rotate-90 origin-left hidden lg:block z-0 pointer-events-none">
            <span className="text-[10px] uppercase tracking-[0.5em] font-light text-[#505f76]/30">
                Aeronaut Strategic Navigator
            </span>
        </div>

      </div>
    </div>
  );
};

export default AssessmentPage;