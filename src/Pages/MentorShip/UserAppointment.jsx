import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../AuthContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
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
    }
  }, [user]);

  const fetchAppointments = async (userId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/user-appointments/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Booked Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <Card key={appointment._id}>
              <CardHeader>
                <CardTitle>{appointment.mentorId?.name || 'Unknown Mentor'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Requested Date: {new Date(appointment.requestedDate).toLocaleDateString()}</p>
                <p>Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</p>
                {appointment.scheduledDate && (
                  <p>Scheduled: {new Date(appointment.scheduledDate).toLocaleString()}</p>
                )}
                {appointment.meetLink && (
                  <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Join Google Meet
                  </a>
                )}
                {appointment.status === 'completed' && !appointment.rating && (
                  <Button onClick={() => setRatingForm(prev => ({ ...prev, appointmentId: appointment._id }))} className="mt-2">
                    Rate Mentor
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {ratingForm.appointmentId && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Rate Your Mentor</h3>
          {['communicationSkills', 'clarityOfGuidance', 'learningOutcomes', 'frequencyAndQualityOfMeetings'].map((field) => (
            <div key={field} className="mb-4">
              <Label htmlFor={field}>{field.split(/(?=[A-Z])/).join(' ')}</Label>
              <Slider
                id={field}
                min={0}
                max={5}
                step={0.5}
                value={[ratingForm[field]]}
                onValueChange={(value) => handleRatingChange(field, value[0])}
              />
              <span>{ratingForm[field]}</span>
            </div>
          ))}
          <div className="mb-4">
            <Label htmlFor="remarks">Remarks</Label>
            <Input
              id="remarks"
              value={ratingForm.remarks}
              onChange={(e) => handleRatingChange('remarks', e.target.value)}
              placeholder="Add your comments here..."
            />
          </div>
          <Button onClick={handleSubmitRating}>Submit Rating</Button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UserAppointments;