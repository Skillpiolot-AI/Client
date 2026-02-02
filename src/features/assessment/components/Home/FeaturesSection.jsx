import React from 'react';
import { Target, BarChart3, Briefcase } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Personalized Results',
    description: 'Get detailed insights based on your unique responses'
  },
  {
    icon: BarChart3,
    title: 'Visual Analytics',
    description: 'Interactive charts and graphs to understand your profile'
  },
  {
    icon: Briefcase,
    title: 'Career Matches',
    description: 'Discover careers aligned with your personality type'
  }
];

const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="container">
        <div className="features-grid">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="feature-card">
                <div className="feature-icon">
                  <Icon size={32} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;