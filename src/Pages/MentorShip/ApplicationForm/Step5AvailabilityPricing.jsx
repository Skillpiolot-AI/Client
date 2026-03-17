import React from 'react';
import { Calendar, Clock, DollarSign, Play } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const Step5AvailabilityPricing = ({ formData, updateFormData, updateNestedFormData }) => {
    const toggleDay = (day) => {
        const slots = formData.availabilitySlots || [];
        const existingIndex = slots.findIndex(s => s.day === day);

        if (existingIndex >= 0) {
            updateFormData('availabilitySlots', slots.filter((_, i) => i !== existingIndex));
        } else {
            updateFormData('availabilitySlots', [...slots, { day, startTime: '09:00', endTime: '18:00', isAvailable: true }]);
        }
    };

    const updateSlotTime = (day, field, value) => {
        const slots = formData.availabilitySlots || [];
        updateFormData('availabilitySlots', slots.map(s =>
            s.day === day ? { ...s, [field]: value } : s
        ));
    };

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Availability & Pricing</h2>
                <p className="text-gray-600">Set your schedule and pricing for mentorship sessions.</p>
            </div>

            <div className="space-y-6">
                {/* Session Settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Sessions Per Week
                        </label>
                        <select
                            value={formData.sessionsPerWeek}
                            onChange={(e) => updateFormData('sessionsPerWeek', parseInt(e.target.value))}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                <option key={n} value={n}>{n} session{n > 1 ? 's' : ''}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                            <Clock className="inline w-4 h-4 mr-1" />
                            Session Duration
                        </label>
                        <select
                            value={formData.sessionDuration}
                            onChange={(e) => updateFormData('sessionDuration', parseInt(e.target.value))}
                            className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        >
                            <option value={30}>30 minutes</option>
                            <option value={45}>45 minutes</option>
                            <option value={60}>60 minutes</option>
                            <option value={90}>90 minutes</option>
                        </select>
                    </div>
                </div>

                {/* Available Days */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        Available Days
                    </label>
                    <div className="space-y-2">
                        {DAYS.map((day) => {
                            const slot = formData.availabilitySlots?.find(s => s.day === day);
                            const isSelected = !!slot;

                            return (
                                <div
                                    key={day}
                                    className={`
                    flex items-center justify-between p-4 rounded-xl border transition-all
                    ${isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-gray-50 border-gray-200'}
                  `}
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className="flex items-center gap-3"
                                    >
                                        <div className={`
                      w-5 h-5 rounded border-2 flex items-center justify-center transition-all
                      ${isSelected ? 'bg-emerald-800 border-emerald-800' : 'border-gray-400'}
                    `}>
                                            {isSelected && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className={`font-medium ${isSelected ? 'text-emerald-900' : 'text-gray-600'}`}>{day}</span>
                                    </button>

                                    {isSelected && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="time"
                                                value={slot?.startTime || '09:00'}
                                                onChange={(e) => updateSlotTime(day, 'startTime', e.target.value)}
                                                className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm"
                                            />
                                            <span className="text-gray-500">to</span>
                                            <input
                                                type="time"
                                                value={slot?.endTime || '18:00'}
                                                onChange={(e) => updateSlotTime(day, 'endTime', e.target.value)}
                                                className="px-3 py-2 bg-white border border-emerald-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Preferred Currency */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-2">
                        Preferred Currency
                    </label>
                    <p className="text-xs text-gray-500 mb-3">All your session prices will be listed and charged in this currency.</p>
                    <select
                        value={formData.preferredCurrency || 'INR'}
                        onChange={(e) => updateFormData('preferredCurrency', e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none font-medium text-gray-800"
                    >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (C$)</option>
                        <option value="AUD">AUD (A$)</option>
                    </select>
                </div>

                {/* Pricing Plans */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 uppercase tracking-wide mb-3">
                        <DollarSign className="inline w-4 h-4 mr-1" />
                        Pricing Plans (in {formData.preferredCurrency || 'INR'})
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs text-gray-500 mb-2">1 Month</label>
                            <input
                                type="number"
                                value={formData.pricing?.monthlyPrice || ''}
                                onChange={(e) => updateNestedFormData('pricing', 'monthlyPrice', e.target.value)}
                                placeholder="e.g., 5000"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs text-gray-500 mb-2">3 Months</label>
                            <input
                                type="number"
                                value={formData.pricing?.threeMonthPrice || ''}
                                onChange={(e) => updateNestedFormData('pricing', 'threeMonthPrice', e.target.value)}
                                placeholder="e.g., 12000"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <label className="block text-xs text-gray-500 mb-2">6 Months</label>
                            <input
                                type="number"
                                value={formData.pricing?.sixMonthPrice || ''}
                                onChange={(e) => updateNestedFormData('pricing', 'sixMonthPrice', e.target.value)}
                                placeholder="e.g., 20000"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Trial Session */}
                <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Play className="w-5 h-5 text-emerald-700" />
                            <span className="font-medium text-emerald-900">Offer Trial Session?</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => updateNestedFormData('pricing', 'trialAvailable', !formData.pricing?.trialAvailable)}
                            className={`
                w-12 h-6 rounded-full transition-all relative
                ${formData.pricing?.trialAvailable ? 'bg-emerald-600' : 'bg-gray-300'}
              `}
                        >
                            <div className={`
                absolute top-1 w-4 h-4 bg-white rounded-full transition-all
                ${formData.pricing?.trialAvailable ? 'right-1' : 'left-1'}
              `} />
                        </button>
                    </div>

                    {formData.pricing?.trialAvailable && (
                        <div>
                            <label className="block text-xs text-emerald-700 mb-1">Trial Session Price ({formData.preferredCurrency || 'INR'})</label>
                            <input
                                type="number"
                                value={formData.pricing?.trialPrice || ''}
                                onChange={(e) => updateNestedFormData('pricing', 'trialPrice', e.target.value)}
                                placeholder="e.g., 500 (or 0 for free)"
                                className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Step5AvailabilityPricing;
