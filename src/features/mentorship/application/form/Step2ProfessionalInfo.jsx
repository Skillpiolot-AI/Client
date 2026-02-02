import React from 'react';
import { Briefcase, Building2, Award, X } from 'lucide-react';

const Step2ProfessionalInfo = ({ formData, updateFormData, jobTitles, companies }) => {
    const handleCompanyToggle = (companyName) => {
        const current = formData.companiesWorked || [];
        if (current.includes(companyName)) {
            updateFormData('companiesWorked', current.filter(c => c !== companyName));
        } else {
            updateFormData('companiesWorked', [...current, companyName]);
        }
    };

    const removeCompany = (companyName) => {
        updateFormData('companiesWorked', formData.companiesWorked.filter(c => c !== companyName));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Background</h2>
                <p className="text-gray-600">Tell us about your work experience. This helps mentees understand your expertise.</p>
            </div>

            <div className="space-y-6">
                {/* Job Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Current Job Title
                    </label>
                    <div className="relative">
                        <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <select
                            value={formData.jobTitle}
                            onChange={(e) => updateFormData('jobTitle', e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none appearance-none"
                        >
                            <option value="">Select your job title</option>
                            {jobTitles.map((job) => (
                                <option key={job._id} value={job.title}>{job.title}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Current Company */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Current Company
                    </label>
                    <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.currentCompany}
                            onChange={(e) => updateFormData('currentCompany', e.target.value)}
                            placeholder="Where do you currently work?"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Companies Worked */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Companies You've Worked At
                    </label>

                    {/* Selected Companies */}
                    {formData.companiesWorked?.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                            {formData.companiesWorked.map((company) => (
                                <span
                                    key={company}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm"
                                >
                                    {company}
                                    <button
                                        onClick={() => removeCompany(company)}
                                        className="hover:bg-emerald-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                        {companies.map((company) => (
                            <button
                                key={company._id}
                                type="button"
                                onClick={() => handleCompanyToggle(company.name)}
                                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
                  ${formData.companiesWorked?.includes(company.name)
                                        ? 'bg-emerald-800 text-white'
                                        : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
                                    }
                `}
                            >
                                {company.name}
                            </button>
                        ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Select all companies you've worked at</p>
                </div>

                {/* Experience */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Years of Experience
                    </label>
                    <div className="relative">
                        <Award className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            value={formData.experience}
                            onChange={(e) => updateFormData('experience', e.target.value)}
                            placeholder="e.g., 5"
                            min="1"
                            max="30"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Total years in your professional field</p>
                </div>
            </div>
        </div>
    );
};

export default Step2ProfessionalInfo;
