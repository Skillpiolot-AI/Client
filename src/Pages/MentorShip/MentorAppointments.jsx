import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MentorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'Mentor') {
      fetchAppointments(user._id);
    } else {
      setError('User is not a mentor or not logged in');
    }
  }, [user]);

  const fetchAppointments = async (mentorId) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentor-appointments/${mentorId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Please try again later.');
    }
  };

  const handleScheduleMeeting = async (appointmentId) => {
    try {
      await axios.put(`${config.API_BASE_URL}/schedule-meeting/${appointmentId}`, {
        date: scheduleDate,
        time: scheduleTime,
        meetLink: meetLink
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchAppointments(user._id);
      setScheduleDate('');
      setScheduleTime('');
      setMeetLink('');
      toast.success('Meeting scheduled successfully!');
    } catch (error) {
      console.error('Error scheduling meeting:', error);
      setError('Failed to schedule meeting. Please try again.');
      toast.error('Failed to schedule meeting. Please try again.');
    }
  };

  const handleSessionCompleted = async (appointmentId) => {
    try {
      await axios.put(`${config.API_BASE_URL}/complete-session/${appointmentId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchAppointments(user._id);
      toast.success('Session marked as completed!');
    } catch (error) {
      console.error('Error completing session:', error);
      setError('Failed to mark session as completed. Please try again.');
      toast.error('Failed to mark session as completed. Please try again.');
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
      <h2 className="text-2xl font-bold mb-4">My Appointments</h2>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments found.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li key={appointment._id} className="bg-white shadow rounded-lg p-4">
              <p className="font-semibold">User: {appointment.userId?.name || 'Unknown'}</p>
              <p>Email: {appointment.userId?.email || 'Unknown'}</p>
              <p>Date: {new Date(appointment.date).toLocaleString()}</p>
              <p>Status: {appointment.status}</p>
              {appointment.status === 'pending' && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor={`date-${appointment._id}`}>Date</Label>
                  <Input
                    id={`date-${appointment._id}`}
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                  <Label htmlFor={`time-${appointment._id}`}>Time</Label>
                  <Input
                    id={`time-${appointment._id}`}
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                  <Label htmlFor={`link-${appointment._id}`}>Google Meet Link</Label>
                  <Input
                    id={`link-${appointment._id}`}
                    type="url"
                    value={meetLink}
                    onChange={(e) => setMeetLink(e.target.value)}
                    placeholder="https://meet.google.com/..."
                  />
                  <Button onClick={() => handleScheduleMeeting(appointment._id)}>
                    Schedule Meeting
                  </Button>
                </div>
              )}
              {appointment.status === 'scheduled' && (
                <div className="mt-2">
                  <p>Meeting scheduled for: {new Date(appointment.scheduledDate).toLocaleString()}</p>
                  <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Join Google Meet
                  </a>
                  <Button onClick={() => handleSessionCompleted(appointment._id)} className="mt-2 ml-2">
                    Mark Session as Completed
                  </Button>
                </div>
              )}
              {appointment.status === 'completed' && (
                <p className="mt-2 text-green-600">Session completed</p>
              )}
            </li>
          ))}
        </ul>
      )}
      <ToastContainer />
    </div>
  );
};

export default MentorAppointments;