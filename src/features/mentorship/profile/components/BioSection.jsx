import { useState, useEffect } from 'react';
import { Save, MapPin, Globe, Briefcase, GraduationCap, Award, Loader2 } from 'lucide-react';

const BioSection = ({ profile, saving, onUpdate }) => {
    const [formData, setFormData] = useState({
        displayName: '',
        tagline: '',
        bio: '',
        location: { city: '', state: '', country: 'India' },
        expertise: [],
        targetingDomains: [],
        languages: [],
        preferredMenteeType: [],
    });
    const [expertiseInput, setExpertiseInput] = useState('');
    const [domainInput, setDomainInput] = useState('');
    const [languageInput, setLanguageInput] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || '',
                tagline: profile.tagline || '',
                bio: profile.bio || '',
                location: profile.location || { city: '', state: '', country: 'India' },
                expertise: profile.expertise || [],
                targetingDomains: profile.targetingDomains || [],
                languages: profile.languages || [],
                preferredMenteeType: profile.preferredMenteeType || [],
            });
        }
    }, [profile]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setHasChanges(true);
    };

    const handleLocationChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            location: { ...prev.location, [field]: value },
        }));
        setHasChanges(true);
    };

    const addToArray = (field, value, setInput) => {
        if (value.trim() && !formData[field].includes(value.trim())) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()],
            }));
            setInput('');
            setHasChanges(true);
        }
    };

    const removeFromArray = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item !== value),
        }));
        setHasChanges(true);
    };

    const toggleMenteeType = (type) => {
        setFormData(prev => ({
            ...prev,
            preferredMenteeType: prev.preferredMenteeType.includes(type)
                ? prev.preferredMenteeType.filter(t => t !== type)
                : [...prev.preferredMenteeType, type],
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        await onUpdate(formData);
        setHasChanges(false);
    };

    const menteeTypes = ['Fresher', 'Working Professional', 'Student', 'Career Switch'];

    return (
        <div className="bio-section">
            <div className="section-header">
                <div>
                    <h2>Bio & Details</h2>
                    <p>Update your profile information visible to mentees</p>
                </div>
                <button
                    className={`save-btn ${!hasChanges ? 'disabled' : ''}`}
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                >
                    {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="form-grid">
                {/* Basic Info */}
                <div className="form-card">
                    <h3><Briefcase size={18} /> Basic Information</h3>

                    <div className="form-group">
                        <label>Display Name</label>
                        <input
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => handleChange('displayName', e.target.value)}
                            placeholder="Your professional name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tagline</label>
                        <input
                            type="text"
                            value={formData.tagline}
                            onChange={(e) => handleChange('tagline', e.target.value)}
                            placeholder="e.g. Senior Software Engineer at Google"
                            maxLength={200}
                        />
                        <span className="char-count">{formData.tagline.length}/200</span>
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleChange('bio', e.target.value)}
                            placeholder="Tell mentees about yourself, your experience, and what you can help them with..."
                            rows={5}
                            maxLength={1000}
                        />
                        <span className="char-count">{formData.bio.length}/1000</span>
                    </div>
                </div>

                {/* Location */}
                <div className="form-card">
                    <h3><MapPin size={18} /> Location</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                value={formData.location.city}
                                onChange={(e) => handleLocationChange('city', e.target.value)}
                                placeholder="City"
                            />
                        </div>
                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                value={formData.location.state}
                                onChange={(e) => handleLocationChange('state', e.target.value)}
                                placeholder="State"
                            />
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                value={formData.location.country}
                                onChange={(e) => handleLocationChange('country', e.target.value)}
                                placeholder="Country"
                            />
                        </div>
                    </div>
                </div>

                {/* Expertise */}
                <div className="form-card">
                    <h3><Award size={18} /> Expertise & Skills</h3>

                    <div className="form-group">
                        <label>Areas of Expertise</label>
                        <div className="tag-input-container">
                            <input
                                type="text"
                                value={expertiseInput}
                                onChange={(e) => setExpertiseInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('expertise', expertiseInput, setExpertiseInput))}
                                placeholder="Type and press Enter (e.g., Java, DSA, System Design)"
                            />
                            <button onClick={() => addToArray('expertise', expertiseInput, setExpertiseInput)}>Add</button>
                        </div>
                        <div className="tags">
                            {formData.expertise.map((item, i) => (
                                <span key={i} className="tag">
                                    {item}
                                    <button onClick={() => removeFromArray('expertise', item)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Targeting Domains</label>
                        <div className="tag-input-container">
                            <input
                                type="text"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('targetingDomains', domainInput, setDomainInput))}
                                placeholder="Type and press Enter (e.g., Backend, Frontend, ML)"
                            />
                            <button onClick={() => addToArray('targetingDomains', domainInput, setDomainInput)}>Add</button>
                        </div>
                        <div className="tags">
                            {formData.targetingDomains.map((item, i) => (
                                <span key={i} className="tag domain">
                                    {item}
                                    <button onClick={() => removeFromArray('targetingDomains', item)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Languages & Mentee Types */}
                <div className="form-card">
                    <h3><Globe size={18} /> Languages & Preferences</h3>

                    <div className="form-group">
                        <label>Languages You Speak</label>
                        <div className="tag-input-container">
                            <input
                                type="text"
                                value={languageInput}
                                onChange={(e) => setLanguageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addToArray('languages', languageInput, setLanguageInput))}
                                placeholder="Type and press Enter (e.g., English, Hindi)"
                            />
                            <button onClick={() => addToArray('languages', languageInput, setLanguageInput)}>Add</button>
                        </div>
                        <div className="tags">
                            {formData.languages.map((item, i) => (
                                <span key={i} className="tag language">
                                    {item}
                                    <button onClick={() => removeFromArray('languages', item)}>×</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Preferred Mentee Types</label>
                        <div className="checkbox-group">
                            {menteeTypes.map((type) => (
                                <label key={type} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={formData.preferredMenteeType.includes(type)}
                                        onChange={() => toggleMenteeType(type)}
                                    />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .bio-section {
          padding: 32px;
          max-width: 1000px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-grid {
          display: grid;
          gap: 24px;
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-card h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 20px 0;
          padding-bottom: 12px;
          border-bottom: 1px solid #e2e8f0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .form-group {
          margin-bottom: 16px;
          position: relative;
        }

        .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #1A237E;
        }

        .char-count {
          position: absolute;
          right: 8px;
          bottom: -18px;
          font-size: 11px;
          color: #94a3b8;
        }

        .tag-input-container {
          display: flex;
          gap: 8px;
        }

        .tag-input-container input {
          flex: 1;
        }

        .tag-input-container button {
          padding: 10px 16px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #EEF2FF;
          color: #1A237E;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .tag.domain {
          background: #ECFDF5;
          color: #059669;
        }

        .tag.language {
          background: #FEF3C7;
          color: #D97706;
        }

        .tag button {
          background: none;
          border: none;
          font-size: 16px;
          cursor: pointer;
          color: inherit;
          opacity: 0.7;
          padding: 0;
          line-height: 1;
        }

        .tag button:hover {
          opacity: 1;
        }

        .checkbox-group {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #475569;
        }

        .checkbox-label input {
          width: 18px;
          height: 18px;
          accent-color: #1A237E;
        }

        @media (max-width: 768px) {
          .bio-section {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
};

export default BioSection;
