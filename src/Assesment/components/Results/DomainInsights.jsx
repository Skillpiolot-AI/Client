import React from 'react';

const DOMAIN_INFO = {
  R: { 
    name: 'Realistic', 
    emoji: '🔧', 
    color: '#475569',
    description: 'You enjoy hands-on, practical work with tools, machines, and nature. You prefer working with your hands to create tangible results.',
    characteristics: ['Mechanical', 'Practical', 'Physical', 'Outdoor-oriented'],
    careers: ['Engineer', 'Technician', 'Mechanic', 'Construction Worker']
  },
  I: { 
    name: 'Investigative', 
    emoji: '🔬', 
    color: '#0f766e',
    description: 'You enjoy analyzing problems, conducting research, and learning about scientific topics. You prefer intellectual challenges.',
    characteristics: ['Analytical', 'Curious', 'Intellectual', 'Methodical'],
    careers: ['Scientist', 'Researcher', 'Analyst', 'Doctor']
  },
  A: { 
    name: 'Artistic', 
    emoji: '🎨', 
    color: '#be123c',
    description: 'You enjoy creative expression through art, design, and performance. You prefer unstructured environments.',
    characteristics: ['Creative', 'Imaginative', 'Expressive', 'Original'],
    careers: ['Artist', 'Designer', 'Writer', 'Musician']
  },
  S: { 
    name: 'Social', 
    emoji: '👥', 
    color: '#047857',
    description: 'You enjoy helping, teaching, and working with people. You are empathetic and collaborative.',
    characteristics: ['Helpful', 'Empathetic', 'Cooperative', 'Patient'],
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker']
  },
  E: { 
    name: 'Enterprising', 
    emoji: '💼', 
    color: '#c2410c',
    description: 'You enjoy leading, persuading, and managing others. You are comfortable taking risks and making decisions.',
    characteristics: ['Ambitious', 'Persuasive', 'Confident', 'Energetic'],
    careers: ['Manager', 'Entrepreneur', 'Sales Professional', 'Lawyer']
  },
  C: { 
    name: 'Conventional', 
    emoji: '📊', 
    color: '#4338ca',
    description: 'You enjoy organizing, managing data, and following procedures. You are detail-oriented and systematic.',
    characteristics: ['Organized', 'Detail-oriented', 'Systematic', 'Efficient'],
    careers: ['Accountant', 'Administrator', 'Analyst', 'Banker']
  }
};

const DomainInsights = ({ results }) => {
  const topThree = results.sorted.slice(0, 3);

  return (
    <div className="domain-insights">
      <h2 className="section-title">Your Top Personality Traits</h2>
      
      <div className="insights-grid">
        {topThree.map(({ domain, score }, index) => {
          const info = DOMAIN_INFO[domain];
          return (
            <div key={domain} className="insight-card">
              <div className="insight-header">
                <div className="insight-rank" style={{ backgroundColor: info.color }}>
                  #{index + 1}
                </div>
                <div className="insight-info">
                  <span className="insight-emoji">{info.emoji}</span>
                  <h3 className="insight-name" style={{ color: info.color }}>
                    {info.name}
                  </h3>
                  <span className="insight-score">{score}% match</span>
                </div>
              </div>

              <p className="insight-description">{info.description}</p>

              <div className="insight-characteristics">
                <h4 className="characteristics-title">Key Characteristics:</h4>
                <div className="characteristics-tags">
                  {info.characteristics.map((char, idx) => (
                    <span key={idx} className="characteristic-tag">
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              <div className="insight-careers">
                <h4 className="careers-title">Related Careers:</h4>
                <div className="careers-tags">
                  {info.careers.map((career, idx) => (
                    <span key={idx} className="career-tag">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DomainInsights;