import React, { useState } from 'react';
import { Upload, Type, FileText, Tag, X, Plus } from 'lucide-react';

const EXPERTISE_OPTIONS = [
    'Java', 'Python', 'JavaScript', 'React', 'Node.js', 'TypeScript',
    'DSA', 'System Design', 'HLD', 'LLD', 'SQL', 'MongoDB',
    'AWS', 'Docker', 'Kubernetes', 'Machine Learning', 'AI',
    'DevOps', 'Cloud Computing', 'Microservices', 'GraphQL'
];

const Step3ProfileDetails = ({ formData, updateFormData }) => {
    const [customExpertise, setCustomExpertise] = useState('');

    const toggleExpertise = (skill) => {
        const current = formData.expertise || [];
        if (current.includes(skill)) {
            updateFormData('expertise', current.filter(s => s !== skill));
        } else {
            updateFormData('expertise', [...current, skill]);
        }
    };

    const addCustomExpertise = () => {
        if (customExpertise.trim() && !formData.expertise?.includes(customExpertise.trim())) {
            updateFormData('expertise', [...(formData.expertise || []), customExpertise.trim()]);
            setCustomExpertise('');
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Details</h2>
                <p className="text-gray-600">Create an impressive mentor profile that attracts mentees.</p>
            </div>

            <div className="space-y-6">
                {/* Profile Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Profile Photo
                    </label>
                    <div className="flex items-start gap-4">
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Upload className="w-8 h-8 text-gray-400" />
                            )}
                        </div>
                        <div className="flex-1">
                            <input
                                type="url"
                                value={formData.profileImage}
                                onChange={(e) => updateFormData('profileImage', e.target.value)}
                                placeholder="Paste image URL or upload"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">Use a professional photo (Square, min 200x200px)</p>
                        </div>
                    </div>
                </div>

                {/* Tagline */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Tagline
                    </label>
                    <div className="relative">
                        <Type className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.tagline}
                            onChange={(e) => updateFormData('tagline', e.target.value)}
                            placeholder="e.g., Helping developers crack FAANG interviews"
                            maxLength={200}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{formData.tagline?.length || 0}/200 characters</p>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Bio / About You
                    </label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                        <textarea
                            value={formData.bio}
                            onChange={(e) => updateFormData('bio', e.target.value)}
                            placeholder="Tell potential mentees about yourself, your journey, and what makes you a great mentor..."
                            rows={5}
                            maxLength={1000}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none resize-none"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{formData.bio?.length || 0}/1000 characters</p>
                </div>

                {/* Expertise */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        <Tag className="inline w-4 h-4 mr-1" />
                        Areas of Expertise
                    </label>

                    {/* Selected Tags */}
                    {formData.expertise?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.expertise.map((skill) => (
                                <span
                                    key={skill}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                    <button onClick={() => toggleExpertise(skill)} className="hover:bg-emerald-200 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Add Custom */}
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={customExpertise}
                            onChange={(e) => setCustomExpertise(e.target.value)}
                            placeholder="Add custom skill..."
                            className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomExpertise())}
                        />
                        <button
                            type="button"
                            onClick={addCustomExpertise}
                            className="px-4 py-2 bg-emerald-800 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Suggestions */}
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        {EXPERTISE_OPTIONS.filter(s => !formData.expertise?.includes(s)).slice(0, 12).map((skill) => (
                            <button
                                key={skill}
                                type="button"
                                onClick={() => toggleExpertise(skill)}
                                className="px-3 py-1 bg-white text-gray-700 border border-gray-200 rounded-full text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all"
                            >
                                + {skill}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3ProfileDetails;
