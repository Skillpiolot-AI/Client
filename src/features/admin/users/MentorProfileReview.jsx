import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Check,
    X,
    User,
    Clock,
    Trash2,
    UserMinus,
    Eye,
    ChevronDown,
    ChevronUp,
    Calendar,
    AlertTriangle
} from "lucide-react";
import { toast } from 'react-toastify';

export default function MentorProfileReview() {
    const { user } = useAuth();
    const [mentorsWithChanges, setMentorsWithChanges] = useState([]);
    const [expandedMentor, setExpandedMentor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmAction, setConfirmAction] = useState(null);

    useEffect(() => {
        fetchMentorChanges();
    }, []);

    const fetchMentorChanges = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${config.API_BASE_URL}/mentors/admin/change-history`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setMentorsWithChanges(response.data);
        } catch (error) {
            console.error('Error fetching mentor changes:', error);
            toast.error('Failed to fetch mentor changes');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkReviewed = async (mentorProfileId) => {
        try {
            await axios.post(
                `${config.API_BASE_URL}/mentors/admin/mark-reviewed/${mentorProfileId}`,
                {},
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success('Changes marked as reviewed');
            fetchMentorChanges();
        } catch (error) {
            console.error('Error marking as reviewed:', error);
            toast.error('Failed to mark as reviewed');
        }
    };

    const handleChangeRole = async (userId) => {
        try {
            await axios.put(
                `${config.API_BASE_URL}/admin/user-data/users/${userId}`,
                { role: 'User' },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            toast.success('Mentor role changed to User');
            setConfirmAction(null);
            fetchMentorChanges();
        } catch (error) {
            console.error('Error changing role:', error);
            toast.error('Failed to change role');
        }
    };

    const handleDeleteAccount = async (userId) => {
        try {
            await axios.delete(
                `${config.API_BASE_URL}/admin/user-data/users/${userId}`,
                {
                    headers: { Authorization: `Bearer ${user.token}` },
                    data: { reason: 'Removed by admin' }
                }
            );
            toast.success('Account deleted successfully');
            setConfirmAction(null);
            fetchMentorChanges();
        } catch (error) {
            console.error('Error deleting account:', error);
            toast.error('Failed to delete account');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Profile Changes</h1>
                    <p className="text-gray-500 mt-1">View profile updates made by mentors and manage their accounts</p>
                </div>
                <Badge variant="outline" className="px-4 py-1 text-sm font-semibold border-indigo-200 text-indigo-700 bg-indigo-50">
                    {mentorsWithChanges.length} With Changes
                </Badge>
            </div>

            {/* Confirmation Modal */}
            {confirmAction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="max-w-md w-full mx-4">
                        <CardHeader className="bg-red-50 border-b">
                            <CardTitle className="flex items-center text-red-700">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Confirm {confirmAction.type === 'delete' ? 'Delete' : 'Role Change'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="text-gray-700 mb-6">
                                {confirmAction.type === 'delete'
                                    ? `Are you sure you want to permanently delete ${confirmAction.name}'s account? This action cannot be undone.`
                                    : `Are you sure you want to change ${confirmAction.name}'s role from Mentor to regular User?`
                                }
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => setConfirmAction(null)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => confirmAction.type === 'delete'
                                        ? handleDeleteAccount(confirmAction.userId)
                                        : handleChangeRole(confirmAction.userId)
                                    }
                                >
                                    {confirmAction.type === 'delete' ? 'Delete Account' : 'Change Role'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {mentorsWithChanges.length === 0 ? (
                <Card className="bg-gray-50 border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center p-12">
                        <Check className="h-12 w-12 text-green-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">No mentor profile changes to review.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {mentorsWithChanges.map((mentor) => (
                        <Card key={mentor._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gray-50 border-b p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden">
                                            {mentor.imageUrl ? (
                                                <img src={mentor.imageUrl} alt={mentor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="h-6 w-6 text-indigo-600" />
                                            )}
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-800">{mentor.displayName || mentor.name}</span>
                                            <span className="text-gray-500 block text-sm">{mentor.email}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right text-sm">
                                            <div className="text-gray-500">Sessions: <span className="font-semibold text-gray-700">{mentor.currentSessionStats?.completed || 0} completed</span></div>
                                            <div className="text-gray-400">{mentor.currentSessionStats?.pending || 0} pending</div>
                                        </div>
                                        <Badge className={`${mentor.unreviewedChanges?.length > 0 ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                                            {mentor.unreviewedChanges?.length || 0} Changes
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="p-4">
                                {/* Change History */}
                                {mentor.unreviewedChanges?.length > 0 && (
                                    <div className="mb-4">
                                        <button
                                            className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                                            onClick={() => setExpandedMentor(expandedMentor === mentor._id ? null : mentor._id)}
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Change History
                                            {expandedMentor === mentor._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </button>

                                        {expandedMentor === mentor._id && (
                                            <div className="mt-4 space-y-4">
                                                {mentor.unreviewedChanges.map((change, idx) => (
                                                    <div key={idx} className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(change.changedAt).toLocaleString()}
                                                            <Badge variant="outline" className="ml-auto text-xs">
                                                                {change.changes?.length || 0} fields changed
                                                            </Badge>
                                                        </div>

                                                        <div className="space-y-2">
                                                            {change.changes?.map((c, i) => (
                                                                <div key={i} className="grid grid-cols-3 gap-4 text-sm">
                                                                    <div className="font-semibold text-gray-600 capitalize">{c.field}</div>
                                                                    <div className="text-red-600 bg-red-50 px-2 py-1 rounded line-through">
                                                                        {typeof c.oldValue === 'object' ? JSON.stringify(c.oldValue).slice(0, 50) : String(c.oldValue || 'N/A').slice(0, 50)}
                                                                    </div>
                                                                    <div className="text-green-600 bg-green-50 px-2 py-1 rounded">
                                                                        {typeof c.newValue === 'object' ? JSON.stringify(c.newValue).slice(0, 50) : String(c.newValue || 'N/A').slice(0, 50)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {change.sessionStats && (
                                                            <div className="mt-3 text-xs text-gray-400">
                                                                At time of change: {change.sessionStats.completed} completed, {change.sessionStats.pending} pending
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    {mentor.unreviewedChanges?.length > 0 && (
                                        <Button
                                            variant="outline"
                                            className="border-green-200 text-green-600 hover:bg-green-50"
                                            onClick={() => handleMarkReviewed(mentor.mentorProfileId)}
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Mark Reviewed
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                                        onClick={() => setConfirmAction({
                                            type: 'role',
                                            userId: mentor._id,
                                            name: mentor.name
                                        })}
                                    >
                                        <UserMinus className="h-4 w-4 mr-2" />
                                        Change to User
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50"
                                        onClick={() => setConfirmAction({
                                            type: 'delete',
                                            userId: mentor._id,
                                            name: mentor.name
                                        })}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Delete Account
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
