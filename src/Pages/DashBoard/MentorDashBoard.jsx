import React, { useState, useEffect } from 'react';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import config from '../../config';
import { MessageSquare, Clock, Users, Edit, Plus, Calendar, CheckCircle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function MentorDashboard() {
  const { user } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchMentorData();
    fetchAppointments();
    fetchNotes();
  }, []);

  const fetchMentorData = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentors/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMentorData(response.data);
    } catch (error) {
      console.error('Error fetching mentor data:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentor-appointments/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentor-notes/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const addNote = async () => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/mentor-notes`, 
        { mentorId: user.id, content: newNote },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (!mentorData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20 border-4 border-white">
                <AvatarImage src={mentorData.imageUrl || "/placeholder.svg?height=80&width=80"} alt={mentorData.name} />
                <AvatarFallback>{mentorData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{mentorData.name}</h1>
                <p className="text-xl">{mentorData.jobTitle}</p>
                <p className="text-sm">{mentorData.email}</p>
              </div>
            </div>
            <Button variant="secondary" className="flex items-center">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Mentor stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sessions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{appointments.filter(a => a.status === 'completed').length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Mentees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{new Set(appointments.map(a => a.userId)).size}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for appointments and notes */}
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            <TabsTrigger value="completed">Completed Sessions</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter(a => a.status === 'scheduled').map((appointment) => (
                  <div key={appointment._id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{appointment.userId.name}</h3>
                        <p className="text-sm text-gray-600">{new Date(appointment.scheduledDate).toLocaleString()}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" /> Join Meeting
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {appointments.filter(a => a.status === 'completed').map((appointment) => (
                  <div key={appointment._id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{appointment.userId.name}</h3>
                        <p className="text-sm text-gray-600">{new Date(appointment.scheduledDate).toLocaleString()}</p>
                      </div>
                      {appointment.rating && (
                        <div className="flex items-center">
                          <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Rating: {appointment.rating.overallRating}/5</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a new note..."
                  />
                  <Button onClick={addNote} className="mt-2">
                    <Plus className="mr-2 h-4 w-4" /> Add Note
                  </Button>
                </div>
                {notes.map((note) => (
                  <div key={note._id} className="mb-4 p-4 bg-white rounded-lg shadow">
                    <p>{note.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}