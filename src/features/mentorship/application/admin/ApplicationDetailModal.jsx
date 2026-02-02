import React from 'react';
import {
    X,
    Briefcase,
    MapPin,
    Clock,
    Calendar,
    Users,
    Globe,
    Mail,
    Phone,
    Linkedin,
    Twitter,
    Github,
    GraduationCap,
    Award,
    DollarSign,
    BookOpen,
    Building2,
    Star,
    ExternalLink
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionButtons from './ActionButtons';

const ApplicationDetailModal = ({
    application,
    onClose,
    onApprove,
    onReject,
    onRequestInfo,
    isProcessing
}) => {
    if (!application) return null;

    const {
        _id,
        name,
        email,
        phone,
        jobTitle,
        currentCompany,
        companiesWorked = [],
        experience,
        profileImage,
        bio,
        tagline,
        expertise = [],
        targetingDomains = [],
        targetAudience = [],
        languages = [],
        location = {},
        sessionsPerWeek,
        sessionDuration,
        availabilitySlots = [],
        pricing = {},
        referralsInTopCompanies,
        topCompanyReferrals = [],
        education = [],
        certifications = [],
        socialLinks = {},
        curriculum = {},
        status,
        submittedAt,
        trackingId,
        moreInfoRequest,
        moreInfoResponse
    } = application;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const SectionHeader = ({ icon: Icon, title }) => (
        <div className="section-header">
            <Icon className="w-5 h-5 text-indigo-500" />
            <span>{title}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/60 backdrop-blur-sm p-4">
            <div className="modal-content bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header with Cover */}
                <div className="profile-cover h-32 relative flex-shrink-0">
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm 
              rounded-full flex items-center justify-center text-white hover:bg-white/30 
              transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Profile Image - Overlapping */}
                    <div className="absolute -bottom-12 left-8">
                        <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 
                  flex items-center justify-center text-white font-bold text-2xl">
                                    {getInitials(name)}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute bottom-4 right-8">
                        <StatusBadge status={status} />
                    </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* Name and Title Section */}
                    <div className="px-8 pt-16 pb-6 border-b border-gray-100">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    {name}
                                    <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                </h2>
                                <p className="text-gray-600 flex items-center gap-2 mt-1">
                                    <Briefcase className="w-4 h-4" />
                                    {jobTitle}
                                    {currentCompany && (
                                        <span className="text-gray-400">@ {currentCompany}</span>
                                    )}
                                </p>
                                {tagline && (
                                    <p className="text-gray-500 text-sm mt-2 italic">"{tagline}"</p>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="flex gap-6">
                                <div className="stat-card px-4 py-3 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{experience}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Yrs Exp</div>
                                </div>
                                <div className="stat-card px-4 py-3 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{sessionsPerWeek || 1}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Sessions/Week</div>
                                </div>
                                <div className="stat-card px-4 py-3 rounded-xl text-center">
                                    <div className="text-2xl font-bold text-indigo-600">{sessionDuration || 60}</div>
                                    <div className="text-xs text-gray-500 mt-0.5">Min/Session</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Grid */}
                    <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - About & Details */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Bio Section */}
                            {bio && (
                                <div>
                                    <SectionHeader icon={BookOpen} title="About" />
                                    <p className="text-gray-600 leading-relaxed">{bio}</p>
                                </div>
                            )}

                            {/* Contact Info */}
                            <div>
                                <SectionHeader icon={Mail} title="Contact Information" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500">Email</div>
                                            <div className="text-sm font-medium text-gray-800">{email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Phone className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500">Phone</div>
                                            <div className="text-sm font-medium text-gray-800">{phone}</div>
                                        </div>
                                    </div>
                                    {location?.city && (
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                            <MapPin className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <div className="text-xs text-gray-500">Location</div>
                                                <div className="text-sm font-medium text-gray-800">
                                                    {location.city}{location.state && `, ${location.state}`}
                                                    {location.country && `, ${location.country}`}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <Calendar className="w-5 h-5 text-gray-400" />
                                        <div>
                                            <div className="text-xs text-gray-500">Applied On</div>
                                            <div className="text-sm font-medium text-gray-800">{formatDate(submittedAt)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Expertise */}
                            {expertise.length > 0 && (
                                <div>
                                    <SectionHeader icon={Award} title="Expertise" />
                                    <div className="flex flex-wrap gap-2">
                                        {expertise.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="expertise-tag px-3 py-1.5 text-sm font-medium text-indigo-700 
                          rounded-full"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Target Domains */}
                            {targetingDomains.length > 0 && (
                                <div>
                                    <SectionHeader icon={Globe} title="Targeting Domains" />
                                    <div className="flex flex-wrap gap-2">
                                        {targetingDomains.map((domain, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 text-sm font-medium text-purple-700 
                          bg-purple-50 border border-purple-200 rounded-full"
                                            >
                                                {domain}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Work Experience */}
                            {companiesWorked.length > 0 && (
                                <div>
                                    <SectionHeader icon={Building2} title="Companies Worked" />
                                    <div className="flex flex-wrap gap-2">
                                        {companiesWorked.map((company, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 text-sm font-medium text-gray-700 
                          bg-gray-100 rounded-full flex items-center gap-2"
                                            >
                                                <Building2 className="w-3.5 h-3.5" />
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Education */}
                            {education.length > 0 && (
                                <div>
                                    <SectionHeader icon={GraduationCap} title="Education" />
                                    <div className="space-y-3">
                                        {education.map((edu, index) => (
                                            <div key={index} className="timeline-item pb-3">
                                                <div className="font-medium text-gray-900">{edu.degree}</div>
                                                <div className="text-sm text-gray-600">{edu.institution}</div>
                                                {edu.year && (
                                                    <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Certifications */}
                            {certifications.length > 0 && (
                                <div>
                                    <SectionHeader icon={Award} title="Certifications" />
                                    <div className="space-y-2">
                                        {certifications.map((cert, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 
                          border border-amber-200 rounded-xl"
                                            >
                                                <Award className="w-5 h-5 text-amber-500" />
                                                <div>
                                                    <div className="font-medium text-gray-900">{cert.name}</div>
                                                    {cert.issuer && (
                                                        <div className="text-xs text-gray-500">{cert.issuer}</div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* More Info Request/Response */}
                            {moreInfoRequest && (
                                <div>
                                    <SectionHeader icon={Mail} title="Information Request" />
                                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                                        <div>
                                            <div className="text-xs text-blue-600 font-medium mb-1">Request Details:</div>
                                            <p className="text-sm text-gray-700">{moreInfoRequest.requestDetails}</p>
                                        </div>
                                        {moreInfoResponse && (
                                            <div className="pt-3 border-t border-blue-200">
                                                <div className="text-xs text-green-600 font-medium mb-1">Applicant Response:</div>
                                                <p className="text-sm text-gray-700">{moreInfoResponse.response}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column - Sidebar */}
                        <div className="space-y-6">
                            {/* Tracking Info */}
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <div className="text-xs text-gray-500 mb-1">Tracking ID</div>
                                <div className="font-mono text-sm font-medium text-gray-800">{trackingId}</div>
                            </div>

                            {/* Languages */}
                            {languages.length > 0 && (
                                <div>
                                    <SectionHeader icon={Globe} title="Languages" />
                                    <div className="flex flex-wrap gap-2">
                                        {languages.map((lang, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 text-sm font-medium text-gray-700 
                          bg-gray-100 rounded-full"
                                            >
                                                {lang}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Target Audience */}
                            {targetAudience.length > 0 && (
                                <div>
                                    <SectionHeader icon={Users} title="Target Audience" />
                                    <div className="flex flex-wrap gap-2">
                                        {targetAudience.map((audience, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 text-sm font-medium text-emerald-700 
                          bg-emerald-50 border border-emerald-200 rounded-full"
                                            >
                                                {audience}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pricing */}
                            {(pricing.monthlyPrice || pricing.trialAvailable) && (
                                <div>
                                    <SectionHeader icon={DollarSign} title="Pricing" />
                                    <div className="space-y-2">
                                        {pricing.trialAvailable && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                                                <div className="text-xs text-green-600 font-medium">Trial Session</div>
                                                <div className="text-lg font-bold text-green-700">
                                                    {pricing.trialPrice > 0 ? `₹${pricing.trialPrice}` : 'Free'}
                                                </div>
                                            </div>
                                        )}
                                        {pricing.monthlyPrice > 0 && (
                                            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                                                <div className="text-xs text-indigo-600 font-medium">1 Month</div>
                                                <div className="text-lg font-bold text-indigo-700">₹{pricing.monthlyPrice}</div>
                                            </div>
                                        )}
                                        {pricing.threeMonthPrice > 0 && (
                                            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                                                <div className="text-xs text-purple-600 font-medium">3 Months</div>
                                                <div className="text-lg font-bold text-purple-700">₹{pricing.threeMonthPrice}</div>
                                            </div>
                                        )}
                                        {pricing.sixMonthPrice > 0 && (
                                            <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl">
                                                <div className="text-xs text-pink-600 font-medium">6 Months</div>
                                                <div className="text-lg font-bold text-pink-700">₹{pricing.sixMonthPrice}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Referrals */}
                            {referralsInTopCompanies && topCompanyReferrals.length > 0 && (
                                <div>
                                    <SectionHeader icon={Star} title="Referral Companies" />
                                    <div className="flex flex-wrap gap-2">
                                        {topCompanyReferrals.map((company, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1.5 text-sm font-medium text-amber-700 
                          bg-amber-50 border border-amber-200 rounded-full flex items-center gap-1"
                                            >
                                                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                                {company}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Links */}
                            {Object.keys(socialLinks).length > 0 && (
                                <div>
                                    <SectionHeader icon={Globe} title="Social Links" />
                                    <div className="space-y-2">
                                        {socialLinks.linkedin && (
                                            <a
                                                href={socialLinks.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 
                          rounded-xl hover:bg-blue-100 transition-colors"
                                            >
                                                <Linkedin className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-700">LinkedIn</span>
                                                <ExternalLink className="w-4 h-4 text-blue-400 ml-auto" />
                                            </a>
                                        )}
                                        {socialLinks.twitter && (
                                            <a
                                                href={socialLinks.twitter}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-200 
                          rounded-xl hover:bg-sky-100 transition-colors"
                                            >
                                                <Twitter className="w-5 h-5 text-sky-500" />
                                                <span className="text-sm font-medium text-sky-700">Twitter</span>
                                                <ExternalLink className="w-4 h-4 text-sky-400 ml-auto" />
                                            </a>
                                        )}
                                        {socialLinks.github && (
                                            <a
                                                href={socialLinks.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 
                          rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <Github className="w-5 h-5 text-gray-700" />
                                                <span className="text-sm font-medium text-gray-700">GitHub</span>
                                                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                                            </a>
                                        )}
                                        {socialLinks.website && (
                                            <a
                                                href={socialLinks.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 
                          rounded-xl hover:bg-indigo-100 transition-colors"
                                            >
                                                <Globe className="w-5 h-5 text-indigo-600" />
                                                <span className="text-sm font-medium text-indigo-700">Website</span>
                                                <ExternalLink className="w-4 h-4 text-indigo-400 ml-auto" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer - Action Buttons */}
                <div className="flex-shrink-0 px-8 py-6 border-t border-gray-100 bg-gray-50">
                    <ActionButtons
                        applicationId={_id}
                        status={status}
                        onApprove={onApprove}
                        onReject={onReject}
                        onRequestInfo={onRequestInfo}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;
