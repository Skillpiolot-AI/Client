import React from 'react';

const options = [
  { 
    value: 1, 
    label: 'Strongly Disagree', 
    baseRing: 'w-4 h-4',
    hoverRing: 'group-hover:scale-150',
    translateY: '-bottom-10'
  },
  { 
    value: 2, 
    label: 'Disagree', 
    baseRing: 'w-6 h-6',
    hoverRing: 'group-hover:scale-125',
    translateY: '-bottom-10'
  },
  { 
    value: 3, 
    label: 'Neutral', 
    baseRing: 'w-8 h-8',
    hoverRing: '',
    translateY: '-bottom-10'
  },
  { 
    value: 4, 
    label: 'Agree', 
    baseRing: 'w-10 h-10',
    hoverRing: '',
    translateY: '-bottom-10'
  },
  { 
    value: 5, 
    label: 'Strongly Agree', 
    baseRing: 'w-12 h-12',
    hoverRing: '',
    translateY: '-bottom-10'
  }
];

const QuestionCard = ({ question, step, totalSteps, selectedValue, onSelect, animating }) => {
  return (
    <div className={`w-full max-w-4xl text-center transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        
      {/* Step Indicator */}
      <div className="mb-16 text-center">
        <span className="text-[10px] uppercase font-semibold text-[#505f76]/60 block mb-2 tracking-[0.2em]">
            Assessment Journey
        </span>
        <div className="flex items-baseline justify-center gap-1 font-serif">
            <span className="italic text-2xl text-[#1d2b3e]">Step</span>
            <span className="text-4xl font-light">{step}</span>
            <span className="italic text-xl text-[#505f76]/40 px-2">of</span>
            <span className="text-2xl text-[#505f76]/60">{totalSteps}</span>
        </div>
      </div>

      {/* Question Text */}
      <h1 className="font-serif text-4xl md:text-6xl lg:text-[4rem] font-light leading-tight mb-24 max-w-3xl mx-auto tracking-tight text-[#1d2b3e]">
          “{question.text}”
      </h1>

      {/* Abstract Rating Scale */}
      <div className="relative w-full max-w-2xl mx-auto mb-32 h-20">
        {/* The connecting horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#e2e8f0] z-0 -translate-y-1/2"></div>
        
        <div className="relative z-10 flex justify-between items-center h-full px-4">
          {options.map((opt) => {
            const isSelected = selectedValue === opt.value;
            
            return (
              <button 
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className="group flex flex-col items-center justify-center relative w-12 h-12"
              >
                {isSelected ? (
                  // Selected State (Filled Primary Circle)
                  <div className={`${opt.baseRing} rounded-full bg-[#1d2b3e] border border-[#1d2b3e] shadow-xl shadow-[#1d2b3e]/20 transition-all duration-500 relative flex items-center justify-center`}>
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                ) : (
                  // Unselected State (Outlined Circle that grows on hover)
                  <div className={`${opt.baseRing} rounded-full border border-[#1d2b3e]/20 bg-[#fdfcfb] group-hover:bg-[#1d2b3e] group-hover:border-[#1d2b3e] ${opt.hoverRing} transition-all duration-500`}></div>
                )}
                
                {/* Abstract Text Label underneath */}
                <span className={`absolute ${opt.translateY} text-[9px] uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap ${isSelected ? 'font-bold text-[#1d2b3e]' : 'font-medium text-transparent group-hover:text-[#505f76]/60'}`}>
                    {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default QuestionCard;