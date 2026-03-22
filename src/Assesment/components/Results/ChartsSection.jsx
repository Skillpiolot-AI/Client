import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';

const DOMAIN_INFO = {
  R: 'Realistic', I: 'Investigative', A: 'Artistic',
  S: 'Social', E: 'Enterprising', C: 'Conventional'
};

const ChartsSection = ({ results }) => {
  const radarData = results.sorted.map(({ domain, score }) => ({
    domain,
    name: DOMAIN_INFO[domain] || domain,
    score: score,
    fullMark: 100
  }));

  const top3 = results.sorted.slice(0, 3);
  const topScore = top3[0]?.score || 0;
  const lowestScore = results.sorted[results.sorted.length - 1];

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mt-16 font-sans">
      
      {/* Visual Chart Left Side */}
      <div className="order-2 lg:order-1 flex justify-center py-12">
        <div className="relative w-80 h-80">
          {/* Abstract background concentric circles */}
          <div className="absolute inset-0 border border-[#c5c6cd]/20 rounded-full scale-100"></div>
          <div className="absolute inset-0 border border-[#c5c6cd]/20 rounded-full scale-75"></div>
          <div className="absolute inset-0 border border-[#c5c6cd]/20 rounded-full scale-50"></div>
          <div className="absolute inset-0 border border-[#c5c6cd]/20 rounded-full scale-25"></div>
          
          <div className="absolute inset-0 z-10 drop-shadow-xl">
             <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="transparent" />
                <PolarAngleAxis 
                   dataKey="name" 
                   tick={{ fill: '#1d2b3e', fontSize: 10, fontWeight: 700, letterSpacing: '0.1em' }} 
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="RIASEC"
                  dataKey="score"
                  stroke="#1d2b3e"
                  strokeWidth={2}
                  fill="rgba(29, 43, 62, 0.1)"
                  fillOpacity={1}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Breakdown Progress Bars Right Side */}
      <div className="order-1 lg:order-2 space-y-8">
        <h2 className="text-4xl font-serif font-extrabold tracking-tight text-[#1d2b3e]">The RIASEC Breakdown</h2>
        
        <div className="space-y-6">
          {top3.map((trait, index) => (
             <div key={index} className="space-y-2">
               <div className="flex justify-between text-sm font-semibold text-[#1f1b18]">
                 <span>{DOMAIN_INFO[trait.domain]} ({trait.domain})</span>
                 <span className="text-[#004944]">{Math.round(trait.score)}/100</span>
               </div>
               <div className="h-1.5 w-full bg-[#f0e6e2] rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-[#1d2b3e] transition-all duration-1000" 
                   style={{ width: `${trait.score}%` }}
                 ></div>
               </div>
             </div>
          ))}

          <div className="pt-6 flex gap-4">
            <div className="flex-1 p-4 bg-white border border-[#c5c6cd]/20 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-[#515f74] uppercase mb-1">Lowest Trait</div>
              <div className="text-lg font-serif font-bold text-[#1d2b3e]">
                  {DOMAIN_INFO[lowestScore.domain]} ({Math.round(lowestScore.score)})
              </div>
            </div>
            <div className="flex-1 p-4 bg-white border border-[#c5c6cd]/20 rounded-2xl shadow-sm">
              <div className="text-xs font-bold text-[#515f74] uppercase mb-1">Top Match</div>
              <div className="text-lg font-serif font-bold text-[#1d2b3e]">{topScore}% Align</div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default ChartsSection;