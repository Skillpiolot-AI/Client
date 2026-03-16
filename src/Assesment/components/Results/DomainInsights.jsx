import React from 'react';
import { Wrench, Microscope, Palette, Users, Briefcase, BarChart3 } from 'lucide-react';

const DOMAIN_INFO = {
  R: {
    name: 'Realistic',
    Icon: Wrench,
    color: '#166534',
    description: 'You enjoy hands-on, practical work with tools, machines, and nature. You prefer working with your hands to create tangible results.',
    characteristics: ['Mechanical', 'Practical', 'Physical', 'Outdoor-oriented'],
    careers: ['Engineer', 'Technician', 'Mechanic', 'Construction Worker']
  },
  I: {
    name: 'Investigative',
    Icon: Microscope,
    color: '#0f766e',
    description: 'You enjoy analyzing problems, conducting research, and learning about scientific topics. You prefer intellectual challenges.',
    characteristics: ['Analytical', 'Curious', 'Intellectual', 'Methodical'],
    careers: ['Scientist', 'Researcher', 'Analyst', 'Doctor']
  },
  A: {
    name: 'Artistic',
    Icon: Palette,
    color: '#9f1239',
    description: 'You enjoy creative expression through art, design, and performance. You prefer unstructured environments.',
    characteristics: ['Creative', 'Imaginative', 'Expressive', 'Original'],
    careers: ['Artist', 'Designer', 'Writer', 'Musician']
  },
  S: {
    name: 'Social',
    Icon: Users,
    color: '#047857',
    description: 'You enjoy helping, teaching, and working with people. You are empathetic and collaborative.',
    characteristics: ['Helpful', 'Empathetic', 'Cooperative', 'Patient'],
    careers: ['Teacher', 'Counselor', 'Nurse', 'Social Worker']
  },
  E: {
    name: 'Enterprising',
    Icon: Briefcase,
    color: '#b45309',
    description: 'You enjoy leading, persuading, and managing others. You are comfortable taking risks and making decisions.',
    characteristics: ['Ambitious', 'Persuasive', 'Confident', 'Energetic'],
    careers: ['Manager', 'Entrepreneur', 'Sales Professional', 'Lawyer']
  },
  C: {
    name: 'Conventional',
    Icon: BarChart3,
    color: '#1e40af',
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
          const Icon = info.Icon;

          return (
            <div key={domain} className="insight-card">
              <div className="insight-header">
                <div className="insight-rank" style={{ backgroundColor: info.color }}>
                  #{index + 1}
                </div>
                <div className="insight-info">
                  <div className="insight-icon" style={{ backgroundColor: `${info.color}15` }}>
                    <Icon size={24} color={info.color} />
                  </div>
                  <div>
                    <h3 className="insight-name" style={{ color: info.color }}>
                      {info.name}
                    </h3>
                    <span className="insight-score">{score}% match</span>
                  </div>
                </div>
              </div>

              <p className="insight-description">{info.description}</p>

              <div className="insight-characteristics">
                <h4 className="characteristics-title">Key Characteristics:</h4>
                <div className="characteristics-tags">
                  {info.characteristics.map((char, idx) => (
                    <span
                      key={idx}
                      className="characteristic-tag"
                      style={{
                        backgroundColor: `${info.color}10`,
                        color: info.color,
                        borderColor: `${info.color}30`
                      }}
                    >
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

      <style>{`
        .domain-insights {
          margin-bottom: 32px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 20px;
        }

        .insights-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .insight-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 24px;
        }

        .insight-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .insight-rank {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .insight-info {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
        }

        .insight-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .insight-name {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }

        .insight-score {
          font-size: 13px;
          color: #6b7280;
        }

        .insight-description {
          color: #4b5563;
          font-size: 14px;
          line-height: 1.6;
          margin-bottom: 16px;
        }

        .characteristics-title,
        .careers-title {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 8px 0;
        }

        .characteristics-tags,
        .careers-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .characteristic-tag {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid;
        }

        .career-tag {
          padding: 4px 10px;
          background: #f3f4f6;
          border-radius: 6px;
          font-size: 12px;
          color: #374151;
        }

        .insight-characteristics {
          margin-bottom: 16px;
        }

        @media (max-width: 1024px) {
          .insights-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default DomainInsights;