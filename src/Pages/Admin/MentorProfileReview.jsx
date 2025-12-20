import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, User, Clock, Info } from "lucide-react";
import { toast } from 'react-toastify';

export default function MentorProfileReview() {
    const { user } = useAuth();
    const [pendingMentors, setPendingMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingReviews();
    }, []);

    const fetchPendingReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_BASE_URL}/mentors/admin/pending-updates`);
            setPendingMentors(response.data);
        } catch (error) {
            console.error('Error fetching pending reviews:', error);
            toast.error('Failed to fetch pending reviews');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (mentorId, action) => {
        try {
            if (action === 'approve') {
                await axios.post(`${config.API_BASE_URL}/mentors/admin/approve-profile-update/${mentorId}`);
                toast.success('Profile update approved');
            } else {
                await axios.post(`${config.API_BASE_URL}/mentors/admin/reject-profile-update/${mentorId}`);
                toast.success('Profile update rejected');
            }
            fetchPendingReviews();
        } catch (error) {
            console.error(`Error ${action}ing profile update:`, error);
            toast.error(`Failed to ${action} update`);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading pending reviews...</div>;
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Update Requests</h1>
                    <p className="text-gray-500 mt-1">Review and approve changes submitted by mentors</p>
                </div>
                <Badge variant="outline" className="px-4 py-1 text-sm font-semibold border-indigo-200 text-indigo-700 bg-indigo-50">
                    {pendingMentors.length} Pending
                </Badge>
            </div>

            {pendingMentors.length === 0 ? (
                <Card className="bg-gray-50 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center p-12">
                        <Check className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No pending profile update requests to review.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {pendingMentors.map((mentor) => (
                        <Card key={mentor._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gray-50 border-b p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <User className="h-5 w-5 text-gray-400" />
                                        <span className="font-bold text-gray-800">{mentor.name}</span>
                                        <span className="text-gray-400">|</span>
                                        <span className="text-sm text-gray-500">{mentor.email}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-400 font-medium">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Requested on {new Date(mentor.updatedAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="p-6 border-r border-gray-100">
                                        <h4 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-4">Current Profile</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 block uppercase">Tagline</span>
                                                <p className="text-sm text-gray-700">{mentor.mentorProfile?.tagline || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-gray-400 block uppercase">Bio</span>
                                                <p className="text-sm text-gray-700 line-clamp-3">{mentor.mentorProfile?.bio || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-indigo-50/30">
                                        <h4 className="text-xs font-bold uppercase text-indigo-400 tracking-widest mb-4">Proposed Changes</h4>
                                        <div className="space-y-3">
                                            <div>
                                                <span className="text-xs font-semibold text-indigo-400 block uppercase">Tagline</span>
                                                <p className="text-sm text-gray-900 font-medium">{mentor.mentorProfile?.pendingChanges?.tagline || mentor.mentorProfile?.tagline}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs font-semibold text-indigo-400 block uppercase">Bio</span>
                                                <p className="text-sm text-gray-900 font-medium">{mentor.mentorProfile?.pendingChanges?.bio || mentor.mentorProfile?.bio}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-4 border-t flex justify-end space-x-3">
                                    <Button
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={() => handleAction(mentor._id, 'reject')}
                                    >
                                        <X className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                    <Button
                                        className="bg-[#1A237E] hover:bg-indigo-900"
                                        onClick={() => handleAction(mentor._id, 'approve')}
                                    >
                                        <Check className="h-4 w-4 mr-2" /> Approve Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
