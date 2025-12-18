import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const STEP_QUESTIONS = {
    1: { icon: '👤', question: 'Let\'s start with your basic details', description: 'Tell us who you are' },
    2: { icon: '💼', question: 'What\'s your professional background?', description: 'Share your work experience' },
    3: { icon: '📝', question: 'Create your mentor profile', description: 'How would you like to be presented?' },
    4: { icon: '🎯', question: 'Define your mentorship style', description: 'Who do you want to mentor?' },
    5: { icon: '📅', question: 'Set your availability & pricing', description: 'When and how much?' },
    6: { icon: '✨', question: 'Almost done! Extra details', description: 'Add finishing touches' }
};

const Sidebar = ({ currentStep, steps, onPrevious, onNext, isLastStep, isSubmitting }) => {
    const currentInfo = STEP_QUESTIONS[currentStep];

    return (
        <div className="w-80 flex-shrink-0">
            <div className="bg-emerald-900 rounded-3xl p-6 text-white">
                {/* Current Step Question */}
                <div className="mb-8">
                    <div className="text-4xl mb-4">{currentInfo.icon}</div>
                    <h2 className="text-xl font-bold mb-2">{currentInfo.question}</h2>
                    <p className="text-emerald-200 text-sm">{currentInfo.description}</p>
                </div>

                {/* Steps List */}
                <div className="space-y-2 mb-8">
                    <p className="text-emerald-300 text-xs uppercase tracking-wider mb-3">Steps</p>
                    {steps.map((step) => {
                        const isActive = step.id === currentStep;
                        const isCompleted = step.id < currentStep;

                        return (
                            <div
                                key={step.id}
                                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
                  ${isActive
                                        ? 'bg-emerald-700/50 ring-1 ring-emerald-500'
                                        : isCompleted
                                            ? 'bg-emerald-800/30'
                                            : 'bg-transparent hover:bg-emerald-800/20'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg">{step.icon}</span>
                                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                                        {step.name}
                                    </span>
                                </div>
                                {isActive && (
                                    <ChevronRight className="w-4 h-4 text-emerald-400" />
                                )}
                                {isCompleted && (
                                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-xs">✓</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onPrevious}
                        disabled={currentStep === 1}
                        className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium transition-all
              ${currentStep === 1
                                ? 'bg-emerald-800/30 text-emerald-400 cursor-not-allowed'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }
            `}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button
                        onClick={onNext}
                        disabled={isSubmitting}
                        className={`
              flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full text-sm font-medium transition-all
              ${isLastStep
                                ? 'bg-emerald-400 text-emerald-900 hover:bg-emerald-300'
                                : 'bg-emerald-500 text-white hover:bg-emerald-400'
                            }
            `}
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : isLastStep ? (
                            <>
                                Submit
                                <span>🚀</span>
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
