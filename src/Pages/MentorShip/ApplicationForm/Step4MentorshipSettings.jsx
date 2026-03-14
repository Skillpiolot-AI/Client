import React from 'react';
import { Target, Users, Globe, MapPin, X } from 'lucide-react';

const DOMAIN_OPTIONS = [
    'Backend Developer', 'Frontend Developer', 'Full Stack Developer',
    'Mobile Developer', 'DevOps Engineer', 'Data Scientist',
    'Machine Learning Engineer', 'Cloud Architect', 'QA Engineer',
    'Product Manager', 'UI/UX Designer', 'Security Engineer'
];

const AUDIENCE_OPTIONS = ['Fresher', 'Working Professional', 'Student', 'Career Switch'];

const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati'];

const Step4MentorshipSettings = ({ formData, updateFormData, updateNestedFormData }) => {
    const toggleArrayItem = (field, item) => {
        const current = formData[field] || [];
        if (current.includes(item)) {
            updateFormData(field, current.filter(i => i !== item));
        } else {
            updateFormData(field, [...current, item]);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Mentorship Settings</h2>
                <p className="text-gray-600">Define who you want to mentor and in what areas.</p>
            </div>

            <div className="space-y-6">
                {/* Targeting Domains */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <Target className="inline w-4 h-4 mr-1" />
                        Targeting Domains
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {DOMAIN_OPTIONS.map((domain) => (
                            <button
                                key={domain}
                                type="button"
                                onClick={() => toggleArrayItem('targetingDomains', domain)}
                                className={`
                  px-4 py-3 rounded-xl text-sm font-medium transition-all text-left
                  ${formData.targetingDomains?.includes(domain)
                                        ? 'bg-emerald-800 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 border border-gray-200'
                                    }
                `}
                            >
                                {domain}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Target Audience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <Users className="inline w-4 h-4 mr-1" />
                        Target Audience
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {AUDIENCE_OPTIONS.map((audience) => (
                            <button
                                key={audience}
                                type="button"
                                onClick={() => toggleArrayItem('targetAudience', audience)}
                                className={`
                  px-5 py-3 rounded-full text-sm font-medium transition-all
                  ${formData.targetAudience?.includes(audience)
                                        ? 'bg-emerald-800 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 border border-gray-200'
                                    }
                `}
                            >
                                {audience}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Select the type of mentees you prefer to work with</p>
                </div>

                {/* Languages */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <Globe className="inline w-4 h-4 mr-1" />
                        Languages You Speak
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {LANGUAGE_OPTIONS.map((lang) => (
                            <button
                                key={lang}
                                type="button"
                                onClick={() => toggleArrayItem('languages', lang)}
                                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${formData.languages?.includes(lang)
                                        ? 'bg-emerald-800 text-white'
                                        : 'bg-gray-50 text-gray-700 hover:bg-emerald-50 border border-gray-200'
                                    }
                `}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        Location
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">City</label>
                            <input
                                type="text"
                                value={formData.location?.city || ''}
                                onChange={(e) => updateNestedFormData('location', 'city', e.target.value)}
                                placeholder="Enter city"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">State</label>
                            <input
                                type="text"
                                value={formData.location?.state || ''}
                                onChange={(e) => updateNestedFormData('location', 'state', e.target.value)}
                                placeholder="Enter state"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500 mb-1">Country</label>
                            <input
                                type="text"
                                value={formData.location?.country || 'India'}
                                onChange={(e) => updateNestedFormData('location', 'country', e.target.value)}
                                placeholder="Enter country"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step4MentorshipSettings;
