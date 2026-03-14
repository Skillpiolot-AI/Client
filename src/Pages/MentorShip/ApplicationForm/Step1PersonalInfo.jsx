import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

const Step1PersonalInfo = ({ formData, updateFormData }) => {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
                <p className="text-gray-600">Let's start with your basic details. This information will be used for your mentor profile.</p>
            </div>

            <div className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Full Name
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateFormData('name', e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            placeholder="you@example.com"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">We'll send your login credentials to this email</p>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Phone Number
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateFormData('phone', e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Used for verification and mentee communication</p>
                </div>
            </div>
        </div>
    );
};

export default Step1PersonalInfo;
