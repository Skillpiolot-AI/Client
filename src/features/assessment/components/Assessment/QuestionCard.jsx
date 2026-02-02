import React from 'react';
import { ArrowRight } from 'lucide-react';

const options = [
  { value: 5, label: 'Strongly Agree' },
  { value: 4, label: 'Agree' },
  { value: 3, label: 'Neutral' },
  { value: 2, label: 'Disagree' },
  { value: 1, label: 'Strongly Disagree' }
];

const QuestionCard = ({ question, domain, onAnswer, animating }) => {
  return (
    <div className={`question-card ${animating ? 'animating' : ''}`}>
      <div className="question-header">
        <span className="question-emoji">{domain.emoji}</span>
        <span 
          className="question-badge"
          style={{ 
            backgroundColor: domain.color + '15',
            color: domain.color 
          }}
        >
          {domain.name}
        </span>
      </div>

      <h2 className="question-text">{question.text}</h2>

      <div className="options-container">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className="option-btn"
          >
            <span className="option-label">{option.label}</span>
            <ArrowRight className="option-icon" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;