// Create this file as: src/Pages/University/TeacherDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, BookOpen, Calendar, Settings } from 'lucide-react';
import axios from 'axios';
import config from '../../config/config';
import { toast } from 'react-hot-toast';

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser(response.data);
      setUniversity(response.data.universityId);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}
            {university && ` - ${university.name}`}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Role</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Courses</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Students</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.isActive ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* University Info */}
          <Card>
            <CardHeader>
              <CardTitle>University Information</CardTitle>
            </CardHeader>
            <CardContent>
              {university ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg text-gray-900">{university.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Location</p>
                    <p className="text-lg text-gray-900">
                      {university.location?.city}, {university.location?.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Website</p>
                    <a 
                      href={university.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-lg text-blue-600 hover:underline"
                    >
                      {university.url}
                    </a>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No university information available</p>
              )}
            </CardContent>
          </Card>

          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-lg text-gray-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Username</p>
                  <p className="text-lg text-gray-900">{user?.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Email</p>
                  <p className="text-lg text-gray-900">{user?.email}</p>
                </div>
                {user?.registrationNumber && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registration Number</p>
                    <p className="text-lg text-gray-900">{user.registrationNumber}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-600">Last Login</p>
                  <p className="text-lg text-gray-900">
                    {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            View Courses
          </Button>
          <Button variant="outline">
            Manage Students
          </Button>
          <Button variant="outline">
            Schedule Classes
          </Button>
          <Button variant="outline">
            Generate Reports
          </Button>
        </div>
      </div>
    </div>
  );
}