import React from 'react';
import { Check } from 'lucide-react';

const StepProgress = ({ steps, currentStep, onStepClick }) => {
    return (
        <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-800">Become a Mentor</h1>

            <div className="flex items-center gap-2">
                {steps.map((step, index) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;
                    const isUpcoming = step.id > currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => onStepClick(step.id)}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isCompleted
                                        ? 'bg-emerald-800 text-white'
                                        : isActive
                                            ? 'bg-emerald-800 text-white ring-2 ring-emerald-400 ring-offset-2'
                                            : 'bg-white text-gray-600 border border-gray-300 hover:border-emerald-400'
                                    }
                `}
                            >
                                {isCompleted ? (
                                    <Check className="w-4 h-4" />
                                ) : (
                                    <span>{step.icon}</span>
                                )}
                                <span className="hidden sm:inline">{step.name}</span>
                            </button>

                            {index < steps.length - 1 && (
                                <div className={`w-8 h-0.5 ${isCompleted ? 'bg-emerald-800' : 'bg-gray-300'}`} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default StepProgress;
