import React from 'react';
import {
    Briefcase,
    MapPin,
    Calendar,
    Clock,
    ChevronRight
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const ApplicationCard = ({ application, onClick }) => {
    const {
        name,
        email,
        jobTitle,
        currentCompany,
        experience,
        profileImage,
        status,
        submittedAt,
        trackingId,
        location,
        expertise = []
    } = application;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div
            onClick={onClick}
            className="application-card bg-white rounded-2xl overflow-hidden shadow-lg 
        border border-gray-100 cursor-pointer group"
        >
            {/* Header with gradient */}
            <div className="profile-cover h-24 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20" />
            </div>

            {/* Profile Image */}
            <div className="relative px-5 -mt-12">
                <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 
              flex items-center justify-center text-white font-bold text-xl">
                            {getInitials(name)}
                        </div>
                    )}
                </div>

                {/* Status Badge - Positioned at top right */}
                <div className="absolute top-2 right-5">
                    <StatusBadge status={status} />
                </div>
            </div>

            {/* Content */}
            <div className="p-5 pt-3 space-y-4">
                {/* Name and Title */}
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 
            transition-colors flex items-center gap-2">
                        {name}
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 
              transform group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        {jobTitle}
                        {currentCompany && (
                            <span className="text-gray-400">@ {currentCompany}</span>
                        )}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="font-semibold text-gray-900">{experience}</span>
                        <span>yrs exp</span>
                    </div>
                    {location?.city && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            <span>{location.city}</span>
                        </div>
                    )}
                </div>

                {/* Expertise Tags */}
                {expertise.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {expertise.slice(0, 3).map((skill, index) => (
                            <span
                                key={index}
                                className="expertise-tag px-2.5 py-1 text-xs font-medium text-indigo-700 
                  rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                        {expertise.length > 3 && (
                            <span className="px-2.5 py-1 text-xs font-medium text-gray-500 
                bg-gray-100 rounded-full">
                                +{expertise.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(submittedAt)}
                    </div>
                    <span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        {trackingId}
                    </span>
                </div>
            </div>

            {/* Hover Overlay */}
            <div className="card-overlay absolute inset-0 flex items-end justify-center pb-4 pointer-events-none">
                <span className="px-4 py-2 bg-white/90 backdrop-blur rounded-full text-sm 
          font-medium text-gray-800 shadow-lg flex items-center gap-2">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    );
};

export default ApplicationCard;
