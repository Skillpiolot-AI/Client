import React, { useState } from 'react';
import { Check, X, MessageSquare, Loader2 } from 'lucide-react';

const ActionButtons = ({
    applicationId,
    status,
    onApprove,
    onReject,
    onRequestInfo,
    isProcessing
}) => {
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [infoRequest, setInfoRequest] = useState('');
    const [adminNotes, setAdminNotes] = useState('');

    const handleApprove = () => {
        onApprove(applicationId, adminNotes);
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }
        onReject(applicationId, rejectionReason, adminNotes);
        setShowRejectModal(false);
        setRejectionReason('');
    };

    const handleRequestInfo = () => {
        if (!infoRequest.trim()) {
            alert('Please specify what information is needed');
            return;
        }
        onRequestInfo(applicationId, infoRequest);
        setShowInfoModal(false);
        setInfoRequest('');
    };

    // Don't show actions for already processed applications
    if (status === 'Approved' || status === 'Rejected') {
        return (
            <div className="flex items-center justify-center py-4">
                <span className={`text-sm font-medium ${status === 'Approved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    Application has been {status.toLowerCase()}
                </span>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Admin Notes */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Admin Notes (Optional)
                    </label>
                    <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Add internal notes about this application..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm 
              focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none
              placeholder:text-gray-400"
                        rows={2}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleApprove}
                        disabled={isProcessing}
                        className="action-btn-approve flex-1 min-w-[140px] flex items-center justify-center gap-2 
              px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Check className="w-5 h-5" />
                        )}
                        Approve
                    </button>

                    <button
                        onClick={() => setShowRejectModal(true)}
                        disabled={isProcessing}
                        className="action-btn-reject flex-1 min-w-[140px] flex items-center justify-center gap-2 
              px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <X className="w-5 h-5" />
                        Reject
                    </button>

                    <button
                        onClick={() => setShowInfoModal(true)}
                        disabled={isProcessing}
                        className="action-btn-info flex-1 min-w-[140px] flex items-center justify-center gap-2 
              px-6 py-3 text-white font-semibold rounded-xl transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MessageSquare className="w-5 h-5" />
                        Request Info
                    </button>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Reject Application
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Please provide a reason for rejecting this application. This will be shared with the applicant.
                        </p>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Enter rejection reason..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm 
                focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none
                placeholder:text-gray-400"
                            rows={4}
                            autoFocus
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 
                  font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2.5 bg-red-500 text-white font-medium 
                  rounded-xl hover:bg-red-600 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Info Modal */}
            {showInfoModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop bg-black/50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 modal-content">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            Request More Information
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Specify what additional information you need from the applicant.
                        </p>
                        <textarea
                            value={infoRequest}
                            onChange={(e) => setInfoRequest(e.target.value)}
                            placeholder="Enter your request for additional information..."
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none
                placeholder:text-gray-400"
                            rows={4}
                            autoFocus
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 
                  font-medium rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRequestInfo}
                                className="flex-1 px-4 py-2.5 bg-blue-500 text-white font-medium 
                  rounded-xl hover:bg-blue-600 transition-colors"
                            >
                                Send Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ActionButtons;
