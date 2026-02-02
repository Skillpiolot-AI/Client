import React from 'react';

const DOMAIN_INFO = {
  R: { name: 'Realistic', emoji: '🔧', description: 'Hands-on, practical, mechanical work' },
  I: { name: 'Investigative', emoji: '🔬', description: 'Research, analysis, problem-solving' },
  A: { name: 'Artistic', emoji: '🎨', description: 'Creative expression and design' },
  S: { name: 'Social', emoji: '👥', description: 'Helping and working with people' },
  E: { name: 'Enterprising', emoji: '💼', description: 'Leadership and business ventures' },
  C: { name: 'Conventional', emoji: '📊', description: 'Organization and data management' }
};

const DomainInfoSection = () => {
  return (
    <section className="domain-info-section">
      <div className="container">
        <h2 className="section-title">Six Career Personality Types</h2>
        <div className="domains-grid">
          {Object.entries(DOMAIN_INFO).map(([code, info]) => (
            <div key={code} className="domain-card">
              <div className="domain-header">
                <span className="domain-emoji">{info.emoji}</span>
                <h3 className="domain-name">{info.name}</h3>
              </div>
              <p className="domain-description">{info.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DomainInfoSection;