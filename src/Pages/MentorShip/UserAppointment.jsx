import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Users, Video, Star, CheckCircle2, Clock, X } from 'lucide-react';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [ratingForm, setRatingForm] = useState({
    appointmentId: null,
    communicationSkills: 0,
    clarityOfGuidance: 0,
    learningOutcomes: 0,
    frequencyAndQualityOfMeetings: 0,
    remarks: ''
  });

  useEffect(() => {
    if (user && user.role === 'User') {
      fetchAppointments(user._id);
    } else {
      setError('User is not logged in or does not have the correct role');
      setIsLoading(false);
    }
  }, [user]);

  const fetchAppointments = async (userId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${config.API_BASE_URL}/user-appointments/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingChange = (field, value) => {
    setRatingForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitRating = async () => {
    try {
      await axios.post(`${config.API_BASE_URL}/submit-rating`, ratingForm, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Rating submitted successfully!');
      setRatingForm({
        appointmentId: null,
        communicationSkills: 0,
        clarityOfGuidance: 0,
        learningOutcomes: 0,
        frequencyAndQualityOfMeetings: 0,
        remarks: ''
      });
      fetchAppointments(user._id);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
          <p className="text-lg text-gray-600 font-medium">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-6">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:px-8 lg:px-12">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">View and manage your booked mentorship sessions</p>
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No appointments yet</h3>
            <p className="text-gray-600 mb-6">Start your mentorship journey by booking a session</p>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-8">
              Find a Mentor
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {appointments.map((appointment) => (
              <Card
                key={appointment._id}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-0 hover:-translate-y-2"
              >
                {/* Mentor Image Section */}
                <div className="relative h-72 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <img
                    src={appointment.mentorId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.mentorId?.name || 'Mentor')}&size=400&background=random`}
                    alt={appointment.mentorId?.name || 'Mentor'}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className={`${getStatusColor(appointment.status)} px-3 py-1 text-xs font-medium rounded-full border`}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Content Section */}
                <CardContent className="p-6 space-y-4">
                  {/* Mentor Name with Verified Badge */}
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {appointment.mentorId?.name || 'Unknown Mentor'}
                    </h2>
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Job Title / Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {appointment.mentorId?.jobTitle || 'Professional Mentor'} who focuses on{' '}
                    {appointment.mentorId?.skills?.slice(0, 2).join(' & ') || 'career guidance'}.
                  </p>

                  {/* Stats Row */}
                  <div className="flex items-center gap-6 py-3 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold text-gray-900">{appointment.mentorId?.experience || 5}+</span>
                      <span className="text-sm">yrs exp</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {new Date(appointment.requestedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Scheduled Date */}
                  {appointment.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl">
                      <Clock className="w-4 h-4" />
                      <span>Scheduled: {new Date(appointment.scheduledDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    {appointment.meetLink && (
                      <a
                        href={appointment.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300">
                          <Video className="w-4 h-4 mr-2" />
                          Join Meet
                        </Button>
                      </a>
                    )}
                    {appointment.status === 'completed' && !appointment.rating && (
                      <Button
                        onClick={() => setRatingForm(prev => ({ ...prev, appointmentId: appointment._id }))}
                        variant="outline"
                        className="flex-1 rounded-full py-3 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 font-medium transition-all duration-300"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Rate
                      </Button>
                    )}
                    {!appointment.meetLink && appointment.status !== 'completed' && (
                      <Button
                        variant="outline"
                        className="w-full rounded-full py-3 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 font-medium transition-all duration-300"
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rating Modal */}
        {ratingForm.appointmentId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between rounded-t-3xl">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Rate Your Mentor</h3>
                  <p className="text-sm text-gray-500 mt-1">Share your experience to help others</p>
                </div>
                <button
                  onClick={() => setRatingForm(prev => ({ ...prev, appointmentId: null }))}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-6">
                {['communicationSkills', 'clarityOfGuidance', 'learningOutcomes', 'frequencyAndQualityOfMeetings'].map((field) => (
                  <div key={field} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field} className="text-sm font-medium text-gray-700">
                        {field.split(/(?=[A-Z])/).join(' ')}
                      </Label>
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {ratingForm[field]} / 5
                      </span>
                    </div>
                    <Slider
                      id={field}
                      min={0}
                      max={5}
                      step={0.5}
                      value={[ratingForm[field]]}
                      onValueChange={(value) => handleRatingChange(field, value[0])}
                      className="py-2"
                    />
                  </div>
                ))}

                <div className="space-y-3 pt-2">
                  <Label htmlFor="remarks" className="text-sm font-medium text-gray-700">
                    Your Feedback
                  </Label>
                  <Input
                    id="remarks"
                    value={ratingForm.remarks}
                    onChange={(e) => handleRatingChange('remarks', e.target.value)}
                    placeholder="Share your thoughts about the session..."
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 py-3"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-white px-6 py-5 border-t border-gray-100 rounded-b-3xl">
                <Button
                  onClick={handleSubmitRating}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-3 font-medium shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-300 transition-all duration-300"
                >
                  Submit Rating
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UserAppointments;