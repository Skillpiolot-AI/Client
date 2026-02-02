import React from 'react';

/**
 * PricingTabs - Tab selector for pricing duration (6 Months, 3 Months, 1 Month)
 */
const PricingTabs = ({
    selectedDuration,
    onDurationChange,
    pricingPlans = []
}) => {
    const durations = ['6 Months', '3 Months', '1 Month'];

    // Filter to only show durations that have pricing
    const availableDurations = durations.filter(duration =>
        pricingPlans.some(plan => plan.duration === duration)
    );

    // If no pricing plans, show all durations as options
    const displayDurations = availableDurations.length > 0 ? availableDurations : durations;

    return (
        <div className="pricing-tabs">
            {displayDurations.map((duration) => (
                <button
                    key={duration}
                    className={`pricing-tab ${selectedDuration === duration ? 'active' : ''}`}
                    onClick={() => onDurationChange(duration)}
                >
                    {duration}
                </button>
            ))}
        </div>
    );
};

export default PricingTabs;
