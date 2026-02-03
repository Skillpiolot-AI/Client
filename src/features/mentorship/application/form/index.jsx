import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from '../../../config/config';
import StepProgress from './StepProgress';
import Sidebar from './Sidebar';
import Step1PersonalInfo from './Step1PersonalInfo';
import Step2ProfessionalInfo from './Step2ProfessionalInfo';
import Step3ProfileDetails from './Step3ProfileDetails';
import Step4MentorshipSettings from './Step4MentorshipSettings';
import Step5AvailabilityPricing from './Step5AvailabilityPricing';
import Step6AdditionalInfo from './Step6AdditionalInfo';

const STEPS = [
    { id: 1, name: 'Personal Info', icon: '👤' },
    { id: 2, name: 'Professional', icon: '💼' },
    { id: 3, name: 'Profile', icon: '📝' },
    { id: 4, name: 'Mentorship', icon: '🎯' },
    { id: 5, name: 'Availability', icon: '📅' },
    { id: 6, name: 'Additional', icon: '✨' }
];

const ApplicationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedTrackingId, setSubmittedTrackingId] = useState(null);

    // Dropdown data from API
    const [jobTitles, setJobTitles] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form data state
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        name: '',
        email: '',
        phone: '',

        // Step 2: Professional Info
        jobTitle: '',
        currentCompany: '',
        companiesWorked: [],
        experience: '',

        // Step 3: Profile Details
        profileImage: '',
        tagline: '',
        bio: '',
        expertise: [],

        // Step 4: Mentorship Settings
        targetingDomains: [],
        targetAudience: ['Fresher', 'Working Professional'],
        languages: ['English'],
        location: { city: '', state: '', country: 'India' },

        // Step 5: Availability & Pricing
        sessionsPerWeek: 1,
        sessionDuration: 60,
        availabilitySlots: [],
        pricing: {
            monthlyPrice: '',
            threeMonthPrice: '',
            sixMonthPrice: '',
            trialAvailable: false,
            trialPrice: ''
        },

        // Step 6: Additional Info
        referralsInTopCompanies: false,
        topCompanyReferrals: [],
        education: [],
        certifications: [],
        socialLinks: {
            linkedIn: '',
            github: '',
            twitter: '',
            portfolio: ''
        },
        curriculum: { available: false, description: '' }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobTitlesResponse, companiesResponse] = await Promise.all([
                    axios.get(`${config.API_BASE_URL}/job/job-titles`),
                    axios.get(`${config.API_BASE_URL}/job/companies`)
                ]);
                setJobTitles(jobTitlesResponse.data);
                setCompanies(companiesResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load form data. Please try again later.');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const updateNestedFormData = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [field]: value
            }
        }));
    };

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleStepClick = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/applications/submit-application`, formData);
            setSubmittedTrackingId(response.data.trackingId);
            toast.success('Application submitted successfully!');
        } catch (error) {
            console.error('Error submitting application:', error);
            toast.error(error.response?.data?.error || 'Failed to submit application. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        const stepProps = {
            formData,
            updateFormData,
            updateNestedFormData,
            jobTitles,
            companies
        };

        switch (currentStep) {
            case 1:
                return <Step1PersonalInfo {...stepProps} />;
            case 2:
                return <Step2ProfessionalInfo {...stepProps} />;
            case 3:
                return <Step3ProfileDetails {...stepProps} />;
            case 4:
                return <Step4MentorshipSettings {...stepProps} />;
            case 5:
                return <Step5AvailabilityPricing {...stepProps} />;
            case 6:
                return <Step6AdditionalInfo {...stepProps} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-stone-200 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-800 mx-auto"></div>
                    <p className="text-lg text-gray-600 font-medium">Loading application form...</p>
                </div>
            </div>
        );
    }

    if (submittedTrackingId) {
        return (
            <div className="min-h-screen bg-stone-200 flex items-center justify-center p-6">
                <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🎉</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                    <p className="text-gray-600 mb-6">Your mentor application has been received. We'll review it within 3-5 business days.</p>
                    <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-1">Your Tracking ID</p>
                        <p className="text-2xl font-bold text-emerald-800">{submittedTrackingId}</p>
                    </div>
                    <div className="space-y-3">
                        <a
                            href="/tracker"
                            className="block w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-3 px-6 rounded-full transition-colors"
                        >
                            Track Application Status
                        </a>
                        <button
                            onClick={() => {
                                setSubmittedTrackingId(null);
                                setCurrentStep(1);
                                setFormData({
                                    name: '', email: '', phone: '', jobTitle: '', currentCompany: '',
                                    companiesWorked: [], experience: '', profileImage: '', tagline: '', bio: '',
                                    expertise: [], targetingDomains: [], targetAudience: ['Fresher', 'Working Professional'],
                                    languages: ['English'], location: { city: '', state: '', country: 'India' },
                                    sessionsPerWeek: 1, sessionDuration: 60, availabilitySlots: [],
                                    pricing: { monthlyPrice: '', threeMonthPrice: '', sixMonthPrice: '', trialAvailable: false, trialPrice: '' },
                                    referralsInTopCompanies: false, topCompanyReferrals: [], education: [], certifications: [],
                                    socialLinks: { linkedIn: '', github: '', twitter: '', portfolio: '' },
                                    curriculum: { available: false, description: '' }
                                });
                            }}
                            className="block w-full border-2 border-gray-200 hover:border-emerald-300 text-gray-700 font-medium py-3 px-6 rounded-full transition-colors"
                        >
                            Submit Another Application
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-200">
            {/* Header with Step Progress */}
            <div className="bg-stone-100 border-b border-stone-300">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <StepProgress steps={STEPS} currentStep={currentStep} onStepClick={handleStepClick} />
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex gap-6">
                    {/* Left Sidebar */}
                    <Sidebar
                        currentStep={currentStep}
                        steps={STEPS}
                        onPrevious={handlePrevious}
                        onNext={currentStep === 6 ? handleSubmit : handleNext}
                        isLastStep={currentStep === 6}
                        isSubmitting={isSubmitting}
                    />

                    {/* Right Content Area */}
                    <div className="flex-1 bg-white rounded-3xl shadow-lg p-8">
                        {renderStep()}
                    </div>
                </div>
            </div>

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default ApplicationForm;
