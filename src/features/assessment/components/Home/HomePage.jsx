import React from 'react';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import DomainInfoSection from './DomainInfoSection';
import '../../styles/home.css';

const HomePage = ({ onStartAssessment }) => {
  return (
    <div className="home-page">
      <HeroSection onStartAssessment={onStartAssessment} />
      <FeaturesSection />
      <DomainInfoSection />
    </div>
  );
};

export default HomePage;