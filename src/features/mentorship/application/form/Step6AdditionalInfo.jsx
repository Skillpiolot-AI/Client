import React, { useState } from 'react';
import { Building2, GraduationCap, Award, Link2, BookOpen, Plus, X, Trash2 } from 'lucide-react';

const TOP_COMPANIES = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Flipkart', 'Swiggy', 'Razorpay'];

const Step6AdditionalInfo = ({ formData, updateFormData, updateNestedFormData }) => {
    const [newEducation, setNewEducation] = useState({ degree: '', field: '', institution: '', year: '' });
    const [newCertification, setNewCertification] = useState({ name: '', issuer: '', year: '', credentialUrl: '' });

    const toggleCompanyReferral = (company) => {
        const current = formData.topCompanyReferrals || [];
        if (current.includes(company)) {
            updateFormData('topCompanyReferrals', current.filter(c => c !== company));
        } else {
            updateFormData('topCompanyReferrals', [...current, company]);
        }
    };

    const addEducation = () => {
        if (newEducation.degree && newEducation.institution) {
            updateFormData('education', [...(formData.education || []), { ...newEducation }]);
            setNewEducation({ degree: '', field: '', institution: '', year: '' });
        }
    };

    const removeEducation = (index) => {
        updateFormData('education', formData.education.filter((_, i) => i !== index));
    };

    const addCertification = () => {
        if (newCertification.name && newCertification.issuer) {
            updateFormData('certifications', [...(formData.certifications || []), { ...newCertification }]);
            setNewCertification({ name: '', issuer: '', year: '', credentialUrl: '' });
        }
    };

    const removeCertification = (index) => {
        updateFormData('certifications', formData.certifications.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Additional Information</h2>
                <p className="text-gray-600">Add extra details to make your profile stand out.</p>
            </div>

            <div className="space-y-6">
                {/* Referrals in Top Companies */}
                <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-5 h-5 text-indigo-700" />
                            <span className="font-medium text-indigo-900">Can you refer to top companies?</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateFormData('referralsInTopCompanies', !formData.referralsInTopCompanies)}
                            className={`
                w-12 h-6 rounded-full transition-all relative
                ${formData.referralsInTopCompanies ? 'bg-indigo-600' : 'bg-gray-300'}
              `}
                        >
                            <div className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                ${formData.referralsInTopCompanies ? 'right-1' : 'left-1'}
              `} />
                        </button>
                    </div>

                    {formData.referralsInTopCompanies && (
                        <div className="flex flex-wrap gap-2">
                            {TOP_COMPANIES.map((company) => (
                                <button
                                    key={company}
                                    type="button"
                                    onClick={() => toggleCompanyReferral(company)}
                                    className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${formData.topCompanyReferrals?.includes(company)
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white text-gray-700 border border-indigo-200 hover:bg-indigo-100'
                                        }
                  `}
                                >
                                    {company}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Education */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <GraduationCap className="inline w-4 h-4 mr-1" />
                        Education
                    </label>

                    {/* Added Education */}
                    {formData.education?.map((edu, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2">
                            <div>
                                <p className="font-medium text-gray-800">{edu.degree} in {edu.field}</p>
                                <p className="text-sm text-gray-500">{edu.institution} • {edu.year}</p>
                            </div>
                            <button onClick={() => removeEducation(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Degree (e.g., B.Tech)"
                            value={newEducation.degree}
                            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="text"
                            placeholder="Field (e.g., Computer Science)"
                            value={newEducation.field}
                            onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="text"
                            placeholder="Institution"
                            value={newEducation.institution}
                            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={newEducation.year}
                            onChange={(e) => setNewEducation({ ...newEducation, year: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button type="button" onClick={addEducation} className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800">
                        <Plus className="w-4 h-4" /> Add Education
                    </button>
                </div>

                {/* Certifications */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <Award className="inline w-4 h-4 mr-1" />
                        Certifications
                    </label>

                    {formData.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2">
                            <div>
                                <p className="font-medium text-gray-800">{cert.name}</p>
                                <p className="text-sm text-gray-500">{cert.issuer} • {cert.year}</p>
                            </div>
                            <button onClick={() => removeCertification(index)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="Certificate Name"
                            value={newCertification.name}
                            onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="text"
                            placeholder="Issuer (e.g., AWS)"
                            value={newCertification.issuer}
                            onChange={(e) => setNewCertification({ ...newCertification, issuer: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="number"
                            placeholder="Year"
                            value={newCertification.year}
                            onChange={(e) => setNewCertification({ ...newCertification, year: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="url"
                            placeholder="Credential URL (optional)"
                            value={newCertification.credentialUrl}
                            onChange={(e) => setNewCertification({ ...newCertification, credentialUrl: e.target.value })}
                            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <button type="button" onClick={addCertification} className="flex items-center gap-1 text-sm text-emerald-700 hover:text-emerald-800">
                        <Plus className="w-4 h-4" /> Add Certification
                    </button>
                </div>

                {/* Social Links */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <Link2 className="inline w-4 h-4 mr-1" />
                        Social Links
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                            type="url"
                            placeholder="LinkedIn URL"
                            value={formData.socialLinks?.linkedIn || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'linkedIn', e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="url"
                            placeholder="GitHub URL"
                            value={formData.socialLinks?.github || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'github', e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="url"
                            placeholder="Twitter/X URL"
                            value={formData.socialLinks?.twitter || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'twitter', e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                            type="url"
                            placeholder="Portfolio Website"
                            value={formData.socialLinks?.portfolio || ''}
                            onChange={(e) => updateNestedFormData('socialLinks', 'portfolio', e.target.value)}
                            className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Curriculum */}
                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <BookOpen className="w-5 h-5 text-amber-700" />
                            <span className="font-medium text-amber-900">Have a structured curriculum?</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateNestedFormData('curriculum', 'available', !formData.curriculum?.available)}
                            className={`
                w-12 h-6 rounded-full transition-all relative
                ${formData.curriculum?.available ? 'bg-amber-600' : 'bg-gray-300'}
              `}
                        >
                            <div className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                ${formData.curriculum?.available ? 'right-1' : 'left-1'}
              `} />
                        </button>
                    </div>

                    {formData.curriculum?.available && (
                        <textarea
                            value={formData.curriculum?.description || ''}
                            onChange={(e) => updateNestedFormData('curriculum', 'description', e.target.value)}
                            placeholder="Briefly describe your curriculum or mentorship plan..."
                            rows={3}
                            className="w-full px-4 py-3 bg-white border border-amber-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step6AdditionalInfo;
