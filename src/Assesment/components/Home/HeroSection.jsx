import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroSection = ({ onStartAssessment }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <span className="hero-badge">Professional Career Assessment</span>
          <h1 className="hero-title">
            Discover Your Ideal Career Path
          </h1>
          <p className="hero-description">
            Take our scientifically validated RIASEC assessment to uncover your personality type 
            and find careers that match your interests and strengths.
          </p>
          <button 
            onClick={onStartAssessment}
            className="btn-primary hero-btn"
          >
            Start Assessment
            <ArrowRight className="btn-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;