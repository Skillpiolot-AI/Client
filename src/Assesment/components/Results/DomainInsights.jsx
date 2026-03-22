import React from 'react';
import { Users, TrendingUp, Presentation, Briefcase, Search, LayoutTemplate } from 'lucide-react';

const DOMAIN_DETAILS = {
  R: {
    name: 'Realistic',
    icon: <Briefcase size={20} />,
    description: 'The "Doers". You are practical, mechanical, and realistic. You prefer working with things, tools, and machines rather than ideas or people.',
    focusArea: 'Action & Execution',
    focusExample: 'Engineering, logistics, hands-on development.'
  },
  I: {
    name: 'Investigative',
    icon: <Search size={20} />,
    description: 'The "Thinkers". You are analytical, intellectual, and scientific. You prefer observing, learning, evaluating, and solving complex problems.',
    focusArea: 'Analysis & Logic',
    focusExample: 'Data science, research, strategic planning.'
  },
  A: {
    name: 'Artistic',
    icon: <LayoutTemplate size={20} />,
    description: 'The "Creators". You are innovative, intuitive, and expressive. You prefer unstructured environments that allow for imagination and originality.',
    focusArea: 'Design & Creativity',
    focusExample: 'Creative direction, UX design, content strategy.'
  },
  S: {
    name: 'Social',
    icon: <Users size={20} />,
    description: 'The "Helpers". You excel in environments that prioritize interpersonal relationships, teaching, and wellness. Your strength lies in empathetic communication.',
    focusArea: 'Work Environment',
    focusExample: 'Educational institutions, non-profits, HR hubs.'
  },
  E: {
    name: 'Enterprising',
    icon: <TrendingUp size={20} />,
    description: 'The "Persuaders". You are naturally drawn to leadership, risk-taking, and public speaking. You enjoy influencing others to achieve goals.',
    focusArea: 'Skill Focus',
    focusExample: 'Public speaking, negotiation, resource allocation.'
  },
  C: {
    name: 'Conventional',
    icon: <Presentation size={20} />,
    description: 'The "Organizers". You value order, data integrity, and clear protocols. Your work is marked by high precision and reliability.',
    focusArea: 'Ideal Tasks',
    focusExample: 'Managing databases, financial reporting, logic auditing.'
  }
};

const DomainInsights = ({ results }) => {
  const { topThreeDomains } = results;

  return (
    <section className="space-y-10 mt-16 font-sans">
      <h2 className="text-3xl font-serif font-bold tracking-tight text-center text-[#1d2b3e]">Top Domain Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {topThreeDomains.map((domainCode, index) => {
          const detail = DOMAIN_DETAILS[domainCode];
          if (!detail) return null;

          return (
            <div 
              key={index} 
              className="group bg-[#fbf2ed] hover:bg-white transition-all duration-300 p-8 rounded-[2.5rem] space-y-6 hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-transparent hover:border-[#c5c6cd]/20"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[#1d2b3e] to-[#334155] rounded-2xl flex items-center justify-center text-white shadow-md">
                {detail.icon}
              </div>
              <h3 className="text-2xl font-serif font-bold text-[#1d2b3e]">{detail.name}</h3>
              <p className="text-sm text-[#515f74] leading-relaxed min-h-[80px]">
                {detail.description}
              </p>
              
              <div className="space-y-3 pt-4 border-t border-[#c5c6cd]/10">
                <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-[#004944]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#004944]"></span>
                  {detail.focusArea}
                </div>
                <p className="text-sm font-medium text-[#1f1b18]">
                    {detail.focusExample}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DomainInsights;