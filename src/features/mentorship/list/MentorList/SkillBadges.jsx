import React, { useState } from 'react';

/**
 * SkillBadges - Display skill tags with overflow handling
 */
const SkillBadges = ({ skills = [], maxDisplay = 6 }) => {
    const [showAll, setShowAll] = useState(false);

    const displayedSkills = showAll ? skills : skills.slice(0, maxDisplay);
    const remainingCount = skills.length - maxDisplay;

    return (
        <div className="skill-badges">
            {displayedSkills.map((skill, index) => (
                <span key={index} className="skill-badge">
                    {skill}
                </span>
            ))}
            {!showAll && remainingCount > 0 && (
                <span
                    className="skill-badge more"
                    onClick={() => setShowAll(true)}
                >
                    +{remainingCount} More
                </span>
            )}
            {showAll && skills.length > maxDisplay && (
                <span
                    className="skill-badge more"
                    onClick={() => setShowAll(false)}
                >
                    Show Less
                </span>
            )}
        </div>
    );
};

export default SkillBadges;
