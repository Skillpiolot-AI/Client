import React, { useState } from 'react';
import { DollarSign, GraduationCap, MapPin, ArrowRight } from 'lucide-react';

const CareerRecommendations = ({ careers }) => {
  const [filter, setFilter] = useState('all');

  const filteredCareers = filter === 'all' 
    ? careers 
    : careers.filter(c => c.career_type === filter);

  const formatSalary = (range) => {
    if (!range || !range['0_2']) return 'N/A';
    const { salary_from, salary_to } = range['0_2'];
    return `₹${(salary_from / 100000).toFixed(1)}L - ₹${(salary_to / 100000).toFixed(1)}L`;
  };

  const getMatchLabel = (value) => {
    if (value >= 4) return { label: 'Perfect Fit', style: 'bg-[#9cf2e8] text-[#00504a]' };
    if (value >= 3) return { label: 'High Match', style: 'bg-[#d3e4fe] text-[#0b1c30]' };
    if (value >= 2) return { label: 'Strategic', style: 'bg-[#d0e1fb] text-[#1d2b3e]' };
    return { label: 'Potential', style: 'bg-[#eae1dc] text-[#44474c]' };
  };

  return (
    <section className="space-y-12 mt-16 font-sans">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#1d2b3e]">Tailored Opportunities</h2>
        <p className="text-[#515f74] max-w-2xl mx-auto">Selected career paths that maximize the intersection of your primary personality drivers.</p>
        
        {/* Simple Filters */}
        <div className="flex justify-center gap-3 pt-6">
          {['all', 'Professional', 'Vocational'].map(type => (
             <button 
                key={type}
                onClick={() => setFilter(type)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-colors ${filter === type ? 'bg-[#1d2b3e] text-white shadow-md' : 'bg-white text-[#515f74] hover:bg-[#fbf2ed] border border-[#eae1dc]'}`}
             >
                {type === 'all' ? 'All Roles' : type}
             </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCareers.map((career, idx) => {
          const match = getMatchLabel(career.future_growth?.very_long_term?.value || 3);
          
          return (
            <div key={idx} className="bg-white border border-[#eae1dc] p-6 rounded-[2rem] hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-[0_20px_40px_rgba(31,27,24,0.06)] flex flex-col h-full">
              
              <div className="aspect-video w-full rounded-2xl bg-[#fbf2ed] mb-6 overflow-hidden flex items-center justify-center relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-[#1d2b3e]/5 to-[#004944]/10"></div>
                 <GraduationCap size={48} strokeWidth={1} className="text-[#515f74]/30" />
              </div>

              <div className="flex justify-between items-start mb-4 gap-4 flex-1">
                <div>
                  <h4 className="text-xl font-bold font-serif text-[#1d2b3e] leading-snug mb-1">{career.name}</h4>
                  <p className="text-sm text-[#515f74]">{career.cluster || career.career_type}</p>
                </div>
                <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-lg whitespace-nowrap ${match.style}`}>
                   {match.label}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-medium text-[#515f74] pt-4 border-t border-[#eae1dc]/50 mt-auto">
                <span className="flex items-center gap-1.5"><DollarSign size={14} className="text-[#1d2b3e]" />{formatSalary(career.salary_range)}</span>
                <span className="flex items-center gap-1.5"><MapPin size={14} className="text-[#1d2b3e]" />Flexible</span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
};

export default CareerRecommendations;