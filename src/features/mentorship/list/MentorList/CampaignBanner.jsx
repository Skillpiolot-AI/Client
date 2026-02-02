import React from 'react';
import { Sparkles } from 'lucide-react';
import './CampaignBanner.css';

/**
 * CampaignBanner - Premium banner for special events/campaigns
 */
const CampaignBanner = ({ campaign }) => {
    if (!campaign) return null;

    return (
        <div className="campaign-banner">
            <div className="campaign-card">
                {/* Visual elements */}
                <div className="campaign-bg"></div>
                <div className="campaign-rays"></div>

                <div className="campaign-content">
                    <div className="campaign-badge">
                        <Sparkles size={12} fill="currentColor" />
                        Active Campaign
                    </div>

                    <div className="campaign-title-row">
                        <h2 className="campaign-title">{campaign.name}</h2>
                    </div>

                    <p className="campaign-description">
                        Exciting opportunities await! Take advantage of our limited-time mentorship offers today.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CampaignBanner;
