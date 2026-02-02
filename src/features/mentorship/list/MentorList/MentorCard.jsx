import React, { useState } from 'react';
import {
    MapPin,
    Star,
    Globe,
    Phone,
    Users,
    Building2,
    Award,
    BookOpen,
    ExternalLink
} from 'lucide-react';
import SkillBadges from './SkillBadges';
import PricingTabs from './PricingTabs';

/**
 * MentorCard - Individual mentor card matching the reference design
 */
const MentorCard = ({
    mentor,
    onViewProfile,
    onBookTrial,
    isLoggedIn
}) => {
    const [selectedDuration, setSelectedDuration] = useState('6 Months');
    const [expanded, setExpanded] = useState(false);

    // Get price for selected duration
    const getPrice = () => {
        if (!mentor.pricingPlans || mentor.pricingPlans.length === 0) {
            return mentor.pricing?.monthlyPrice || 0;
        }
        const plan = mentor.pricingPlans.find(p => p.duration === selectedDuration);
        return plan?.price || 0;
    };

    // Calculate monthly price
    const getMonthlyPrice = () => {
        const totalPrice = getPrice();
        const months = selectedDuration === '6 Months' ? 6 : selectedDuration === '3 Months' ? 3 : 1;
        return Math.round(totalPrice / months);
    };

    // Truncate bio
    const truncatedBio = mentor.bio && mentor.bio.length > 180
        ? mentor.bio.substring(0, 180) + '...'
        : mentor.bio;

    // Get company logo (placeholder for now)
    const getCompanyLogo = (company) => {
        const logos = {
            'Google': 'https://www.google.com/favicon.ico',
            'Microsoft': 'https://www.microsoft.com/favicon.ico',
            'Amazon': 'https://www.amazon.com/favicon.ico',
            'Meta': 'https://www.meta.com/favicon.ico',
            'Apple': 'https://www.apple.com/favicon.ico',
            'Salesforce': 'https://www.salesforce.com/favicon.ico',
            'Walmart': 'https://www.walmart.com/favicon.ico'
        };
        return logos[company] || null;
    };

    return (
        <div className="mentor-card">
            <div className="mentor-card-content">
                {/* Left - Profile Image */}
                <div className="mentor-profile-section">
                    <div className="mentor-profile-image-wrapper">
                        <img
                            src={mentor.profileImage || mentor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || mentor.name)}&size=200&background=random`}
                            alt={mentor.displayName || mentor.name}
                            className="mentor-profile-image"
                        />
                        <div className="mentor-rating-badge">
                            <Star />
                            <span>{mentor.averageRating?.toFixed(1) || '5.0'}</span>
                            <span className="reviews-count">({mentor.totalReviews || 0}+ reviews)</span>
                        </div>
                    </div>
                </div>

                {/* Center - Details */}
                <div className="mentor-details">
                    {/* Header Row */}
                    <div className="mentor-header">
                        <div className="mentor-name-section">
                            <h3 className="mentor-name">{mentor.displayName || mentor.name}</h3>
                            {mentor.totalPlacements > 0 && (
                                <span className="placements-badge">
                                    <Award />
                                    {mentor.totalPlacements} Placements
                                </span>
                            )}
                        </div>
                        <PricingTabs
                            selectedDuration={selectedDuration}
                            onDurationChange={setSelectedDuration}
                            pricingPlans={mentor.pricingPlans}
                        />
                    </div>

                    {/* Meta Info */}
                    <div className="mentor-meta">
                        {mentor.location?.city && (
                            <span className="mentor-meta-item">
                                <MapPin />
                                <span className="highlight">{mentor.location.city}</span>, {mentor.location.country || 'India'}
                            </span>
                        )}
                        {mentor.totalReviews > 0 && (
                            <span className="mentor-meta-item">
                                <Users />
                                {mentor.totalReviews}+ reviews
                            </span>
                        )}
                        {mentor.languages && mentor.languages.length > 0 && (
                            <span className="mentor-meta-item">
                                <Globe />
                                {mentor.languages.slice(0, 2).join(', ')}
                                {mentor.languages.length > 2 && ` +${mentor.languages.length - 2}`}
                            </span>
                        )}
                    </div>

                    {/* Company & Experience Badges */}
                    <div className="company-badges">
                        {mentor.currentCompany && (
                            <div className="company-badge">
                                {getCompanyLogo(mentor.currentCompany) && (
                                    <img src={getCompanyLogo(mentor.currentCompany)} alt={mentor.currentCompany} />
                                )}
                                <div className="company-info">
                                    <span className="company-title">{mentor.jobTitle || 'Senior Engineer'}</span>
                                    <span className="company-name">{mentor.currentCompany}</span>
                                </div>
                            </div>
                        )}
                        {mentor.companiesWorked && mentor.companiesWorked.length > 0 && (
                            <div className="company-badge">
                                <img
                                    src={getCompanyLogo(mentor.companiesWorked[0]) || 'https://via.placeholder.com/24'}
                                    alt={mentor.companiesWorked[0]}
                                />
                                <div className="company-info">
                                    <span className="company-title">Previously at</span>
                                    <span className="company-name">{mentor.companiesWorked[0]}</span>
                                </div>
                            </div>
                        )}
                        <div className="experience-badge">
                            <div>
                                <span className="experience-years">{mentor.experience || 5}+</span>
                                <span className="experience-label"> Years</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {mentor.bio && (
                        <p className="mentor-bio">
                            {expanded ? mentor.bio : truncatedBio}
                            {mentor.bio.length > 180 && (
                                <span className="read-more" onClick={() => setExpanded(!expanded)}>
                                    {expanded ? ' Show Less' : ' Read More'}
                                </span>
                            )}
                        </p>
                    )}

                    {/* Skills */}
                    <SkillBadges
                        skills={mentor.expertise || mentor.skills || []}
                        maxDisplay={6}
                    />

                    {/* Target Audience */}
                    <div className="target-audience">
                        {mentor.preferredMenteeType && mentor.preferredMenteeType.length > 0 && (
                            <span className="target-item">
                                <Users />
                                For: {mentor.preferredMenteeType.slice(0, 2).join(' | ')}
                            </span>
                        )}
                        {mentor.targetingDomains && mentor.targetingDomains.length > 0 && (
                            <span className="target-item">
                                <Building2 />
                                Targeting Domains: <strong>{mentor.targetingDomains[0]}</strong>
                                {mentor.targetingDomains.length > 1 && (
                                    <a href="#" onClick={(e) => { e.preventDefault(); }}>
                                        | More
                                    </a>
                                )}
                            </span>
                        )}
                    </div>
                </div>

                {/* Right - Features & Actions */}
                <div className="mentor-right-section">
                    <div className="mentor-features">
                        <div className="feature-item">
                            <Phone />
                            <span><strong>{mentor.sessionsPerWeek || 1}x</strong> Sessions Per Week</span>
                        </div>
                        {mentor.referralsInTopCompanies && (
                            <div className="feature-item">
                                <Building2 />
                                <span>Referrals in Top Companies</span>
                                <a href="#" className="view-link" onClick={(e) => e.preventDefault()}>
                                    +{mentor.topCompanies?.length || 12} More
                                </a>
                            </div>
                        )}
                        {mentor.curriculum?.available && (
                            <div className="feature-item">
                                <BookOpen />
                                <span>Detailed Curriculum Available</span>
                                <a href="#" className="view-link" onClick={(e) => e.preventDefault()}>
                                    View <ExternalLink size={12} />
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="mentor-pricing">
                        {mentor.isFree ? (
                            <span className="price-amount" style={{ color: '#28a745' }}>FREE</span>
                        ) : (
                            <>
                                <span className="price-amount">
                                    ₹{getMonthlyPrice().toLocaleString()}
                                </span>
                                <span className="price-period">/Month</span>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mentor-actions">
                        <button
                            className="btn-view-profile"
                            onClick={() => onViewProfile(mentor.mentorProfileId || mentor._id || mentor.userId)}
                        >
                            View Profile
                        </button>
                        <button
                            className="btn-book-trial"
                            onClick={() => onBookTrial(mentor)}
                        >
                            {mentor.isFree ? 'Book Free Session' : `Book Golden Trial @ ₹${mentor.trialSession?.price || 199}`}
                            <span className="subtitle">
                                {mentor.isFree
                                    ? 'Free mentorship available!'
                                    : mentor.trialSession?.available === false
                                        ? 'All free trial slots have been filled.'
                                        : 'Limited slots available'}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentorCard;
