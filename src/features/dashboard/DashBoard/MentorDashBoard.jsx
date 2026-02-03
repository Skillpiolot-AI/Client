import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import config from '../../config/config';
import { MessageSquare, Clock, Users, Edit, Plus, Calendar, CheckCircle, TrendingUp, PhoneCall } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [mentorData, setMentorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [stats, setStats] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMentorData(),
          fetchAppointments(),
          fetchNotes(),
          fetchDashboardStats(),
          fetchActivityGraph()
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
      const response = await axios.get(`${config.API_BASE_URL}/bookings/mentor/sessions`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      // Handle the case where the API returns an object with a 'bookings' array
      setAppointments(Array.isArray(response.data) ? response.data : response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentors/dashboard-stats`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchActivityGraph = async () => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/mentors/activity-graph`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setGraphData(response.data);
    } catch (error) {
      console.error('Error fetching graph:', error);
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
      const response = await axios.post(`${config.API_BASE_URL}/mentors/add-note`,
        { mentorId: user.id, content: newNote },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setNotes([...notes, response.data]);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  if (loading || !mentorData) {
    return <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-[#1A237E] text-white">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24 border-4 border-white/20 shadow-xl">
                <AvatarImage src={mentorData.imageUrl || "/placeholder.svg?height=96&width=96"} alt={mentorData.name} />
                <AvatarFallback className="bg-white/10 text-white text-3xl font-bold">{mentorData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">{mentorData.name}</h1>
                <p className="text-blue-100 text-lg flex items-center mt-1">
                  <TrendingUp className="mr-2 h-5 w-5 opacity-70" />
                  {mentorData.jobTitle || 'Verified Mentor'}
                </p>
                <div className="flex items-center mt-2 space-x-4 opacity-70 text-sm">
                  <span>{user.email}</span>
                  <span>ID: {user.id.substring(0, 8)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => window.location.href = '/profile'} variant="secondary" className="bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-sm flex items-center">
                <Edit className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8">
        {/* Main stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-wider">Upcoming Sessions</CardTitle>
              <Calendar className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1A237E]">{stats?.upcomingSessions || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Active bookings</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-wider">Completed Overall</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1A237E]">{stats?.completedSessions || 0}</div>
              <p className="text-xs text-green-600 mt-1">Total success</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-wider">Unique Mentees</CardTitle>
              <Users className="h-5 w-5 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1A237E]">{stats?.totalMentees || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Verified users</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between py-4 pb-2">
              <CardTitle className="text-xs font-bold uppercase text-gray-400 tracking-wider">Avg. Call / Day</CardTitle>
              <PhoneCall className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-[#1A237E]">{stats?.avgCallsPerDay || 0}</div>
              <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Performance Chart */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-gray-800">Your Activity</CardTitle>
                  <p className="text-sm text-gray-500">Mentorship sessions over the last 7 days</p>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={graphData}>
                      <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1A237E" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#1A237E" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94A3B8', fontSize: 12 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#1A237E"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Session Tabs */}
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 w-full md:w-auto h-auto">
                <TabsTrigger value="upcoming" className="rounded-lg py-2.5 px-6 font-semibold data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Upcoming Sessions</TabsTrigger>
                <TabsTrigger value="completed" className="rounded-lg py-2.5 px-6 font-semibold data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Completed Sessions</TabsTrigger>
                <TabsTrigger value="notes" className="rounded-lg py-2.5 px-6 font-semibold data-[state=active]:bg-[#1A237E] data-[state=active]:text-white">Mentor Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6">
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'scheduled').length > 0 ? (
                    appointments.filter(a => a.status === 'scheduled').map((appointment) => (
                      <Card key={appointment._id} className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden border-l-4 border-indigo-500">
                        <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center space-x-4">
                            <div className="bg-indigo-50 h-10 w-10 rounded-full flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{appointment.userId.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">Scheduled for {new Date(appointment.scheduledDate).toLocaleString()}</p>
                            </div>
                          </div>
                          <Button className="bg-[#1A237E] hover:bg-indigo-900 shadow-sm" onClick={() => window.open(appointment.meetingLink, '_blank')}>
                            Join Meeting
                          </Button>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                      <Calendar className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-800">No upcoming sessions</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">When students book a call, they will appear here.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-6">
                <div className="space-y-4">
                  {appointments.filter(a => a.status === 'completed').length > 0 ? (
                    appointments.filter(a => a.status === 'completed').map((appointment) => (
                      <Card key={appointment._id} className="border-0 shadow-sm">
                        <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={appointment.userId.profileImage} />
                              <AvatarFallback>{appointment.userId.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-bold text-gray-800">{appointment.userId.name}</h3>
                              <p className="text-sm text-gray-500 font-medium">{new Date(appointment.scheduledDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {appointment.rating ? (
                              <div className="flex items-center bg-green-50 px-3 py-1 rounded-full">
                                <Star className="h-3 w-3 text-green-600 fill-green-600 mr-1.5" />
                                <span className="text-sm font-bold text-green-700">{appointment.rating.overallRating}/5</span>
                              </div>
                            ) : (
                              <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full uppercase tracking-wider">No Rating</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                      <CheckCircle className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-800">No completed sessions</h3>
                      <p className="text-gray-500 max-w-xs mx-auto">Complete your first session to build your profile history.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <Card className="border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex gap-2 mb-8">
                      <Input
                        className="bg-gray-50 border-gray-100 rounded-xl py-6"
                        placeholder="Take a private note about a student or session..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                      />
                      <Button onClick={addNote} className="bg-[#1A237E] h-auto px-8 rounded-xl shrink-0">
                        <Plus className="h-5 w-5 mr-2" /> Add
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {notes.map((note) => (
                        <div key={note._id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                          <p className="text-gray-700 leading-relaxed font-medium">{note.content}</p>
                          <div className="flex items-center mt-3 text-xs text-gray-400 font-bold border-t border-gray-50 pt-3 uppercase tracking-wider">
                            <Clock className="h-3 w-3 mr-1.5" /> {new Date(note.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-md bg-indigo-900 text-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-indigo-300" /> Professional Growth
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                  <p className="text-sm font-medium leading-relaxed">
                    <span className="text-indigo-300 font-bold">AI TIP:</span> Mentors with updated pricing and clear scheduling see 30% more bookings.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-[#1A237E]" /> Your Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <span className="text-sm font-medium text-gray-500">Weekly Goal</span>
                  <span className="text-sm font-bold text-indigo-600">3 / 5 Sessions</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[60%] rounded-full shadow-inner"></div>
                </div>
                <p className="text-xs text-gray-400 font-medium">Keep it up! You're making a difference.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}