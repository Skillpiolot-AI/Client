import React from 'react';

const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'Pending':
                return {
                    bg: 'bg-yellow-100',
                    text: 'text-yellow-800',
                    border: 'border-yellow-300',
                    dot: 'bg-yellow-500',
                    animation: 'animate-pulse'
                };
            case 'Under Review':
                return {
                    bg: 'bg-blue-100',
                    text: 'text-blue-800',
                    border: 'border-blue-300',
                    dot: 'bg-blue-500',
                    animation: ''
                };
            case 'Approved':
                return {
                    bg: 'bg-green-100',
                    text: 'text-green-800',
                    border: 'border-green-300',
                    dot: 'bg-green-500',
                    animation: ''
                };
            case 'Rejected':
                return {
                    bg: 'bg-red-100',
                    text: 'text-red-800',
                    border: 'border-red-300',
                    dot: 'bg-red-500',
                    animation: ''
                };
            case 'More Info Requested':
                return {
                    bg: 'bg-purple-100',
                    text: 'text-purple-800',
                    border: 'border-purple-300',
                    dot: 'bg-purple-500',
                    animation: 'animate-pulse'
                };
            default:
                return {
                    bg: 'bg-gray-100',
                    text: 'text-gray-800',
                    border: 'border-gray-300',
                    dot: 'bg-gray-500',
                    animation: ''
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
        ${config.bg} ${config.text} border ${config.border}`}
        >
            <span className={`w-2 h-2 rounded-full ${config.dot} ${config.animation}`} />
            {status}
        </span>
    );
};

export default StatusBadge;
